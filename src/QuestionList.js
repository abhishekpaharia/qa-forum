import { Link } from 'react-router-dom';

const QuestionList = ({ questions, title }) => {
    return (
        <div className="blog-list">
            <h2 >{title}</h2>
            {questions.map(question => (
                <div className="blog-preview" key={question.id} >
                    <a to={`/blogs/${question.id}`}>
                        <h2>Question {question.id}</h2>
                        <p>{question.text}</p>
                        <p>Written by {question.questioner}</p>
                    </a>
                </div>
            ))}
        </div>
    );
}

export default QuestionList;