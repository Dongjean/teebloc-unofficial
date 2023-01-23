import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import API from '../utils/API';

//component imports
import Question from '../Components/Churn/Question.js';

function SavedQuestionsPage(props) {
    let {Email} = useParams();
    
    const [isLoading, setisLoading] = useState(true)
    const [SavedQuestions, setSavedQuestions] = useState()

    useEffect(() => {
        GetSavedQuestions(Email)
    }, [])

    async function GetSavedQuestions(Email) {
        try {
            const result = await API.get('/Questions/GetSaved/' + Email)
            setSavedQuestions(result.data)
            setisLoading(false)
        } catch(err) {
            console.log(err)
        }
    }
    console.log(SavedQuestions, 'hi')
    return (
        <div>
            {isLoading ?
                null
            :
                <div>
                    {SavedQuestions.Questions.map(SavedQuestion => 
                        <div key={SavedQuestion.questionid}>
                            <button onClick={() => props.OpenQuestion(SavedQuestion.questionid)}>
                                <Question Question={SavedQuestion} FirstQuestionIMG={SavedQuestions.QuestionImages.filter(QuestionImage => QuestionImage.QuestionID == SavedQuestion.questionid)[0]} LoginData={props.LoginData} />
                                <br />
                            </button>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default SavedQuestionsPage;