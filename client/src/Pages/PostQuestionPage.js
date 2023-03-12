import {useState, useEffect, useRef} from "react";

//Component imports
import PostQuestion from "../Components/QuestionUpload/PostQuestion.js";
import PostAnswer from "../Components/AnswerUpload/PostAnswer.js";

import API from '../utils/API.js';

function PostQuestionPage(props) {
    const [AllSubjects, setAllSubjects] = useState([])
    const [Levels, setLevels] = useState([])
    const [Assessments, setAssessments] = useState([])
    const [Topics, setTopics] = useState([])
    const [Papers, setPapers] = useState([])
    const [Schools, setSchools] = useState([])

    //0 is the null value for all category IDs
    const [SubjectSelection, setSubjectSelection] = useState(0)
    const [LevelSelection, setLevelSelection] = useState(0)
    const [AssessmentSelection, setAssessmentSelection] = useState(0)
    const [TopicSelection, setTopicSelection] = useState(0)
    const [PaperSelection, setPaperSelection] = useState(0)
    const [SchoolSelection, setSchoolSelection] = useState(0)

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
            const result = await API.get('/Categories/Get/Subjects/All')
            setAllSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    //get the Levels that offer this subject
    async function getLevels(Subject) {
        try {
            const result = await API.get('/Categories/Get/Levels/fromSubjectID/' + Subject)
            setLevels(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    //get the Assessments that exists at this level
    async function getAssessments(Level) {
        try {
            const result = await API.get('/Categories/Get/Assessments/fromLevelID/' + Level)
            setAssessments(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    //get the Topics that are tested at this Assessment
    async function getTopics(Subject) {
        try {
            const result = await API.get('/Categories/Get/Topics/fromSubjectID/' + Subject)
            setTopics(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    //get the Papers that exist for this Subject
    async function getPapers(Subject) {
        try {
            const result = await API.get('/Categories/Get/Papers/fromSubjectID/' + Subject)
            setPapers(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    //get the Schools that offer this Subject
    async function getSchools(Subject) {
        try {
            const result = await API.get('/Categories/Get/Schools/fromSubjectID/' + Subject)
            setSchools(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function Post() {
        try {
            var FDQNImages = [];
            for (var i=0; i<QNImages.length; i++) {
                FDQNImages.push({
                    name: QNImages[i].FileName,
                    IMGData: QNImages[i].CroppedIMGData
                })
            }

            var FDANSImages = [];
            for (var i=0; i<ANSImages.length; i++) {
                FDANSImages.push({
                    name: ANSImages[i].FileName,
                    IMGData: ANSImages[i].CroppedIMGData
                })
            }
            const FD = new FormData()
            FD.append('QNImages', JSON.stringify(FDQNImages))
            FD.append('ANSImages', JSON.stringify(FDANSImages))
            FD.append('SubjectID', SubjectSelection)
            FD.append('LevelID', LevelSelection)
            FD.append('AssessmentID', AssessmentSelection)
            FD.append('TopicID', TopicSelection)
            FD.append('PaperID', PaperSelection)
            FD.append('SchoolID', SchoolSelection)
            FD.append('Email', props.UserEmail)
            
            await API.post('/Questions/PostQuestion', FD)

            //Reload Page
            window.location.reload(false);
        } catch(err) {
            console.log(err)
        }
    }

    function onSubjectSelected(event) {
        setSubjectSelection(event.target.value)
        getLevels(event.target.value) //get the levels that offer this subject if a subject was selected
        getTopics(event.target.value) //get the Topics tested in this Subject
        getPapers(event.target.value) //get the Papers that exist for this Subject
        getSchools(event.target.value) //get the Schools that offer this Subject
    }
    
    function onLevelSelected(event) {
        setLevelSelection(event.target.value)
        getAssessments(event.target.value) //get the Assessments that occurs at this level
    }

    function onAssessmentSelected(event) {
        setAssessmentSelection(event.target.value)
    }

    function onTopicSelected(event) {
        setTopicSelection(event.target.value)
    }

    function onPaperSelected(event) {
        setPaperSelection(event.target.value)
    }

    function onSchoolSelected(event) {
        setSchoolSelection(event.target.value)
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

        if (SubjectSelection == 0 ||
            LevelSelection == 0 ||
            AssessmentSelection == 0 ||
            TopicSelection == 0 ||
            PaperSelection == 0) {
            console.log('Please select all of the categories about the question!')
            return
        }
        
        console.log(QNImages)
        console.log(ANSImages)
        console.log(SubjectSelection)
        console.log(LevelSelection)
        console.log(AssessmentSelection)
        console.log(TopicSelection)
        console.log(PaperSelection)
        console.log(SchoolSelection)
        console.log("submitted!")
        Post()
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
                <select defaultValue={0} onChange={onSubjectSelected} >
                    <option value={0}>Please Select a Subject</option>
                    {AllSubjects.map(Subject => <option key={Subject.subjectid} value={Subject.subjectid}>{Subject.subject}</option>)}
                </select>

                Level:
                <select defaultValue={0} onChange={onLevelSelected}>
                    <option value={0}>Please Select a Level</option>
                    {Levels.map(Level => <option key={Level.levelid} value={Level.levelid}>{Level.level}</option>)}
                </select>

                Assessment:
                <select defaultValue={0} onChange={onAssessmentSelected}>
                    <option value={0}>Please Select an Assessment</option>
                    {Assessments.map(Assessment => <option key={Assessment.assessmentid} value={Assessment.assessmentid}>{Assessment.assessmentname}</option>)}
                </select>

                Topics:
                <select defaultValue={0} onChange={onTopicSelected}>
                    <option value={0}>Please Select a Topic</option>
                    {Topics.map(Topic => <option key={Topic.topicid} value={Topic.topicid}>{Topic.topicname}</option>)}
                </select>

                Paper Number:
                <select defaultValue={0} onChange={onPaperSelected}>
                    <option value={0}>Please Select a Paper Number</option>
                    {Papers.map(Paper => <option key={Paper.paperid} value={Paper.paperid}>{Paper.paper}</option>)}
                </select>

                School Name:
                <select defaultValue={0} onChange={onSchoolSelected}>
                    <option value={0}>Please Select a School</option>
                    {Schools.map(School => <option key={School.schoolid} value={School.schoolid}>{School.schoolname}</option>)}
                </select>

                <br />
                <a onClick={UploadQuestion}>Upload Question</a> /
                <a onClick={UploadAnswer}> Upload Answer</a>

                <br />
                <div style={{display: QuestionsDisplay}}>
                    Question(s):
                    <PostQuestion onQuestionIMGChange={onQuestionIMGChange} />
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

export default PostQuestionPage;