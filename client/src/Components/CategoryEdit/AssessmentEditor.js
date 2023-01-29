import {useState, useEffect} from 'react';

import API from '../../utils/API.js';

function AssessmentEditor() {
    const [EditAssessment, setEditAssessment] = useState()

    const [AllAssessments, setAllAssessments] = useState([])
    const [RelatedLevels, setRelatedLevels] = useState([])

    const [ShowRelatedLevels, setShowRelatedLevels] = useState(false)

    const [isLinking, setisLinking] = useState(false)

    const [UnrelatedLevels, setUnrelatedLevels] = useState([])

    const [ShowUnrelatedLevels, setShowUnrelatedLevels] = useState(false)

    useEffect(() => {
        GetAllAssessments()
    }, [])

    useEffect(() => {
        if (EditAssessment) {
            GetRelatedLevels(EditAssessment)

            GetUnrelatedLevels(EditAssessment)
        }
    }, [EditAssessment])

    async function GetAllAssessments() {
        try {
            const result = await API.get('/Categories/Get/Assessments/All')
            setAllAssessments(result.data)
            setEditAssessment(result.data[0].assessmentid) //initially set the first Assessment as the assessment to edit
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedLevels(AssessmentID) {
        try {
            const result = await API.get('/Categories/Get/Levels/fromAssessmentID/' + AssessmentID)
            console.log(result.data)
            setRelatedLevels(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetUnrelatedLevels(AssessmentID) {
        try {
            const result = await API.get('/Categories/Get/Levels/fromAssessmentID/' + AssessmentID + '?Options=Inverse')
            setUnrelatedLevels(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnlinkLevel(AssessmentID, LevelID) {
        try {
            await API.post('/Categories/Unlink/Assessment/' + AssessmentID + '/Level/' + LevelID)
        } catch(err) {
            console.log(err)
        }
    }

    async function LinkLevel(AssessmentID, LevelID) {
        try {
            await API.post('/Categories/Link/Assessment/' + AssessmentID + '/Level/' + LevelID)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <select onChange={event => setEditAssessment(event.target.value)}>
                {AllAssessments.map(Assessment => 
                    <option key={Assessment.assessmentid} value={Assessment.assessmentid}>{Assessment.assessmentname}</option>
                )}
            </select> <br />

            {/* Display All the related Levels */}
            Existing Relations:<br />

            {ShowRelatedLevels ?
                <div>
                    <button onClick={() => setShowRelatedLevels(false)}>Hide Related Levels</button> <br />
                    {RelatedLevels.map(RelatedLevel => 
                        <div key={RelatedLevel.levelid}>
                            {RelatedLevel.level} <button onClick={() => UnlinkLevel(EditAssessment, RelatedLevel.levelid)}>Unlink</button>
                        </div>
                    )}
                </div>
            :
                <div>
                    <button onClick={() => setShowRelatedLevels(true)}>Show Related Levels</button> <br />
                </div>
            }

            {isLinking ?
                <div>
                    <button onClick={() => setisLinking(false)}>Stop Linking</button> <br />


                    {ShowUnrelatedLevels ?
                        <div>
                            <button onClick={() => setShowUnrelatedLevels(false)}>Hide Unrelated Levels</button>
                            {UnrelatedLevels.map(UnrelatedLevel =>
                                <div key={UnrelatedLevel.levelid}>
                                    {UnrelatedLevel.level} <button onClick={() => LinkLevel(EditAssessment, UnrelatedLevel.levelid)}>Link</button>
                                </div>
                            )}
                        </div>
                    :
                        <div>               
                            <button onClick={() => setShowUnrelatedLevels(true)}>Show Unrelated Levels</button>
                        </div>
                    }
                </div>
            :
                <div>
                    <button onClick={() => setisLinking(true)}>Start Linking</button>
                </div>
            }

        </div>
    )
}

export default AssessmentEditor;