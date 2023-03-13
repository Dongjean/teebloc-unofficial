import API from "../../utils/API";
import jsPDF from "jspdf";
import {useState, useEffect} from "react";

function Question(props) {
    const Question = props.Question
    const FirstQuestionIMG = props.FirstQuestionIMG

    const [isSaved, setisSaved] = useState(false)

    const [UpvoteCount, setUpvoteCount] = useState(0)

    const [isUpvoted, setisUpvoted] = useState(false)

    useEffect(() => {
        CheckSaved(Question.questionid, props.LoginData.Email)

        CheckUpvoted(Question.questionid, props.LoginData.Email)
        GetUpvoteCount(Question.questionid)
    }, [])

    async function CheckSaved(QuestionID, Email) {
        try {
            const result = await API.get('/Questions/CheckSaved/' + QuestionID + '/' + Email)
            console.log(result.data)
            setisSaved(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function SaveQuestion(event, QuestionID, Email) {
        event.stopPropagation();
        
        try {
            console.log(Email)
            await API.post('/Questions/Save/' + QuestionID + '/' + Email)
            setisSaved(true)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnsaveQuestion(event, QuestionID, Email) {
        event.stopPropagation();
        
        try {
            console.log(Email)
            await API.post('/Questions/Unsave/' + QuestionID + '/' + Email)
            setisSaved(false)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetUpvoteCount(QuestionID) {
        try {
            const result = await API.get('/Questions/Get/Upvotes/Count/' + QuestionID)
            setUpvoteCount(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnupvoteQuestion(event, QuestionID, Email) {
        event.stopPropagation();

        try {
            await API.post('/Questions/Upvotes/Unupvote/' + QuestionID + '/' + Email)
            setisUpvoted(false)
            setUpvoteCount(current => current - 1)
        } catch(err) {
            console.log(err)
        }
    }

    async function UpvoteQuestion(event, QuestionID, Email) {
        event.stopPropagation();

        try {
            await API.post('/Questions/Upvotes/Upvote/' + QuestionID + '/' + Email)
            setisUpvoted(true)
            setUpvoteCount(current => current + 1)
        } catch(err) {
            console.log(err)
        }
    }

    async function CheckUpvoted(QuestionID, Email) {
        try {
            const result = await API.get('/Questions/Upvotes/CheckUpvoted/' + QuestionID + '/' + Email)

            return result.data
        } catch(err) {
            console.log(err)
        }
    }

    //gets the more detailed Question info for downloading PDFs
    async function GetQuestion(QuestionID) {
        try {
            const result = await API.get('/Questions/Get/' + QuestionID)
            return result.data
        } catch(err) {
            console.log(err)
        }
    }

    async function DownloadPDF(event, QuestionID) {
        event.stopPropagation();

        //Get more detailed Question info for downloading PDFs
        const Question = await GetQuestion(QuestionID)
        console.log(Question)
        const document = new jsPDF('p', 'mm', [297, 210])

        var QuestionYPos = 0
        //Add Question Images to PDF
        for (var i=0; i<Question.QuestionImages.length; i++) {
            const QuestionImage = Question.QuestionImages[i]
            var image = new Image()
            image.src = 'data:image/jpeg;base64,' + QuestionImage.QuestionIMGData
            await image.decode()

            if (i !== 0) {
                if (image.height/image.width * 210 > (297 - QuestionYPos) ) {
                    document.addPage()
                    QuestionYPos = 0
                }
            }
            document.addImage('data:image/jpeg;base64,' + QuestionImage.QuestionIMGData, 'JPEG', 0, QuestionYPos, 210, image.height/image.width * 210)
            QuestionYPos += image.height/image.width * 210
        }

        document.addPage() //always start answers on a new page

        var AnswerYPos = 0
        //Add Answer Images to PDF
        for (var i=0; i<Question.AnswerImages.length; i++) {
            const AnswerImage = Question.AnswerImages[i]
            var image = new Image()
            image.src = 'data:image/jpeg;base64,' + AnswerImage.AnswerIMGData
            await image.decode()

            if (i !== 0) {
                if (image.height/image.width * 210 > (297 - AnswerYPos) ) {
                    document.addPage()
                    AnswerYPos = 0
                }
            }
            document.addImage('data:image/jpeg;base64,' + AnswerImage.AnswerIMGData, 'JPEG', 0, AnswerYPos, 210, image.height/image.width * 210)
            AnswerYPos += image.height/image.width * 210
        }

        document.save('QuestionID' + QuestionID +'.pdf')
    }
    
    return (
        <div>
            <img src={'data:image/png;base64,' + FirstQuestionIMG.QuestionIMGData} alt={FirstQuestionIMG.QuestionIMGName} style={{width:100, float:'left'}} />
            School: {Question.schoolname ? Question.schoolname : <span>NA</span>} <br />
            Uploader: {Question.firstname + ' ' + Question.lastname} <br />
            Topic: {Question.topicname} <br />
            Level: {Question.level} <br />
            Paper: {Question.paper} <br />
            Assessment: {Question.assessmentname} <br />
            School: {Question.schoolname} <br />

            {/* only show option to save or upvote question if logged in */}
            {props.LoginData.Email ?
                <span>
                    {isSaved ?
                        <button onClick={event => UnsaveQuestion(event, Question.questionid, props.LoginData.Email)}>UnSave</button>
                    :
                        <button onClick={event => SaveQuestion(event, Question.questionid, props.LoginData.Email)}>Save</button>
                    }
                    
                    <br />

                    {isUpvoted ?
                        <a onClick={event => UnupvoteQuestion(event, Question.questionid, props.LoginData.Email)}>⬆</a>
                    :
                        <a onClick={event => UpvoteQuestion(event, Question.questionid, props.LoginData.Email)}>⇧</a>
                    }
                </span>
            :
                null
            }

            <br />

            Upvotes : {UpvoteCount}

            {/* only show option to Download PDF of the question if logged in user is an Admin */}
            {props.LoginData.AccType == 'Admin' ?
                <button onClick={event => DownloadPDF(event, Question.questionid)}>Download PDF</button>
            :
                null
            }
        </div>
    )
}

export default Question;