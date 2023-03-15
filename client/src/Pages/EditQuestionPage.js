import {useState, useEffect, useRef} from "react";
import {useNavigate} from 'react-router-dom';
import useQuery from "../utils/useQuery.js";
import API from '../utils/API.js';

//Component imports
import PostQuestion from "../Components/QuestionUpload/PostQuestion.js";
import PostAnswer from "../Components/AnswerUpload/PostAnswer.js";

function EditQuestionPage(props) {
    const query = useQuery();
    const navigate = useNavigate();

    const QuestionID = query.get('QuestionID')

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
    
    const OriginalQNImageIDsRef = useRef([])
    const OriginalANSImageIDsRef = useRef([])

    //runs only once on mount
    useEffect(() => {
        if (props.LoginData.AccType == 'Admin') {
            getQuestionData(QuestionID)
            getAllSubjects()
        } else {
            CheckQuestionAuthor(QuestionID)
        }
    }, [])

    async function CheckQuestionAuthor() {
        try {
            const result = await API.get('/Questions/Get/Author/fromQuestionID/' + QuestionID)
            if (result.data == props.LoginData.Email) {
                getQuestionData(QuestionID)
                getAllSubjects()
            }
        } catch(err) {
            console.log(err)
        }
    }

    async function getQuestionData(QuestionID) {
        try {
            const result = await API.get('/Questions/Get/QuestionData/toEdit/fromQuestionID/' + QuestionID)
            await onSubjectSelected(result.data.Categories.subjectid)
            await onLevelSelected(result.data.Categories.levelid)
            await onAssessmentSelected(result.data.Categories.assessmentid)
            await onTopicSelected(result.data.Categories.topicid)
            await onPaperSelected(result.data.Categories.paperid)
            await onSchoolSelected(result.data.Categories.schoolid)

            setQNImages(result.data.QuestionImages)
            setANSImages(result.data.AnswerImages)

            OriginalQNImageIDsRef.current = result.data.QuestionImages.map(QuestionImage => QuestionImage.QuestionIMGID)
            OriginalANSImageIDsRef.current = result.data.AnswerImages.map(AnswerImage => AnswerImage.AnswerIMGID)
            console.log(OriginalQNImageIDsRef.current, 'h')
            console.log(OriginalANSImageIDsRef.current, 'bruh')
        } catch(err) {
            console.log(err)
        }
    }

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

            //if the new set of Categories to select from does not contain the currently selected Category,
            //turn back the Category selection to nothing, 0.
            if (!result.data.includes(LevelSelection)) {
                setLevelSelection(0)
            }
        } catch(err) {
            console.log(err)
        }
    }

    //get the Assessments that exists at this level
    async function getAssessments(Level) {
        try {
            const result = await API.get('/Categories/Get/Assessments/fromLevelID/' + Level)
            setAssessments(result.data)

            //if the new set of Categories to select from does not contain the currently selected Category,
            //turn back the Category selection to nothing, 0.
            if (!result.data.includes(AssessmentSelection)) {
                setAssessmentSelection(0)
            }
        } catch(err) {
            console.log(err)
        }
    }

    //get the Topics that are tested at this Assessment
    async function getTopics(Subject) {
        try {
            const result = await API.get('/Categories/Get/Topics/fromSubjectID/' + Subject)
            setTopics(result.data)

            //if the new set of Categories to select from does not contain the currently selected Category,
            //turn back the Category selection to nothing, 0.
            if (!result.data.includes(TopicSelection)) {
                setTopicSelection(0)
            }
        } catch(err) {
            console.log(err)
        }
    }

    //get the Papers that exist for this Subject
    async function getPapers(Subject) {
        try {
            const result = await API.get('/Categories/Get/Papers/fromSubjectID/' + Subject)
            setPapers(result.data)

            //if the new set of Categories to select from does not contain the currently selected Category,
            //turn back the Category selection to nothing, 0.
            if (!result.data.includes(PaperSelection)) {
                setPaperSelection(0)
            }
        } catch(err) {
            console.log(err)
        }
    }

    //get the Schools that offer this Subject
    async function getSchools(Subject) {
        try {
            const result = await API.get('/Categories/Get/Schools/fromSubjectID/' + Subject)
            setSchools(result.data)

            //if the new set of Categories to select from does not contain the currently selected Category,
            //turn back the Category selection to nothing, 0.
            if (!result.data.includes(SchoolSelection)) {
                setSchoolSelection(0)
            }
        } catch(err) {
            console.log(err)
        }
    }

    async function Edit() {
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
            //append new Editted Question Data
            FD.append('QNImages', JSON.stringify(FDQNImages))
            FD.append('ANSImages', JSON.stringify(FDANSImages))
            FD.append('SubjectID', SubjectSelection)
            FD.append('LevelID', LevelSelection)
            FD.append('AssessmentID', AssessmentSelection)
            FD.append('TopicID', TopicSelection)
            FD.append('PaperID', PaperSelection)
            FD.append('SchoolID', SchoolSelection)
            FD.append('Email', props.LoginData.Email)
            
            //append data about old Images
            FD.append('OriginalQNImageIDs', JSON.stringify(OriginalQNImageIDsRef.current))
            FD.append('OriginalANSImageIDs', JSON.stringify(OriginalANSImageIDsRef.current))
            
            await API.post('/Questions/Edit/Question/' + QuestionID, FD)

            //navigate to Opened Question Page for this Question
            navigate('/OpenedQuestion?QuestionID=' + QuestionID)
        } catch(err) {
            console.log(err)
        }
    }

    async function onSubjectSelected(SubjectID) {
        setSubjectSelection(SubjectID)
        await getLevels(SubjectID) //get the levels that offer this subject if a subject was selected
        await getTopics(SubjectID) //get the Topics tested in this Subject
        await getPapers(SubjectID) //get the Papers that exist for this Subject
        await getSchools(SubjectID) //get the Schools that offer this Subject
    }
    
    async function onLevelSelected(LevelID) {
        setLevelSelection(LevelID)
        await getAssessments(LevelID) //get the Assessments that occurs at this level
    }

    async function onAssessmentSelected(AssessmentID) {
        console.log(AssessmentID)
        setAssessmentSelection(AssessmentID)
    }

    async function onTopicSelected(TopicID) {
        setTopicSelection(TopicID)
    }

    async function onPaperSelected(PaperID) {
        setPaperSelection(PaperID)
    }

    async function onSchoolSelected(SchoolID) {
        setSchoolSelection(SchoolID)
    }

    function SubmitEdit(event) {
        event.preventDefault();
        if (QNImages.length == 0 || ANSImages.length == 0) {
            window.alert('Please include both answers and questions')
            return
        }

        for (var i=0; i<QNImages.length; i++) {
            if (!QNImages[i].CroppedIMGData) {
                window.alert('Please crop all of your images')
                return
            }
        }

        for (var i=0; i<ANSImages.length; i++) {
            if (!ANSImages[i].CroppedIMGData) {
                window.alert('Please crop all of your images')
                return
            }
        }
        if (SubjectSelection == 0 ||
            LevelSelection == 0 ||
            AssessmentSelection == 0 ||
            TopicSelection == 0 ||
            PaperSelection == 0 ||
            SchoolSelection == 0) {
            window.alert('Please select all of the categories about the question!')
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
        Edit()
    }

    function onQuestionIMGChange(QNImages) {
        setQNImages(QNImages)
    }

    function onAnswerIMGChange(ANSImages) {
        setANSImages(ANSImages)
    }

    function EditQuestion() {
        setQuestionsDisplay('inline')
        setAnswersDisplay('none')
    }

    function EditAnswer() {
        setAnswersDisplay('inline')
        setQuestionsDisplay('none')
    }

    return (
        AllSubjects.length !== 0 ?
        <div>
            <form onSubmit={SubmitEdit}>
                Post Subject: 
                <select value={SubjectSelection} onChange={event => onSubjectSelected(event.target.value)} >
                    <option value={0}>Please Select a Subject</option>
                    {AllSubjects.map(Subject => <option key={Subject.subjectid} value={Subject.subjectid}>{Subject.subject}</option>)}
                </select>

                Level:
                <select value={LevelSelection} onChange={event => onLevelSelected(event.target.value)}>
                    <option value={0}>Please Select a Level</option>
                    {Levels.map(Level => <option key={Level.levelid} value={Level.levelid}>{Level.level}</option>)}
                </select>

                Assessment:
                <select value={AssessmentSelection} onChange={event => onAssessmentSelected(event.target.value)}>
                    <option value={0}>Please Select an Assessment</option>
                    {Assessments.map(Assessment => <option key={Assessment.assessmentid} value={Assessment.assessmentid}>{Assessment.assessmentname}</option>)}
                </select>

                Topics:
                <select value={TopicSelection} onChange={event => onTopicSelected(event.target.value)}>
                    <option value={0}>Please Select a Topic</option>
                    {Topics.map(Topic => <option key={Topic.topicid} value={Topic.topicid}>{Topic.topicname}</option>)}
                </select>

                Paper Number:
                <select value={PaperSelection} onChange={event => onPaperSelected(event.target.value)}>
                    <option value={0}>Please Select a Paper Number</option>
                    {Papers.map(Paper => <option key={Paper.paperid} value={Paper.paperid}>{Paper.paper}</option>)}
                </select>

                School Name:
                <select value={SchoolSelection} onChange={event => onSchoolSelected(event.target.value)}>
                    <option value={0}>Please Select a School</option>
                    {Schools.map(School => <option key={School.schoolid} value={School.schoolid}>{School.schoolname}</option>)}
                </select>

                <br />
                <a onClick={EditQuestion}>Edit Question</a> /
                <a onClick={EditAnswer}> Edit Answer</a>

                <br />
                <div style={{display: QuestionsDisplay}}>
                    Question(s):
                    <PostQuestion onQuestionIMGChange={onQuestionIMGChange} QNImages={QNImages} />
                </div>

                <div style={{display: AnswersDispay}}>
                    Answer(s): 
                    <PostAnswer onAnswerIMGChange={onAnswerIMGChange} ANSImages={ANSImages} />
                </div>
                <input type='submit' value='Upload' />
            </form>
        </div>
        : null
    )
}

export default EditQuestionPage;