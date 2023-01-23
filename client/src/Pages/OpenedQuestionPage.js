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
    console.log(QuestionID)

    const [isLoading, setisLoading] = useState(true) //initially page is loading
    const [ShowAnswer, setShowAnswer] = useState(false) //do not initially show the answer
    const [Question, setQuestion] = useState({})

    const [isSaved, setisSaved] = useState(false)

    //runs only on mount
    useEffect(() => {
        const tempChurned = localStorage.getItem('Churned')
        if (!tempChurned) {
            GetQuestion(QuestionID)
        } else {
            const Churned = JSON.parse(tempChurned)
            const Question = Churned.Questions.filter(Question => Question.questionid == QuestionID)
            const QuestionImages = Churned.QuestionImages.filter(QuestionImage => QuestionImage.QuestionID == QuestionID)
            const AnswerImages = Churned.AnswerImages.filter(AnswerImage => AnswerImage.QuestionID == QuestionID)

            if (Question.length == 0) {
                GetQuestion(QuestionID)
            } else {
                setQuestion({
                    Question: Question,
                    QuestionImages: QuestionImages,
                    AnswerImages: AnswerImages
                })
                setisLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        if (Question.Question !== undefined) {
            CheckSaved(Question.Question[0].questionid, props.LoginData.Email)
        }
    }, [Question])

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

    async function SaveQuestion(event, QuestionID, Email) {
        try {
            console.log(QuestionID)
            await API.post('/Questions/Save/' + QuestionID + '/' + Email)
            setisSaved(true)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnsaveQuestion(event, QuestionID, Email) {
        try {
            console.log(Email)
            await API.post('/Questions/Unsave/' + QuestionID + '/' + Email)
            setisSaved(false)
        } catch(err) {
            console.log(err)
        }
    }
    
    //gets the Question info if it isnt already in localstorage *incomplete
    async function GetQuestion(QuestionID) {
        console.log(QuestionID)
    }

    return (
        <div>
            {isLoading ?
                <div>Loading...</div>
            :
                <div>
                    {console.log(Question)}
                    Author: {Question.Question[0].firstname + Question.Question[0].lastname} <br />
                    Question: <br />
                    {Question.QuestionImages.map(QuestionImage => <img key={QuestionImage.QuestionIMGID} src={'data:image/png;base64,' + QuestionImage.QuestionIMGData} alt={QuestionImage.QuestionIMGName} style={{width: 500}} />)}

                    {ShowAnswer ?
                        <div>
                            Answers: <br />
                            {Question.AnswerImages.map(AnswerImage => <img key={AnswerImage.AnswerIMGID} src={'data:image/png;base64,' + AnswerImage.AnswerIMGData} alt={AnswerImage.AnswerIMGName} style={{width: 500}} />)}
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
                            <button onClick={event => UnsaveQuestion(event, Question.Question[0].questionid, props.LoginData.Email)}>UnSave</button>
                        :
                            <button onClick={event => SaveQuestion(event, Question.Question[0].questionid, props.LoginData.Email)}>Save</button>

                    :
                        null
                    }
                    
                </div>
            }
        </div>
    )
}

export default OpenedQuestionPage;