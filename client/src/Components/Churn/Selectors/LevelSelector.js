import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Level from '../Categories/Level.js';

function LevelSelector(props) {
    const [Levels, setLevels] = useState([])
    const [LevelsSelection, setLevelsSelection] = useState(props.LevelsSelection)

    //calls everytime a new subject is selected
    useEffect(() => {
        getLevels(props.SubjectSelection)
    }, [props.SubjectSelection])

    async function getLevels(Subject) { //get Levels to display
        try {
            const result = await API.get('/Categories/Levels/Get/' + Subject)
            setLevels(result.data)

            var temp = LevelsSelection;
            const LevelIDs = result.data.map(level => level.levelid)
            for (var i=0; i<LevelsSelection.length; i++) {
                if (!LevelIDs.includes(LevelsSelection[i])) {
                    temp = temp.filter(LevelID => LevelID !== LevelsSelection[i])
                }
            }
            setLevelsSelection(temp)
            props.LevelChanged(temp)
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
                <Level key={level.levelid} Level={level} LevelSelected={LevelSelected} LevelDeselected={LevelDeselected} isLevelSelected={LevelsSelection.includes(level.levelid)} />
            )}
        </div>
    )
}

export default LevelSelector;