import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Level from '../Categories/Level.js';

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

            const LevelIDs = result.data.map(Level => Level.levelid)
            setLevelsSelection(LevelIDs)
            props.LevelChanged(LevelIDs)
        } catch(err) {
            console.log(err)
        }
    }

    function LevelSelected(LevelID) {
        var temp = [...LevelsSelection]
        temp.push(LevelID)
        setLevelsSelection(temp)
        props.LevelChanged(temp)
    }

    function LevelDeselected(LevelID) {
        const temp = LevelsSelection.filter(levelid => levelid !== LevelID)
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