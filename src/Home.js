import { useState, useEffect } from "react";
import QuestionList from "./QuestionList";
const Home = () => {
    const [isPending, setIsPending] = useState(true);
    const [questions, setQuestions] = useState(null)
    useEffect(() => {
        console.log('use effect ran');
        setTimeout(()=> {
            setQuestions([
                { reward: '10', text: 'lorem ipsum...', questioner: 'mario', id: 1, resolved: false,  answerIds : []},
                { reward: '20', text: 'lorem ipsum...', questioner: 'yoshi', id: 2, resolved: false,  answerIds : []},
                { reward: '30', text: 'lorem ipsum...', questioner: 'mario', id: 3, resolved: false,  answerIds: []}
              ])
              setIsPending(false);
        }, 1000)
        //console.log(blogs);
      }, [])

    return (
      <div className="home">
        <h2></h2>
        {isPending && <div> Loading ... </div>}
        {questions && <QuestionList title="Questions list" questions={questions}/>}
      </div>
    );
  }
   
  export default Home;

