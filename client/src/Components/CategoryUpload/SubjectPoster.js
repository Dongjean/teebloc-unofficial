import {useState, useRef, useEffect} from 'react';
import API from '../../utils/API';

function SubjectPoster(props) {

    const LevelsRef = useRef([])
    const PapersRef = useRef([])
    const SchoolsRef = useRef([])

    const [LevelsDisplay, setLevelsDisplay] = useState('none')
    const [PapersDisplay, setPapersDisplay] = useState('none')
    const [SchoolsDisplay, setSchoolsDisplay] = useState('none')

    const NewSubjectRef = useRef('')

    const [Levels, setLevels] = useState([])
    const [Papers, setPapers] = useState([])
    const [Schools, setSchools] = useState([])

    useEffect(() => {
        GetLevels()
        GetPapers()
        GetSchools()
    }, [])

    async function GetLevels() {
        try {
            const result = await API.get('/Categories/Levels/GetAll')
            setLevels(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetPapers() {
        try {
            const result = await API.get('/Categories/Papers/GetAll')
            setPapers(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function GetSchools() {
        try {
            const result = await API.get('/Categories/Schools/GetAll')
            setSchools(result.data)
        } catch(err) {
            console.log(err)
        }
    }
    return (
        <div>
            {/* Level Selector */}
            
            {LevelsDisplay == 'none' ?
                <a onClick={() => setLevelsDisplay('inline')}>▼ Levels</a>
            :
                <a onClick={() => setLevelsDisplay('none')}>▲ Levels</a>
            }
            <div style={{display: LevelsDisplay}}>
                {Levels.map(Level => 
                    <div key={Level.levelid}>
                        {Level.level} <input type='checkbox' onClick={event => {
                            if (event.target.checked == true) {
                                //Add this Level to LevelsRef.current
                                LevelsRef.current.push(Level.levelid)
                            } else {
                                //Remove this Level from LevelsRef.current
                                LevelsRef.current = LevelsRef.current.filter(levelid => levelid !== Level.levelid)
                            }
                        }}/>
                    </div>
                )}
            </div> <br />

            {/* Paper Selector */}

            {PapersDisplay == 'none' ?
                <a onClick={() => setPapersDisplay('inline')}>▼ Papers</a>
            :
                <a onClick={() => setPapersDisplay('none')}>▲ Papers</a>
            }
            <div style={{display: PapersDisplay}}>
                {Papers.map(Paper => 
                    <div key={Paper.paperid}>
                        {Paper.paper} <input type='checkbox' onClick={event => {
                            if (event.target.checked == true) {
                                //Add this Paper to LPapersRef.current
                                PapersRef.current.push(Paper.paperid)
                            } else {
                                //Remove this Paper from PapersRef.current
                                PapersRef.current = PapersRef.current.filter(paperid => paperid !== Paper.paperid)
                            }
                        }}/>
                    </div>
                )}
            </div> <br />

            {/* School Selector */}

            {SchoolsDisplay == 'none' ?
                <a onClick={() => setSchoolsDisplay('inline')}>▼ Schools</a>
            :
                <a onClick={() => setSchoolsDisplay('none')}>▲ Schools</a>
            }
            <div style={{display: SchoolsDisplay}}>
                {Schools.map(School =>
                    <div key={School.schoolid}>
                        {School.schoolname} <input type='checkbox' onClick={event => {
                            if (event.target.checked == true) {
                                //Add this School to SchoolRef.current
                                SchoolsRef.current.push(School.schoolid)
                            } else {
                                //Remove this School from SchoolRef.current
                                SchoolsRef.current = SchoolsRef.current.filter(schoolid => schoolid !== School.schoolid)
                            }
                        }} />
                    </div>
                )}
            </div> <br />

            <input type='text' ref={NewSubjectRef} /> <br />
            <input type='submit' value='Add' onClick={event => props.SubmitSubject(event, LevelsRef.current, PapersRef.current, SchoolsRef.current, NewSubjectRef.current.value)}/>
        </div>
    )
}

export default SubjectPoster;