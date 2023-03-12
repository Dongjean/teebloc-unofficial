import {useState, useEffect, useRef} from 'react';

import API from '../../utils/API.js';

function LevelEditor() {
    const [EditLevel, setEditLevel] = useState()

    const [AllLevels, setAllLevels] = useState([])
    const [RelatedSubjects, setRelatedSubjects] = useState([])
    const [RelatedAssessments, setRelatedAssessments] = useState([])

    const [ShowRelatedSubjects, setShowRelatedSubjects] = useState(false)
    const [ShowRelatedAssessments, setShowRelatedAssessments] = useState(false)

    const [isLinking, setisLinking] = useState(false)

    const [UnrelatedSubjects, setUnrelatedSubjects] = useState([])
    const [UnrelatedAssessments, setUnrelatedAssessments] = useState([])

    const [ShowUnrelatedSubjects, setShowUnrelatedSubjects] = useState(false)
    const [ShowUnrelatedAssessments, setShowUnrelatedAssessments] = useState(false)

    const [UnlinkedSubjects, setUnlinkedSubjects] = useState([])
    const [UnlinkedAssessments, setUnlinkedAssessments] = useState([])

    const [LinkedSubjects, setLinkedSubjects] = useState([])
    const [LinkedAssessments, setLinkedAssessments] = useState([])

    const [isRenaming, setisRenaming] = useState(false)
    const New_LevelName = useRef('')

    useEffect(() => {
        GetAllLevels()
    }, [])

    useEffect(() => {
        if (EditLevel) {
            GetRelatedSubjects(EditLevel)
            GetRelatedAssessments(EditLevel)

            GetUnrelatedSubjects(EditLevel)
            GetUnrelatedAssessments(EditLevel)
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

    async function GetUnrelatedSubjects(LevelID) {
        try {
            const result = await API.get('/Categories/Get/Subjects/fromLevelID/' + LevelID + '?Options=Inverse')
            setUnrelatedSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetUnrelatedAssessments(LevelID) {
        try {
            const result = await API.get('/Categories/Get/Assessments/fromLevelID/' + LevelID + '?Options=Inverse')
            setUnrelatedAssessments(result.data)
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

    async function LinkSubject(LevelID, SubjectID) {
        try {
            await API.post('/Categories/Link/Subject/' + SubjectID + '/Level/' + LevelID)
        } catch(err) {
            console.log(err)
        }
    }

    async function LinkAssessment(LevelID, AssessmentID) {
        try {
            await API.post('/Categories/Link/Assessment/' + AssessmentID + '/Level/' + LevelID)
        } catch(err) {
            console.log(err)
        }
    }

    function Commit_Changes() {
        try {

            //unlinking
            for (var i=0; i<UnlinkedSubjects.length; i++) {
                UnlinkSubject(EditLevel, UnlinkedSubjects[i])
            }

            for (var i=0; i<UnlinkedAssessments.length; i++) {
                UnlinkAssessment(EditLevel, UnlinkedAssessments[i])
            }

            //linking
            for (var i=0; i<LinkedSubjects.length; i++) {
                LinkSubject(EditLevel, LinkedSubjects[i])
            }

            for (var i=0; i<LinkedAssessments.length; i++) {
                LinkAssessment(EditLevel, LinkedAssessments[i])
            }

            //Renaming if needed

            if (isRenaming) {
                Rename(New_LevelName)
            }

            //Reload Page
            window.location.reload(false);
        } catch(err) {
            console.log(err)
        }
    }

    async function Delete() {
        try {
            //Delete the Category
            await API.post('/Categories/Delete/Level/' + EditLevel)
            
            //reload page
            window.location.reload(false);
        } catch(err) {
            console.log(err)
        }
    }

    async function Rename(New_LevelName) {
        try {
            await API.post('/Categories/Rename/Level/' + EditLevel, {
                New_LevelName: New_LevelName.current
            })
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
                            {RelatedSubject.subject}
                            {UnlinkedSubjects.includes(RelatedSubject.subjectid) ?
                                <button onClick={() => setUnlinkedSubjects(UnlinkedSubjects.filter(UnlinkedSubject => UnlinkedSubject !== RelatedSubject.subjectid))}>Undo</button>
                            :
                                <button onClick={() => setUnlinkedSubjects(current => [...current, RelatedSubject.subjectid])}>Unlink</button>
                            }
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
                            {RelatedAssessment.assessmentname}
                            {UnlinkedAssessments.includes(RelatedAssessment.assessmentid) ?
                                <button onClick={() => setUnlinkedAssessments(UnlinkedAssessments.filter(UnlinkedAssessment => UnlinkedAssessment !== RelatedAssessment.assessmentid))}>Undo</button>
                            :
                                <button onClick={() => setUnlinkedAssessments(current => [...current, RelatedAssessment.assessmentid])}>Unlink</button>
                            }
                        </div>
                    )}
                </div>
            :
                <div>
                    <button onClick={() => setShowRelatedAssessments(true)}>Show Related Assessments</button> <br />
                </div>
            }

            {isLinking ?
                <div>
                    <button onClick={() => setisLinking(false)}>Stop Linking</button> <br />


                    {ShowUnrelatedSubjects ?
                        <div>
                            <button onClick={() => setShowUnrelatedSubjects(false)}>Hide Unrelated Subjects</button>
                            {UnrelatedSubjects.map(UnrelatedSubject =>
                                <div key={UnrelatedSubject.subjectid}>
                                    {UnrelatedSubject.subject}
                                    {LinkedSubjects.includes(UnrelatedSubject.subjectid) ?
                                        <button onClick={() => setLinkedSubjects(LinkedSubjects.filter(LinkedSubject => LinkedSubject !== UnrelatedSubject.subjectid))}>Undo</button>
                                    :
                                        <button onClick={() => setLinkedSubjects(current => [...current, UnrelatedSubject.subjectid])}>Link</button>
                                    }
                                </div>
                            )}
                        </div>
                    :
                        <div>               
                            <button onClick={() => setShowUnrelatedSubjects(true)}>Show Unrelated Subjects</button>
                        </div>
                    }


                    {ShowUnrelatedAssessments ?
                        <div>
                            <button onClick={() => setShowUnrelatedAssessments(false)}>Hide Unrelated Assessments</button>
                            {UnrelatedAssessments.map(UnrelatedAssessment =>
                                <div key={UnrelatedAssessment.assessmentid}>
                                    {UnrelatedAssessment.assessmentname}
                                    {LinkedAssessments.includes(UnrelatedAssessment.assessmentid) ?
                                        <button onClick={() => setLinkedAssessments(LinkedAssessments.filter(LinkedAssessment => LinkedAssessment !== UnrelatedAssessment.assessmentid))}>Undo</button>
                                    :
                                        <button onClick={() => setLinkedAssessments(current => [...current, UnrelatedAssessment.assessmentid])}>Link</button>
                                    }
                                </div>
                            )}
                        </div>
                    :
                        <div>               
                            <button onClick={() => setShowUnrelatedAssessments(true)}>Show Unrelated Assessments</button>
                        </div>
                    }
                </div>
            :
                <div>
                    <button onClick={() => setisLinking(true)}>Start Linking</button>
                </div>
            }

            {/* Get New Level Name */}
            {isRenaming ?
                <span>
                    <button onClick={() => setisRenaming(false)}>Stop Renaming</button> <br />
                    New Level Name: <input type='text' onChange={event => New_LevelName.current = event.target.value} /> <br />
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

export default LevelEditor;