import {useState, useRef, useEffect} from 'react';
import API from '../../utils/API';

function PaperPoster(props) {

    const SubjectsRef = useRef([])

    const [SubjectsDisplay, setSubjectsDisplay] = useState('none')

    const NewPaperRef = useRef('')

    const [Subjects, setSubjects] = useState([])

    useEffect(() => {
        GetSubjects()
    }, [])

    async function GetSubjects() {
        try {
            const result = await API.get('/Categories/Get/Subjects/All')
            setSubjects(result.data)
        } catch(err) {
            console.log(err)
        }
    }
    return (
        <div>
            {/* Subjects Selector */}
            
            {SubjectsDisplay == 'none' ?
                <a onClick={() => setSubjectsDisplay('inline')}>▼ Subjects</a>
            :
                <a onClick={() => setSubjectsDisplay('none')}>▲ Subjects</a>
            }
            <div style={{display: SubjectsDisplay}}>
                {Subjects.map(Subject => 
                    <div key={Subject.subjectid}>
                        {Subject.subject} <input type='checkbox' onClick={event => {
                            if (event.target.checked == true) {
                                //Add this Subject to SubjectsRef.current
                                SubjectsRef.current.push(Subject.subjectid)
                            } else {
                                //Remove this Subject from SubjectsRef.current
                                SubjectsRef.current = SubjectsRef.current.filter(subjectid => subjectid !== Subject.subjectid)
                            }
                        }}/>
                    </div>
                )}
            </div> <br />

            <input type='text' ref={NewPaperRef} /> <br />
            <input type='submit' value='Add' onClick={event => props.SubmitPaper(event, SubjectsRef.current, NewPaperRef.current.value)}/>
        </div>
    )
}

export default PaperPoster;