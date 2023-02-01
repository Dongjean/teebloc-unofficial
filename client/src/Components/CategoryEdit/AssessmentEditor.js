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

    const [UnlinkedLevels, setUnlinkedLevels] = useState([])

    const [LinkedLevels, setLinkedLevels] = useState([])

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

    function Commit_Changes() {
        try {

            //unlinking
            for (var i=0; i<UnlinkedLevels.length; i++) {
                UnlinkLevel(EditAssessment, UnlinkedLevels[i])
            }

            //linking
            for (var i=0; i<LinkedLevels.length; i++) {
                LinkLevel(EditAssessment, LinkedLevels[i])
            }

            window.location.reload(false);
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
                            {RelatedLevel.level}
                            {UnlinkedLevels.includes(RelatedLevel.levelid) ?
                                <button onClick={() => setUnlinkedLevels(UnlinkedLevels.filter(UnlinkedLevel => UnlinkedLevel !== RelatedLevel.levelid))}>Undo</button>
                            :
                                <button onClick={() => setUnlinkedLevels(current => [...current, RelatedLevel.levelid])}>Unlink</button>
                            }
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
                                    {UnrelatedLevel.level}
                                    {LinkedLevels.includes(UnrelatedLevel.levelid) ?
                                        <button onClick={() => setLinkedLevels(LinkedLevels.filter(LinkedLevel => LinkedLevel !== UnrelatedLevel.levelid))}>Undo</button>
                                    :
                                        <button onClick={() => setLinkedLevels(current => [...current, UnrelatedLevel.levelid])}>Link</button>
                                    }
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


            <button onClick={Commit_Changes}>Commit Edits</button>

        </div>
    )
}

export default AssessmentEditor;