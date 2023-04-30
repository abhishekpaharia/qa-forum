import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomAlert from "./CustomAlert";
const QuestionDetails = ({ account, contract }) => {
    const { id } = useParams()

    const [question, setQuestion] = useState(null)
    const [ans, setAns] = useState('');
    const [isPostAnsSuccess, setIsPostAnsSuccess] = useState(0)
    const [ansList, setAnsList] = useState([]);
    const [isApproveSuccess, setIsApproveAnsSuccess] = useState(0)
    const [quesResovled, setQuesResolved] = useState(false)
    const [myAnsList, setMyAnsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const handlePostAnswer = (e) => {
        e.preventDefault();
        contract.postAnswer(id, ans, { from: account })
            .then(res => {
                console.log("postAnswer result", res);
                setIsPostAnsSuccess(1);
            })
            .catch(err => {
                console.log(err);
                setIsPostAnsSuccess(-1)
            })
    }

    const handleApprove = (ansId) => {
        contract.resolveQuestion(id, ansId, { from: account })
            .then(res => {
                console.log("resolveQuestion result", res)
                setIsApproveAnsSuccess(1)
            })
            .catch(err => {
                console.log(err)
                setIsApproveAnsSuccess(-1)
            })
    }
    const getAnswers = async () => {
        let contractQues = await contract.questions(id);
        //console.log("contractQues ", i, " :", contractQues)
        let question = {};
        question.id = parseInt(contractQues.id.toString());
        question.title = contractQues.title;
        question.text = contractQues.text;
        question.resolved = contractQues.resolved;
        setQuesResolved(question.resolved)
        question.reward = parseInt(contractQues.reward.toString());
        question.questioner = contractQues.questioner;
        let questionerUser = await contract.users(question.questioner)
        question.questionerName = questionerUser.username

        //---- getting ansIds ---------------
        let v1 = await contract.getAnswerIds(id);
        // console.log("getAnswerIds return", v1);
        // console.log("ans array length", v1.len.toString())
        let ansArrLen = parseInt(v1.len.toString());

        let ansArr = v1.arr;
        let ansArrInt = [];
        for (let j = 0; j < ansArrLen; j++) {
            ansArrInt.push(parseInt(ansArr[j].toString()))
            // console.log("ans arr value at ",j, " is ", v1.arr[j].toString())
        }
        question.answerIds = ansArrInt;
        setQuestion(question)

        let answers = []
        for (let i = 0; i < question.answerIds.length; i++) {
            let contractAns = await contract.answers(question.answerIds[i]);
            //console.log("answer id: ", i, "has Contractanswer", contractAns)
            let ans = {};
            ans.id = parseInt(contractAns.id.toString())
            ans.text = contractAns.text
            ans.answerer = contractAns.answerer
            ans.accepted = contractAns.accepted
            let user = await contract.users(ans.answerer)
            ans.userName = user.username
            answers.push(ans)
        }
        console.log("answers: ", answers)
        setAnsList(answers)
        getMyAnswers(answers)
        setIsLoading(false)
    }

    const getMyAnswers = (answers) => {
        console.log("i am in getMyAnswers")
        let tempList = []
        tempList = answers.filter((ans) => {
            console.log("in filter ", ans.answerer.toLowerCase(), ans.answerer.toLowerCase() === account)
            return ans.answerer.toLowerCase() === account
        })
        console.log("tempList", tempList)
        setMyAnsList(tempList)
        console.log("myAnsList", myAnsList)
    }
    useEffect(() => {
        getAnswers()
    }, [account, contract, quesResovled, isPostAnsSuccess])
    return (
        <div>
            {isLoading && <div>isLoading</div>}
            {!isLoading &&
                <div className="blog-details">
                    <article>
                        <h2>Title : {question.title}</h2>
                        <p>
                            <div>Asked by <b>{question.questionerName}</b></div>
                            <div>Reward Point is <b>{question.reward} RP</b></div>
                            {!quesResovled && <div style={{ display: 'flex', flexDirection: 'row' }}> Status :<div className='blog-open' style={{ textAlign: 'center' }}>open</div></div>}
                            {quesResovled && <div style={{ display: 'flex', flexDirection: 'row' }}>Status : <div className='blog-closed' style={{ textAlign: 'center' }}>closed</div></div>}
                        </p>
                        <div className="blog-details-body">
                            <h3 style={{ color: '#f1356d' }}>Question :</h3>
                            <div className="blog-details-body-text">{question.text}</div>
                        </div>
                    </article>

                    {account !== question.questioner.toLowerCase() &&
                        <div>
                            <form onSubmit={handlePostAnswer} className="post-answer" style={{ display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ color: '#f1356d' }}>Answer :</h3>
                                <textarea
                                    required
                                    value={ans}
                                    onChange={(e) => setAns(e.target.value)}
                                    style={{ height: '100px', marginBottom: '10px' }}
                                    disabled={question.resolved}
                                ></textarea>
                                <button style={{ width: 'fit-content', marginBottom: '10px' }} disabled={question.resolved}>Post Answer</button>
                                {isPostAnsSuccess === 1 && <CustomAlert type="success" message={"Answer is submitted for approval"} onClose={() => { setIsPostAnsSuccess(0); setAns('') }} />}
                                {isPostAnsSuccess === -1 && <CustomAlert type="error" message="Answer submission failed" onClose={() => setIsPostAnsSuccess(0)} />}
                            </form>
                            <div style={{ borderTop: '1px solid #f2f2f2', paddingTop: '10px' }}>
                                <h3 style={{ color: '#f1356d' }}> My Answers:  </h3>
                                {myAnsList == null || myAnsList.length === 0 ?
                                    <h3 style={{ marginTop: '10px' }}> No Answers repiled!!</h3>
                                    :
                                    myAnsList.map((answer) => {
                                        return (
                                            <div key={answer.id} style={{ marginTop: '25px', border: '1px solid #ddd', padding: '10px 16px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <label>Answer Id: {answer.id}</label>
                                                    <div> Posted by <b>{answer.userName}</b></div>
                                                </div>
                                                <div className="blog-details-body-text">{answer.text}</div>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    {answer.accepted && <div style={{ display: 'flex', flexDirection: 'row' }}> Status :<div className='blog-open' style={{ textAlign: 'center' }}>Approved</div></div>}
                                                    {!answer.accepted && quesResovled && <div style={{ display: 'flex', flexDirection: 'row' }}> Status :<div className='blog-closed' style={{ textAlign: 'center' }}>Rejected</div></div>}
                                                    {!answer.accepted && !quesResovled && <div style={{ display: 'flex', flexDirection: 'row' }}> Status :<div className='blog-pending' style={{ textAlign: 'center' }}>Pending</div></div>}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }

                    {account === question.questioner.toLowerCase() &&
                        <div>
                            <div style={{ borderTop: '1px solid #f2f2f2', paddingTop: '10px' }}>
                                <h3 style={{ color: '#f1356d' }}>Answers:  </h3>
                                {isApproveSuccess === 1 && <CustomAlert type="success" message={"Answer is approved"} onClose={() => { setIsApproveAnsSuccess(0); setQuesResolved(true); }} />}
                                {isApproveSuccess === -1 && <CustomAlert type="error" message="Answer approval failed" onClose={() => setIsApproveAnsSuccess(0)} />}
                                {ansList == null || ansList.length === 0 ?
                                    <h3 style={{ marginTop: '10px' }}> No Answers!!</h3>
                                    :
                                    ansList.map((answer) => {
                                        return (
                                            <div key={answer.id} style={{ marginTop: '25px', border: '1px solid #ddd', padding: '10px 16px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <label>Answer Id: {answer.id}</label>
                                                    <div> Posted by <b>{answer.userName}</b></div>
                                                </div>
                                                <div className="blog-details-body-text">{answer.text}</div>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    {!quesResovled && <button id={answer.id} onClick={() => { handleApprove(answer.id) }} style={{ marginTop: '10px' }} disabled={question.resolved}>Approve</button>}
                                                    {answer.accepted && <div style={{ display: 'flex', flexDirection: 'row' }}> Status :<div className='blog-open' style={{ textAlign: 'center' }}>Approved</div></div>}
                                                    {!answer.accepted && quesResovled && <div style={{ display: 'flex', flexDirection: 'row' }}> Status :<div className='blog-closed' style={{ textAlign: 'center' }}>Rejected</div></div>}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>}
        </div>
    );
}

export default QuestionDetails;