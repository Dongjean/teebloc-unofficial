import {useState, useEffect, useRef} from 'react';

import API from '../../utils/API.js';

function TopicEditor() {
    const [EditTopic, setEditTopic] = useState()

    const [AllTopics, setAllTopics] = useState([])
    const [RelatedSubjects, setRelatedSubjects] = useState([])

    const [ShowRelatedSubjects, setShowRelatedSubjects] = useState(false)

    const [AllSubjects, setAllSubjects] = useState([])

    const RelinkSubjectRef = useRef()

    const [isRelinking, setisRelinking] = useState(false)

    useEffect(() => {
        GetAllTopics()
    }, [])

    useEffect(() => {
        if (EditTopic) {
            GetRelatedSubjects(EditTopic)
            GetAllSubjects()
        }
    }, [EditTopic])

    async function GetAllTopics() {
        try {
            const result = await API.get('/Categories/Get/Topics/All')
            setAllTopics(result.data)
            setEditTopic(result.data[0].topicid) //initially set the first Topic as the topic to edit
        } catch(err) {
            console.log(err)
        }
    }

    async function GetRelatedSubjects(EditTopic) {
        try {
            const result = await API.get('/Categories/Get/Subjects/fromTopicID/' + EditTopic)
            console.log(result.data)
            setRelatedSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetAllSubjects() {
        try {
            const result = await API.get('/Categories/Get/Subjects/All')
            RelinkSubjectRef.current = result.data[0].subjectid
            setAllSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function Relink_Subject(TopicID, SubjectID) {
        try {
            await API.post('/Categories/Relink/Topic/' + TopicID + '/Subject/' + SubjectID)
        } catch(err) {
            console.log(err)
        }
    }

    async function Delete() {
        try {
            //Delete the Category
            await API.post('/Categories/Delete/Topic/' + EditTopic)
            
            //reload page
            window.location.reload(false);
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <select onChange={event => setEditTopic(event.target.value)}>
                {AllTopics.map(Topic => 
                    <option key={Topic.topicid} value={Topic.topicid}>{Topic.topicname}</option>
                )}
            </select> <br />

            {/* Display All the related Subjects */}
            Existing Relations:<br />

            {ShowRelatedSubjects ?
                <div>
                    <button onClick={() => setShowRelatedSubjects(false)}>Hide Related Subject</button> <br />
                    {RelatedSubjects.map(RelatedSubject => 
                        <div key={RelatedSubject.subjectid}>
                            {RelatedSubject.subject}
                        </div>
                    )}
                </div>
            :
                <div>
                    <button onClick={() => setShowRelatedSubjects(true)}>Show Related Subject</button> <br />
                </div>
            }

            {isRelinking ? 
                <div>
                    <button onClick={() => setisRelinking(false)}>Stop Relinking</button> <br />
                    <select onChange={event => RelinkSubjectRef.current = event.target.value}>
                        {AllSubjects.map(Subject =>
                            <option key={Subject.subjectid} value={Subject.subjectid}>
                                {Subject.subject}
                            </option>
                        )}
                    </select>

                    <button onClick={() => Relink_Subject(EditTopic, RelinkSubjectRef.current)}>Relink!</button>
                </div>
            :
                <div>
                    <button onClick={() => setisRelinking(true)}>Start Relinking</button>
                </div>
            }

            {/* For Deleting the Catgeory */}
            <button onClick={Delete}>Delete</button>

        </div>
    )
}

export default TopicEditor;