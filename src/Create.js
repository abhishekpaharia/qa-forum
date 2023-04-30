import { useEffect, useState } from "react";
import CustomAlert from "./CustomAlert";
import { useNavigate } from "react-router-dom";
const Create = ({ account, contract }) => {
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('')
  const [quesWorth, setQuesWorth] = useState(1)
  const [isSuccess, setIsSucces] = useState(0)
  const [quesId, setQuesId] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    contract.QuestionAsked((error, result) => {
      //console.log('questionAsked error', error)
      //console.log('questionAsked resultsss', result)
      if (!error) {
        console.log('balance update questioner = ', result.returnValues.questioner.toLowerCase())
        console.log('account =', account)
        if (result.returnValues.questioner.toLowerCase() === account) {
          setQuesId(result.returnValues.questionId)
        }
      }
    })
  }, [account, contract])

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(contract)
    // console.log("title: ", title)
    // console.log("body: ", body)
    // console.log("quesWorth", quesWorth)
    // console.log("account in askQuestion: ", account)
    contract.askQuestion(title, body, quesWorth, { from: account })
      .then(res => {
        //console.log("ask question result", res);
        setIsSucces(1);
      })
      .catch(err => {
        console.log("error in askQuestion", err.message)
        if (err.message.includes("You don't have enough tokens")) {
          setIsSucces(-1)
        } else {
          setIsSucces(-2);
        }
      })
  }

  return (
    <div className="create">
      <h2>Add a New Question</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Question:</label>
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ height: '100px' }}
        ></textarea>
        <label>Worth (in RP) :</label>
        <input
          fullWidth
          variant="standard"
          type="number"
          onChange={e => {
            if (e.currentTarget.valueAsNumber <= 0) {
              e.currentTarget.value = 0
            } else {
              setQuesWorth(e.currentTarget.value)
            }
          }}
          value={quesWorth}
          style={{ width: '40%' }}
        />
        <button>Add Question</button>
      </form>
      {isSuccess === 1 && <CustomAlert type="success" message={"Question submitted with question id " + quesId} onClose={() => { setIsSucces(0); navigate('/') }} />}
      {isSuccess === -1 && <CustomAlert type="error" message="Not enough balance. purchase more RP" onClose={() => setIsSucces(0)} />}
      {isSuccess === -2 && <CustomAlert type="error" message="Question submission failed" onClose={() => setIsSucces(0)} />}
    </div>
  );
}

export default Create;