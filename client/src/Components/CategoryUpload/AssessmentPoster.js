import {useState, useRef, useEffect} from 'react';
import API from '../../utils/API';

function AssessmentPoster(props) {

    const LevelsRef = useRef([])

    const [LevelsDisplay, setLevelsDisplay] = useState('none')

    const NewAssessmentRef = useRef('')

    const [Levels, setLevels] = useState([])

    useEffect(() => {
        GetLevels()
    }, [])

    async function GetLevels() {
        try {
            const result = await API.get('/Categories/Levels/GetAll')
            setLevels(result.data)
        } catch(err) {
            console.log(err)
        }
    }
    return (
        <div>
            {/* Levels Selector */}
            
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

            <input type='text' ref={NewAssessmentRef} /> <br />
            <input type='submit' value='Add' onClick={event => props.SubmitAssessment(event, LevelsRef.current, NewAssessmentRef.current.value)}/>
        </div>
    )
}

export default AssessmentPoster;