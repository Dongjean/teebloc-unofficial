import {useMemo, useState, useEffect}  from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
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
    const navigate = useNavigate()

    const [isLoading, setisLoading] = useState(true) //initially page is loading
    const [ShowAnswer, setShowAnswer] = useState(false) //do not initially show the answer
    const [Question, setQuestion] = useState({})

    const [isSaved, setisSaved] = useState(false)
    const [isCompleted, setisCompleted] = useState(false)

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
            CheckCompleted(result.data.Question.questionid, props.LoginData.Email)
            setisLoading(false)
        } catch(err) {
            console.log(err)
        }
    }

    async function CheckSaved(QuestionID, Email) {
        try {
            const result = await API.get('/Questions/CheckSaved/' + QuestionID + '/' + Email)
            setisSaved(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function SaveQuestion(QuestionID, Email) {
        try {
            await API.post('/Questions/Save/' + QuestionID + '/' + Email)
            setisSaved(true)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnsaveQuestion(QuestionID, Email) {
        try {
            await API.post('/Questions/Unsave/' + QuestionID + '/' + Email)
            setisSaved(false)
        } catch(err) {
            console.log(err)
        }
    }

    async function CheckCompleted(QuestionID, Email) {
        try {
            const result = await API.get('/Questions/CheckCompleted/' + QuestionID + '/' + Email)
            setisCompleted(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function CompleteQuestion(QuestionID, Email) {
        try {
            await API.post('/Questions/Complete/' + QuestionID + '/' + Email)
            setisCompleted(true)
        } catch(err) {
            console.log(err)
        }
    }

    async function UncompleteQuestion(QuestionID, Email) {
        try {
            await API.post('/Questions/Uncomplete/' + QuestionID + '/' + Email)
            setisCompleted(false)
        } catch(err) {
            console.log(err)
        }
    }

    async function DeleteQuestion(QuestionID) {
        try {
            //delete the question
            await API.post('/Questions/Delete/' + QuestionID)

            //navigate back to home page
            navigate('/')
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

                    {/* only show option to complete question if logged in */}
                    {props.LoginData.Email ?
                        isCompleted ?
                            <button onClick={() => UncompleteQuestion(Question.Question.questionid, props.LoginData.Email)}>Uncomplete</button>
                        :
                            <button onClick={() => CompleteQuestion(Question.Question.questionid, props.LoginData.Email)}>Complete</button>
                        
                    :
                        null
                    }

                    {/* only show option to delete question if logged in user is the author */}
                    {props.LoginData.Email == Question.Question.email ?
                        <button onClick={() => DeleteQuestion(Question.Question.questionid)}>Delete</button>
                    :
                        null
                    }
                </div>
            }
        </div>
    )
}

export default OpenedQuestionPage;