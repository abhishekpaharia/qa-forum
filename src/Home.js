import { useState, useEffect } from "react";
import QuestionList from "./QuestionList";
const Home = ({ account, contract }) => {
  const [isPending, setIsPending] = useState(true);
  const [questions, setQuestions] = useState(null)
  const func = async () => {
    let questCount = await contract.questionCounter()
    //console.log("quesCount", questCount.toString())

    let count = parseInt(questCount.toString());
    //console.log("count", count)
    let questions = [];
    for (let i = 1; i < count; i++) {
      let contractQues = await contract.questions(i);
      //console.log("contractQues ", i, " :", contractQues)
      let ques = {};
      ques.id = parseInt(contractQues.id.toString());
      ques.title = contractQues.title;
      ques.text = contractQues.text;
      ques.resolved = contractQues.resolved;
      ques.reward = parseInt(contractQues.reward.toString());
      ques.questioner = contractQues.questioner;
      let questionerUser = await contract.users(ques.questioner)
      ques.questionerName = questionerUser.username

      //---- getting ansIds ---------------
      let v1 = await contract.getAnswerIds(i);
      // console.log("getAnswerIds return", v1);
      // console.log("ans array length", v1.len.toString())
      let ansArrLen = parseInt(v1.len.toString());

      let ansArr = v1.arr;
      let ansArrInt = [];
      for (let j = 0; j < ansArrLen; j++) {
        ansArrInt.push(parseInt(ansArr[j].toString()))
        // console.log("ans arr value at ",j, " is ", v1.arr[j].toString())
      }
      ques.answerIds = ansArrInt;
      //-----------getting ansIds ends -------------------
      //console.log("question", ques);
      questions.push(ques);
    }

    console.log("questions: ", questions)
    setQuestions(questions)
    setIsPending(false);
  }

  // const func2 = async () => {
  //   let v1 = await contract.getAnswerIds(1)
  //   console.log("getAnswerIds return", v1);
  //   console.log("ans array length", v1.len.toString())
  //   console.log("ans arr", v1.arr[3].toString())
  // }

  useEffect(() => {
    //console.log('use effect ran');
    // setTimeout(() => {
    //   setQuestions([
    //     { questionerName: 'user 1',  title: 'title 1', reward: '10', text: 'lorem ipsum...aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa sssssddddddd dddddd fffff fff fff fff fff fff fff ff fff ffffffff ff ffff ffff fff fff ffff fff fff fffffffffff fff fff fff fff fffffffffffffff', questioner: 'mario', id: 1, resolved: false, answerIds: [] },
    //     { questionerName: 'user 2', title: 'title 2', reward: '20', text: 'lorem ipsum...', questioner: 'yoshi', id: 2, resolved: true, answerIds: [] },
    //     { questionerName: 'user 3', title: 'title 3', reward: '30', text: 'lorem ipsum...', questioner: 'mario', id: 3, resolved: false, answerIds: [] }
    //   ])
    //   setIsPending(false);
    // }, 1000)
    //console.log(blogs);

    func()
    //func2()
  }, [account, contract])

  return (
    <div className="home">
      {isPending && <div> Loading ... </div>}
      {questions == null || questions.length === 0 ?
        <h3 style={{ marginTop: '10px' }}> No Questions yet!!</h3>
        :
        <QuestionList title="Questions list" questions={questions} />
      }
    </div>
  );
}

export default Home;

