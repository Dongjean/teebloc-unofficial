import {useState, useEffect} from 'react';

import API from '../../utils/API.js';

function SchoolEditor() {
    const [EditSchool, setEditSchool] = useState()

    const [AllSchools, setAllSchools] = useState([])
    const [RelatedSubjects, setRelatedSubjects] = useState([])

    const [ShowRelatedSubjects, setShowRelatedSubjects] = useState(false)

    const [isLinking, setisLinking] = useState(false)

    const [UnrelatedSubjects, setUnrelatedSubjects] = useState([])

    const [ShowUnrelatedSubjects, setShowUnrelatedSubjects] = useState(false)

    useEffect(() => {
        GetAllSchools()
    }, [])

    useEffect(() => {
        if (EditSchool) {
            GetRelatedSubjects(EditSchool)

            GetUnrelatedSubjects(EditSchool)
        }
    }, [EditSchool])

    async function GetAllSchools() {
        try {
            const result = await API.get('/Categories/Get/Schools/All')
            setAllSchools(result.data)
            setEditSchool(result.data[0].schoolid) //initially set the first School as the school to edit
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedSubjects(SchoolID) {
        try {
            const result = await API.get('/Categories/Get/Subjects/fromSchoolID/' + SchoolID)
            console.log(result.data)
            setRelatedSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetUnrelatedSubjects(SchoolID) {
        try {
            const result = await API.get('/Categories/Get/Subjects/fromSchoolID/' + SchoolID + '?Options=Inverse')
            setUnrelatedSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnlinkSubject(SchoolID, SubjectID) {
        try {
            await API.post('/Categories/Unlink/School/' + SchoolID + '/Subject/' + SubjectID)
        } catch(err) {
            console.log(err)
        }
    }

    async function LinkSubject(SchoolID, SubjectID) {
        try {
            await API.post('/Categories/Link/School/' + SchoolID + '/Subject/' + SubjectID)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <select onChange={event => setEditSchool(event.target.value)}>
                {AllSchools.map(School => 
                    <option key={School.schoolid} value={School.schoolid}>{School.schoolname}</option>
                )}
            </select> <br />

            {/* Display All the related Subjects */}
            Existing Relations:<br />

            {ShowRelatedSubjects ?
                <div>
                    <button onClick={() => setShowRelatedSubjects(false)}>Hide Related Subjects</button> <br />
                    {RelatedSubjects.map(RelatedSubject => 
                        <div key={RelatedSubject.subjectid}>
                            {RelatedSubject.subject} <button onClick={() => UnlinkSubject(EditSchool, RelatedSubject.subjectid)}>Unlink</button>
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
                                    {UnrelatedSubject.subject} <button onClick={() => LinkSubject(EditSchool, UnrelatedSubject.subjectid)}>Link</button>
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

export default SchoolEditor;