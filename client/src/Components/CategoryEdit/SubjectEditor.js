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

    useEffect(() => {
        GetAllSubjects()
    }, [])

    useEffect(() => {
        if (EditSubject) {
            GetRelatedLevels(EditSubject)
            GetRelatedPapers(EditSubject)
            GetRelatedSchools(EditSubject)
        }
    }, [EditSubject])

    async function GetAllSubjects() {
        try {
            const result = await API.get('/Categories/Subjects/GetAll')
            setAllSubjects(result.data)
            setEditSubject(result.data[0].subjectid) //initially set the first Subject as the subject to edit
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedLevels(SubjectID) {
        try {
            const result = await API.get('/Categories/Levels/Get/' + SubjectID)
            setRelatedLevels(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedPapers(SubjectID) {
        try {
            const result = await API.get('/Categories/Papers/Get/' + SubjectID)
            setRelatedPapers(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedSchools(SubjectID) {
        try {
            const result = await API.get('/Categories/Schools/Get/' + SubjectID)
            setRelatedSchools(result.data)
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
                            {RelatedLevel.level} <button>Unlink</button>
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
                            {RelatedPaper.paper} <button>Unlink</button>
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
                            {RelatedSchool.schoolname} <button>Unlink</button>
                        </div>
                    )}
                </div>
            :
                <div>
                    <button onClick={() => setShowRelatedSchools(true)}>Show Related Schools</button> <br />
                </div>
            }

        </div>
    )
}

export default SubjectEditor;