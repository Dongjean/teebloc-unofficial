import {useState, useRef, useEffect} from 'react';
import API from '../../utils/API';

function LevelPoster(props) {

    const SubjectsRef = useRef([])
    const AssessmentsRef = useRef([])

    const [SubjectsDisplay, setSubjectsDisplay] = useState('none')
    const [AssessmentsDisplay, setAssessmentsDisplay] = useState('none')

    const NewLevelRef = useRef('')

    const [Subjects, setSubjects] = useState([])
    const [Assessments, setAssessments] = useState([])

    useEffect(() => {
        GetSubjects()
        GetAssessments()
    }, [])

    async function GetSubjects() {
        try {
            const result = await API.get('/Categories/Get/Subjects/All')
            setSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetAssessments() {
        try {
            const result = await API.get('/Categories/Get/Assessments/All')
            setAssessments(result.data)
        } catch(err) {
            console.log(err)
        }
    }
    return (
        <div>
            {/* Subjects Selector */}
            
            {SubjectsDisplay == 'none' ?
                <a onClick={() => setSubjectsDisplay('inline')}>▼ Subjects</a>
            :
                <a onClick={() => setSubjectsDisplay('none')}>▲ Subjects</a>
            }
            <div style={{display: SubjectsDisplay}}>
                {Subjects.map(Subject => 
                    <div key={Subject.subjectid}>
                        {Subject.subject} <input type='checkbox' onClick={event => {
                            if (event.target.checked == true) {
                                //Add this Subject to SubjectsRef.current
                                SubjectsRef.current.push(Subject.subjectid)
                            } else {
                                //Remove this Subject from SubjectsRef.current
                                SubjectsRef.current = SubjectsRef.current.filter(subjectid => subjectid !== Subject.subjectid)
                            }
                        }}/>
                    </div>
                )}
            </div> <br />

            {/* Assessments Selector */}

            {AssessmentsDisplay == 'none' ?
                <a onClick={() => setAssessmentsDisplay('inline')}>▼ Assessments</a>
            :
                <a onClick={() => setAssessmentsDisplay('none')}>▲ Assessments</a>
            }
            <div style={{display: AssessmentsDisplay}}>
                {Assessments.map(Assessment => 
                    <div key={Assessment.assessmentid}>
                        {Assessment.assessmentname} <input type='checkbox' onClick={event => {
                            if (event.target.checked == true) {
                                //Add this Assessment to AssessmentsRef.current
                                AssessmentsRef.current.push(Assessment.assessmentid)
                            } else {
                                //Remove this Assessment from AssessmentsRef.current
                                AssessmentsRef.current = AssessmentsRef.current.filter(assessmentid => assessmentid !== Assessment.assessmentid)
                            }
                        }}/>
                    </div>
                )}
            </div> <br />

            <input type='text' ref={NewLevelRef} /> <br />
            <input type='submit' value='Add' onClick={event => props.SubmitLevel(event, SubjectsRef.current, AssessmentsRef.current, NewLevelRef.current.value)}/>
        </div>
    )
}

export default LevelPoster;