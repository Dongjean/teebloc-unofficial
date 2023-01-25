import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import API from '../utils/API';

//component imports
import Question from '../Components/Churn/Question.js';

function CompletedQuestionsPage(props) {
    let {Email} = useParams();
    
    const [isLoading, setisLoading] = useState(true)
    const [CompletedQuestions, setCompletedQuestions] = useState()

    useEffect(() => {
        GetCompletedQuestions(Email)
    }, [])

    async function GetCompletedQuestions(Email) {
        try {
            const result = await API.get('/Questions/Get/Completed/' + Email)
            setCompletedQuestions(result.data)
            setisLoading(false)
        } catch(err) {
            console.log(err)
        }
    }
    console.log(CompletedQuestions)
    return (
        <div>
            {isLoading ?
                null
            :
                <div>
                    {CompletedQuestions.Questions.map(CompletedQuestion => 
                        <div key={CompletedQuestion.questionid}>
                            <button onClick={() => props.OpenQuestion(CompletedQuestion.questionid)}>
                                <Question Question={CompletedQuestion} FirstQuestionIMG={CompletedQuestions.QuestionImages.filter(QuestionImage => QuestionImage.QuestionID == CompletedQuestion.questionid)[0]} LoginData={props.LoginData} />
                                <br />
                            </button>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default CompletedQuestionsPage;