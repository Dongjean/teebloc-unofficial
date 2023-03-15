import {useState, useEffect, useRef} from 'react';

import API from '../../utils/API.js';

function PaperEditor() {
    const [EditPaper, setEditPaper] = useState()

    const [AllPapers, setAllPapers] = useState([])
    const [RelatedSubjects, setRelatedSubjects] = useState([])

    const [ShowRelatedSubjects, setShowRelatedSubjects] = useState(false)

    const [isLinking, setisLinking] = useState(false)

    const [UnrelatedSubjects, setUnrelatedSubjects] = useState([])

    const [ShowUnrelatedSubjects, setShowUnrelatedSubjects] = useState(false)

    const [UnlinkedSubjects, setUnlinkedSubjects] = useState([])

    const [LinkedSubjects, setLinkedSubjects] = useState([])

    const [isRenaming, setisRenaming] = useState(false)
    const New_PaperName = useRef('')

    useEffect(() => {
        GetAllPapers()
    }, [])

    useEffect(() => {
        if (EditPaper) {
            GetRelatedSubjects(EditPaper)

            GetUnrelatedSubjects(EditPaper)
        }
    }, [EditPaper])

    async function GetAllPapers() {
        try {
            const result = await API.get('/Categories/Get/Papers/All')
            setAllPapers(result.data)
            setEditPaper(result.data[0].paperid) //initially set the first Paper as the paper to edit
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedSubjects(PaperID) {
        try {
            const result = await API.get('/Categories/Get/Subjects/fromPaperID/' + PaperID)
            console.log(result.data)
            setRelatedSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetUnrelatedSubjects(PaperID) {
        try {
            const result = await API.get('/Categories/Get/Subjects/fromPaperID/' + PaperID + '?Options=Inverse')
            setUnrelatedSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnlinkSubject(PaperID, SubjectID) {
        try {
            await API.post('/Categories/Unlink/Subject/' + SubjectID + '/Paper/' + PaperID)
        } catch(err) {
            console.log(err)
        }
    }

    async function LinkSubject(PaperID, SubjectID) {
        try {
            await API.post('/Categories/Link/Subject/' + SubjectID + '/Paper/' + PaperID)
        } catch(err) {
            console.log(err)
        }
    }

    function Commit_Changes() {
        try {

            //unlinking
            for (var i=0; i<UnlinkedSubjects.length; i++) {
                UnlinkSubject(EditPaper, UnlinkedSubjects[i])
            }

            //linking
            for (var i=0; i<LinkedSubjects.length; i++) {
                LinkSubject(EditPaper, LinkedSubjects[i])
            }

            //Renaming if needed
            
            if (isRenaming) {
                Rename(New_PaperName)
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
            const response = await API.post('/Categories/Delete/Paper/' + EditPaper)

            if (response.data) {
                //reload page
                window.location.reload(false);
            } else {
                window.alert('Questions With this Paper Already Exists! Deletion is thus not allowed.')
            }
        } catch(err) {
            console.log(err)
        }
    }

    async function Rename(New_PaperName) {
        try {
            await API.post('/Categories/Rename/Paper/' + EditPaper, {
                New_PaperName: New_PaperName.current
            })
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <select onChange={event => setEditPaper(event.target.value)}>
                {AllPapers.map(Paper => 
                    <option key={Paper.paperid} value={Paper.paperid}>{Paper.paper}</option>
                )}
            </select> <br />

            {/* Display All the related Subjects */}
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
                </div>
            :
                <div>
                    <button onClick={() => setisLinking(true)}>Start Linking</button>
                </div>
            }

            {/* Get New Paper Name */}
            {isRenaming ?
                <span>
                    <button onClick={() => setisRenaming(false)}>Stop Renaming</button> <br />
                    New Paper Name: <input type='text' onChange={event => New_PaperName.current = event.target.value} /> <br />
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

export default PaperEditor;