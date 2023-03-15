import {useState, useEffect, useRef} from 'react';

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

    const [isRenaming, setisRenaming] = useState(false)
    const New_AssessmentName = useRef('')

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

            //Renaming if needed
            
            if (isRenaming) {
                Rename(New_AssessmentName)
            }

            //reload page
            window.location.reload(false);
        } catch(err) {
            console.log(err)
        }
    }

    async function Delete() {
        try {
            //Delete the Category
            const response = await API.post('/Categories/Delete/Assessment/' + EditAssessment)
            
            if (response.data) {
                //reload page
                window.location.reload(false);
            } else {
                window.alert('Questions With this Assessment Already Exists! Deletion is thus not allowed.')
            }
        } catch(err) {
            console.log(err)
        }
    }

    async function Rename(New_AssessmentName) {
        try {
            await API.post('/Categories/Rename/Assessment/' + EditAssessment, {
                New_AssessmentName: New_AssessmentName.current
            })
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

            {/* Get New Assessment Name */}
            {isRenaming ?
                <span>
                    <button onClick={() => setisRenaming(false)}>Stop Renaming</button> <br />
                    New Assessment Name: <input type='text' onChange={event => New_AssessmentName.current = event.target.value} /> <br />
                </span>
            :
                <span>
                    <button onClick={() => setisRenaming(true)}>Start Renaming</button> <br />
                </span>
            }

            <button onClick={Commit_Changes}>Commit Edits</button>

            {/* For Deleting the Catgeory */}
            <button onClick={Delete}>Delete</button>

        </div>
    )
}

export default AssessmentEditor;