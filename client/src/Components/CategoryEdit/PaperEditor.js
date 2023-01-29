import {useState, useEffect} from 'react';

import API from '../../utils/API.js';

function PaperEditor() {
    const [EditPaper, setEditPaper] = useState()

    const [AllPapers, setAllPapers] = useState([])
    const [RelatedSubjects, setRelatedSubjects] = useState([])

    const [ShowRelatedSubjects, setShowRelatedSubjects] = useState(false)

    const [isLinking, setisLinking] = useState(false)

    const [UnrelatedSubjects, setUnrelatedSubjects] = useState([])

    const [ShowUnrelatedSubjects, setShowUnrelatedSubjects] = useState(false)

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
                            {RelatedSubject.subject} <button onClick={() => UnlinkSubject(EditPaper, RelatedSubject.subjectid)}>Unlink</button>
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
                                    {UnrelatedSubject.subject} <button onClick={() => LinkSubject(EditPaper, UnrelatedSubject.subjectid)}>Link</button>
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

        </div>
    )
}

export default PaperEditor;