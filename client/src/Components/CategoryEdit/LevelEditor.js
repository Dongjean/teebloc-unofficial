import {useState, useEffect} from 'react';

import API from '../../utils/API.js';

function LevelEditor() {
    const [EditLevel, setEditLevel] = useState()

    const [AllLevels, setAllLevels] = useState([])
    const [RelatedSubjects, setRelatedSubjects] = useState([])
    const [RelatedAssessments, setRelatedAssessments] = useState([])

    const [ShowRelatedSubjects, setShowRelatedSubjects] = useState(false)
    const [ShowRelatedAssessments, setShowRelatedAssessments] = useState(false)

    useEffect(() => {
        GetAllLevels()
    }, [])

    useEffect(() => {
        if (EditLevel) {
            GetRelatedSubjects(EditLevel)
            GetRelatedAssessments(EditLevel)
        }
    }, [EditLevel])

    async function GetAllLevels() {
        try {
            const result = await API.get('/Categories/Get/Levels/All')
            setAllLevels(result.data)
            setEditLevel(result.data[0].levelid) //initially set the first Level as the level to edit
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedSubjects(LevelID) {
        try {
            const result = await API.get('/Categories/Get/Subjects/fromLevelID/' + LevelID)
            console.log(result.data)
            setRelatedSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedAssessments(LevelID) {
        try {
            const result = await API.get('/Categories/Get/Assessments/fromLevelID/' + LevelID)
            setRelatedAssessments(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnlinkSubject(LevelID, SubjectID) {
        try {
            await API.post('/Categories/Unlink/Subject/' + SubjectID + '/Level/' + LevelID)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnlinkAssessment(LevelID, AssessmentID) {
        try {
            await API.post('/Categories/Unlink/Assessment/' + AssessmentID + '/Level/' + LevelID)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <select onChange={event => setEditLevel(event.target.value)}>
                {AllLevels.map(Level => 
                    <option key={Level.levelid} value={Level.levelid}>{Level.level}</option>
                )}
            </select> <br />

            {/* Display All the related Subjects and Assessments */}
            Existing Relations:<br />

            {ShowRelatedSubjects ?
                <div>
                    <button onClick={() => setShowRelatedSubjects(false)}>Hide Related Subjects</button> <br />
                    {RelatedSubjects.map(RelatedSubject => 
                        <div key={RelatedSubject.subjectid}>
                            {RelatedSubject.subject} <button onClick={() => UnlinkSubject(EditLevel, RelatedSubject.subjectid)}>Unlink</button>
                        </div>
                    )}
                </div>
            :
                <div>
                    <button onClick={() => setShowRelatedSubjects(true)}>Show Related Subjects</button> <br />
                </div>
            }

            {ShowRelatedAssessments ?
                <div>
                    <button onClick={() => setShowRelatedAssessments(false)}>Hide Related Assessments</button> <br />
                    {RelatedAssessments.map(RelatedAssessment => 
                        <div key={RelatedAssessment.assessmentid}>
                            {RelatedAssessment.assessmentname} <button onClick={() => UnlinkAssessment(EditLevel, RelatedAssessment.assessmentid)}>Unlink</button>
                        </div>
                    )}
                </div>
            :
                <div>
                    <button onClick={() => setShowRelatedAssessments(true)}>Show Related Assessments</button> <br />
                </div>
            }

        </div>
    )
}

export default LevelEditor;