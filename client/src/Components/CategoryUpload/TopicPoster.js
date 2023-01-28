import {useState, useRef, useEffect} from 'react';
import API from '../../utils/API';

function TopicPoster(props) {

    const SubjectRef = useRef('')

    const NewTopicRef = useRef('')

    const [Subjects, setSubjects] = useState([])

    useEffect(() => {
        GetSubjects()
    }, [])

    async function GetSubjects() {
        try {
            const result = await API.get('/Categories/Get/Subjects/All')
            SubjectRef.current = result.data[0].subjectid
            setSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }
    return (
        <div>
            {/* Subject Selector */}

            <select onChange={(event => SubjectRef.current = event.target.value)}>
                {Subjects.map(Subject => <option key={Subject.subjectid} value={Subject.subjectid}>{Subject.subject}</option>)}
            </select>

            <input type='text' ref={NewTopicRef} /> <br />
            <input type='submit' value='Add' onClick={event => props.SubmitTopic(event, SubjectRef.current, NewTopicRef.current.value)}/>
        </div>
    )
}

export default TopicPoster;