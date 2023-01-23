import {useMemo, useState, useEffect}  from 'react';
import {useLocation} from 'react-router-dom';
import API from "../utils/API";

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

function OpenedQuestionPage(props) {
    const query = useQuery()
    const QuestionID = query.get('QuestionID')
    if (!QuestionID) {
        console.log('Invalid Question')
    }

    const [isLoading, setisLoading] = useState(true) //initially page is loading
    const [ShowAnswer, setShowAnswer] = useState(false) //do not initially show the answer
    const [Question, setQuestion] = useState({})

    const [isSaved, setisSaved] = useState(false)

    //runs only on mount
    useEffect(() => {
        GetQuestion(QuestionID)
    }, [])

    //gets the Question info
    async function GetQuestion(QuestionID) {
        try {
            const result = await API.get('/Questions/Get/' + QuestionID)
            setQuestion(result.data)
            CheckSaved(result.data.Question.questionid, props.LoginData.Email)
            setisLoading(false)
        } catch(err) {
            console.log(err)
        }
    }

    async function CheckSaved(QuestionID, Email) {
        try {
            console.log(QuestionID, Email)
            const result = await API.get('/Questions/CheckSaved/' + QuestionID + '/' + Email)
            console.log(result.data)
            setisSaved(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function SaveQuestion(QuestionID, Email) {
        try {
            console.log(QuestionID)
            await API.post('/Questions/Save/' + QuestionID + '/' + Email)
            setisSaved(true)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnsaveQuestion(QuestionID, Email) {
        try {
            console.log(Email)
            await API.post('/Questions/Unsave/' + QuestionID + '/' + Email)
            setisSaved(false)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            {isLoading ?
                null
            :
                <div>
                    Author: {Question.Question.firstname + Question.Question.lastname} <br />
                    Question: <br />
                    {Question.QuestionImages.map(QuestionImage => <div key={QuestionImage.QuestionIMGID}><img src={'data:image/png;base64,' + QuestionImage.QuestionIMGData} alt={QuestionImage.QuestionIMGName} style={{width: 500}} /> <br /></div>)}

                    {ShowAnswer ?
                        <div>
                            Answers: <br />
                            {Question.AnswerImages.map(AnswerImage => <div key={AnswerImage.AnswerIMGID}><img src={'data:image/png;base64,' + AnswerImage.AnswerIMGData} alt={AnswerImage.AnswerIMGName} style={{width: 500}} /> <br /></div>)}
                            <button onClick={() => setShowAnswer(false)}>Hide Answer</button>
                        </div>
                    :
                        <div>
                            <button onClick={() => setShowAnswer(true)}>Show Answer</button>
                        </div>
                    }


                    {/* only show option to save question if logged in */}
                    {props.LoginData.Email ?
                        isSaved ?
                            <button onClick={() => UnsaveQuestion(Question.Question.questionid, props.LoginData.Email)}>UnSave</button>
                        :
                            <button onClick={() => SaveQuestion(Question.Question.questionid, props.LoginData.Email)}>Save</button>

                    :
                        null
                    }
                    
                </div>
            }
        </div>
    )
}

export default OpenedQuestionPage;