import {useState, useEffect} from 'react';

import API from '../../utils/API.js';

function SubjectEditor() {
    const [EditSubject, setEditSubject] = useState()

    const [AllSubjects, setAllSubjects] = useState([])
    const [RelatedLevels, setRelatedLevels] = useState([])
    const [RelatedPapers, setRelatedPapers] = useState([])
    const [RelatedSchools, setRelatedSchools] = useState([])

    const [ShowRelatedLevels, setShowRelatedLevels] = useState(false)
    const [ShowRelatedPapers, setShowRelatedPapers] = useState(false)
    const [ShowRelatedSchools, setShowRelatedSchools] = useState(false)

    const [isLinking, setisLinking] = useState(false)

    const [UnrelatedLevels, setUnrelatedLevels] = useState([])
    const [UnrelatedPapers, setUnrelatedPapers] = useState([])
    const [UnrelatedSchools, setUnrelatedSchools] = useState([])

    const [ShowUnrelatedLevels, setShowUnrelatedLevels] = useState(false)
    const [ShowUnrelatedPapers, setShowUnrelatedPapers] = useState(false)
    const [ShowUnrelatedSchools, setShowUnrelatedSchools] = useState(false)

    const [UnlinkedLevels, setUnlinkedLevels] = useState([])
    const [UnlinkedPapers, setUnlinkedPapers] = useState([])
    const [UnlinkedSchools, setUnlinkedSchools] = useState([])

    const [LinkedLevels, setLinkedLevels] = useState([])
    const [LinkedPapers, setLinkedPapers] = useState([])
    const [LinkedSchools, setLinkedSchools] = useState([])

    useEffect(() => {
        GetAllSubjects()
    }, [])

    useEffect(() => {
        if (EditSubject) {
            GetRelatedLevels(EditSubject)
            GetRelatedPapers(EditSubject)
            GetRelatedSchools(EditSubject)

            GetUnrelatedLevels(EditSubject)
            GetUnrelatedPapers(EditSubject)
            GetUnrelatedSchools(EditSubject)
        }
    }, [EditSubject])

    async function GetAllSubjects() {
        try {
            const result = await API.get('/Categories/Get/Subjects/All')
            setAllSubjects(result.data)
            setEditSubject(result.data[0].subjectid) //initially set the first Subject as the subject to edit
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedLevels(SubjectID) {
        try {
            const result = await API.get('/Categories/Get/Levels/fromSubjectID/' + SubjectID)
            setRelatedLevels(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedPapers(SubjectID) {
        try {
            const result = await API.get('/Categories/Get/Papers/fromSubjectID/' + SubjectID)
            setRelatedPapers(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedSchools(SubjectID) {
        try {
            const result = await API.get('/Categories/Get/Schools/fromSubjectID/' + SubjectID)
            setRelatedSchools(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetUnrelatedLevels(SubjectID) {
        try {
            const result = await API.get('/Categories/Get/Levels/fromSubjectID/' + SubjectID + '?Options=Inverse')
            setUnrelatedLevels(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetUnrelatedPapers(SubjectID) {
        try {
            const result = await API.get('/Categories/Get/Papers/fromSubjectID/' + SubjectID + '?Options=Inverse')
            setUnrelatedPapers(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetUnrelatedSchools(SubjectID) {
        try {
            const result = await API.get('/Categories/Get/Schools/fromSubjectID/' + SubjectID + '?Options=Inverse')
            setUnrelatedSchools(result.data)
            console.log(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnlinkLevel(SubjectID, LevelID) {
        try {
            await API.post('/Categories/Unlink/Subject/' + SubjectID + '/Level/' + LevelID)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnlinkPaper(SubjectID, PaperID) {
        try {
            await API.post('/Categories/Unlink/Subject/' + SubjectID + '/Paper/' + PaperID)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnlinkSchool(SubjectID, SchoolID) {
        try {
            await API.post('/Categories/Unlink/School/' + SchoolID + '/Subject/' + SubjectID)
        } catch(err) {
            console.log(err)
        }  
    }

    async function LinkLevel(SubjectID, LevelID) {
        try {
            await API.post('/Categories/Link/Subject/' + SubjectID + '/Level/' + LevelID)
        } catch(err) {
            console.log(err)
        }
    }

    async function LinkPaper(SubjectID, PaperID) {
        try {
            await API.post('/Categories/Link/Subject/' + SubjectID + '/Paper/' + PaperID)
        } catch(err) {
            console.log(err)
        }
    }

    async function LinkSchool(SubjectID, SchoolID) {
        try {
            await API.post('/Categories/Link/School/' + SchoolID + '/Subject/' + SubjectID)
        } catch(err) {
            console.log(err)
        }
    }

    function Commit_Changes() {
        try {

            //unlinking
            for (var i=0; i<UnlinkedLevels.length; i++) {
                UnlinkLevel(EditSubject, UnlinkedLevels[i])
            }

            for (var i=0; i<UnlinkedPapers.length; i++) {
                UnlinkPaper(EditSubject, UnlinkedPapers[i])
            }

            for (var i=0; i<UnlinkedSchools.length; i++) {
                UnlinkSchool(EditSubject, UnlinkedSchools[i])
            }

            //linking
            for (var i=0; i<LinkedLevels.length; i++) {
                LinkLevel(EditSubject, LinkedLevels[i])
            }

            for (var i=0; i<LinkedPapers.length; i++) {
                LinkPaper(EditSubject, LinkedPapers[i])
            }

            for (var i=0; i<LinkedSchools.length; i++) {
                LinkSchool(EditSubject, LinkedSchools[i])
            }

            window.location.reload(false);
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <select onChange={event => setEditSubject(event.target.value)}>
                {AllSubjects.map(Subject => 
                    <option key={Subject.subjectid} value={Subject.subjectid}>{Subject.subject}</option>
                )}
            </select> <br />

            {/* Display All the related Levels, Papers, and Schools */}
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

            {ShowRelatedPapers ?
                <div>
                    <button onClick={() => setShowRelatedPapers(false)}>Hide Related Papers</button> <br />
                    {RelatedPapers.map(RelatedPaper => 
                        <div key={RelatedPaper.paperid}>
                            {RelatedPaper.paper}
                            {UnlinkedPapers.includes(RelatedPaper.paperid) ?
                                <button onClick={() => setUnlinkedPapers(UnlinkedPapers.filter(UnlinkedPaper => UnlinkedPaper !== RelatedPaper.paperid))}>Undo</button>
                            :
                                <button onClick={() => setUnlinkedPapers(current => [...current, RelatedPaper.paperid])}>Unlink</button>
                            }
                        </div>
                    )}
                </div>
            :
                <div>
                    <button onClick={() => setShowRelatedPapers(true)}>Show Related Papers</button> <br />
                </div>
            }

            {ShowRelatedSchools ?
                <div>
                    <button onClick={() => setShowRelatedSchools(false)}>Hide Related Schools</button> <br />
                    {RelatedSchools.map(RelatedSchool => 
                        <div key={RelatedSchool.schoolid}>
                            {RelatedSchool.schoolname}
                            {UnlinkedSchools.includes(RelatedSchool.schoolid) ?
                                <button onClick={() => setUnlinkedSchools(UnlinkedSchools.filter(UnlinkedSchool => UnlinkedSchool !== RelatedSchool.schoolid))}>Undo</button>
                            :
                                <button onClick={() => setUnlinkedSchools(current => [...current, RelatedSchool.schoolid])}>Unlink</button>
                            }
                        </div>
                    )}
                </div>
            :
                <div>
                    <button onClick={() => setShowRelatedSchools(true)}>Show Related Schools</button> <br />
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


                    {ShowUnrelatedPapers ?
                        <div>
                            <button onClick={() => setShowUnrelatedPapers(false)}>Hide Unrelated Papers</button>
                            {UnrelatedPapers.map(UnrelatedPaper =>
                                <div key={UnrelatedPaper.paperid}>
                                    {UnrelatedPaper.paper}
                                    {LinkedPapers.includes(UnrelatedPaper.paperid) ?
                                        <button onClick={() => setLinkedPapers(LinkedPapers.filter(LinkedPaper => LinkedPaper !== UnrelatedPaper.paperid))}>Undo</button>
                                    :
                                        <button onClick={() => setLinkedPapers(current => [...current, UnrelatedPaper.paperid])}>Link</button>
                                    }
                                </div>
                            )}
                        </div>
                    :
                        <div>               
                            <button onClick={() => setShowUnrelatedPapers(true)}>Show Unrelated Papers</button>
                        </div>
                    }


                    {ShowUnrelatedSchools ?
                        <div>
                            <button onClick={() => setShowUnrelatedSchools(false)}>Hide Unrelated Schools</button>
                            {UnrelatedSchools.map(UnrelatedSchool =>
                                <div key={UnrelatedSchool.schoolid}>
                                    {UnrelatedSchool.schoolname}
                                    {LinkedSchools.includes(UnrelatedSchool.schoolid) ?
                                        <button onClick={() => setLinkedSchools(LinkedSchools.filter(LinkedSchool => LinkedSchool !== UnrelatedSchool.schoolid))}>Undo</button>
                                    :
                                        <button onClick={() => setLinkedSchools(current => [...current, UnrelatedSchool.schoolid])}>Link</button>
                                    }
                                </div>
                            )}
                        </div>
                    :
                        <div>               
                            <button onClick={() => setShowUnrelatedSchools(true)}>Show Unrelated Schools</button>
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

export default SubjectEditor;