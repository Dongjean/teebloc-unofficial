import {useState, useEffect} from 'react';

import API from '../../utils/API.js';

function TopicEditor() {
    const [EditTopic, setEditTopic] = useState()

    const [AllTopics, setAllTopics] = useState([])
    const [RelatedSubjects, setRelatedSubjects] = useState([])

    const [ShowRelatedSubjects, setShowRelatedSubjects] = useState(false)

    useEffect(() => {
        GetAllTopics()
    }, [])

    useEffect(() => {
        if (EditTopic) {
            GetRelatedSubjects(EditTopic)
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

        </div>
    )
}

export default TopicEditor;