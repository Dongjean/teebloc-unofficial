import {useState, useEffect} from "react";

//Component imports
import PostQuestion from "../Components/QuestionUpload/PostQuestion.js";
import PostAnswer from "../Components/AnswerUpload/PostAnswer.js";

import API from '../utils/API.js';

function PostPage() {
    const [AllSubjects, setAllSubjects] = useState([])
    const [SubjectSelection, setSubjectSelection] = useState('')
    const [QNImages, setQNImages] = useState([])
    const [ANSImages, setANSImages] = useState([])

    const [QuestionsDisplay, setQuestionsDisplay] = useState('inline') //by default start with Question Uploading
    const [AnswersDispay, setAnswersDisplay] = useState('none') //by default start with Answer Upload component hidden
    
    //runs only once on mount
    useEffect(() => {
        getAllSubjects()
    }, [])

    async function getAllSubjects() { //get all Subjects initially to display
        try {
            const result = await API.get('/Categories/Subjects/GetAll')
            setAllSubjects(result.data)
            setSubjectSelection(result.data[0].subject)
        } catch(err) {
            console.log(err)
        }
    }

    function onChange(event) {
        setSubjectSelection(event.target.value)
    }

    function SubmitPost(event) {
        event.preventDefault();
        if (QNImages.length == 0 || ANSImages.length == 0) {
            console.log('Please include both answers and questions')
            return
        }

        for (var i=0; i<QNImages.length; i++) {
            if (!QNImages[i].CroppedIMGData) {
                console.log('Please crop all of your images')
                return
            }
        }

        for (var i=0; i<ANSImages.length; i++) {
            if (!ANSImages[i].CroppedIMGData) {
                console.log('Please crop all of your images')
                return
            }
        }
        
        console.log(QNImages)
        console.log(ANSImages)
        console.log(SubjectSelection)
        console.log("submitted!") //will change this later to API call to submit the post
    }

    function onQuestionIMGChange(QNImages) {
        setQNImages(QNImages)
    }

    function onAnswerIMGChange(ANSImages) {
        setANSImages(ANSImages)
    }

    function UploadQuestion() {
        setQuestionsDisplay('inline')
        setAnswersDisplay('none')
    }

    function UploadAnswer() {
        setAnswersDisplay('inline')
        setQuestionsDisplay('none')
    }

    return (
        AllSubjects.length !== 0 ?
        <div>
            <form onSubmit={SubmitPost}>
                Post Subject: 
                <select defaultValue={AllSubjects[0].subject} onChange={onChange} >
                    {AllSubjects.map(Subject => <option key={Subject.subjectid} value={Subject.subject}>{Subject.subject}</option>)}
                </select>
                <br />
                <a onClick={UploadQuestion}>Upload Question</a> /
                <a onClick={UploadAnswer}> Upload Answer</a>

                <br />
                <div style={{display: QuestionsDisplay}}>
                    Question(s):
                    <PostQuestion onQuestionIMGChange={onQuestionIMGChange} style={{display: 'none'}} />
                </div>

                <div style={{display: AnswersDispay}}>
                    Answer(s): 
                    <PostAnswer onAnswerIMGChange={onAnswerIMGChange} />
                </div>
                <input type='submit' value='Upload' />
            </form>
        </div>
        : null
    )
}

export default PostPage;