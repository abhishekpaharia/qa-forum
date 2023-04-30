import { Link } from 'react-router-dom';

const QuestionList = ({ questions, title }) => {
    return (
        <div className="blog-list">
            <h2>{title}</h2>
            {questions.map(question => (
                <div className="blog-preview" key={question.id} >
                    <Link to={`/questions/${question.id}`}>
                        <div className="blog-inside">
                            <div style={{display:'flex ',flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
                                <h2>Q{question.id} : {question.title}</h2>
                                {!question.resolved && <div className='blog-open'>open</div>}
                                {question.resolved && <div className='blog-closed'>closed</div>}
                            </div>
                            <p style={{ textAlign: 'left'}}>{question.text}</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default QuestionList;