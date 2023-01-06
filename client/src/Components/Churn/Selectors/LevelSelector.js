import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Level from '../Level.js';

function LevelSelector(props) {
    const [Levels, setLevels] = useState([])
    const [LevelsSelection, setLevelsSelection] = useState([])

    //calls everytime a new subject is selected
    useEffect(() => {
        getLevels(props.SubjectSelection)
    }, [props.SubjectSelection])

    async function getLevels(Subject) { //get Levels to display
        try {
            const result = await API.get('/Categories/Levels/Get/' + Subject)
            setLevels(result.data)
            setLevelsSelection(result.data)
            props.LevelChanged(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    function LevelSelected(Level) {
        var temp = [...LevelsSelection]
        temp.push(Level)
        setLevelsSelection(temp)
        props.LevelChanged(temp)
    }

    function LevelDeselected(Level) {
        const temp = LevelsSelection.filter(level => level.levelid !== Level.levelid)
        setLevelsSelection(temp)
        props.LevelChanged(temp)
    }

    return (
        <div>
            {Levels.map(level =>
                <Level key={level.levelid} Level={level} LevelSelected={LevelSelected} LevelDeselected={LevelDeselected} />
            )}
        </div>
    )
}

export default LevelSelector;