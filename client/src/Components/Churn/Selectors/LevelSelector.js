import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Level from '../Categories/Level.js';

function LevelSelector(props) {
    const [Levels, setLevels] = useState([])
    const [LevelsSelection, setLevelsSelection] = useState(props.LevelsSelection)

    //isAllSelected and isAllDeselected do not store whether or not all the levels are selected/deselected
    //instead, it stores whether the Select All or Deselect All buttons have been clicked
    const [isAllSelected, setisAllSelected] = useState(false)
    const [isAllDeselected, setisAllDeselected] = useState(false)

    //calls everytime a new subject is selected
    useEffect(() => {
        getLevels(props.SubjectSelection)
    }, [props.SubjectSelection])

    async function getLevels(Subject) { //get Levels to display
        try {
            const result = await API.get('/Categories/Get/Levels/fromSubjectID/' + Subject)
            setLevels(result.data)

            const LevelIDs = result.data.map(level => parseInt(level.levelid))
            for (var i=0; i<LevelsSelection.length; i++) {
                if (!LevelIDs.includes(LevelsSelection[i])) {
                    setLevelsSelection(current => current.filter(levelid => levelid !== LevelsSelection[i]))
                    props.LevelChanged(LevelsSelection[i], false)
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    function LevelSelected(LevelID) {
        setLevelsSelection(current => {
            if (current.includes(parseInt(LevelID))) {
                return current
            } else {
                current.push(parseInt(LevelID))
                return current
            }
        })

        props.LevelChanged(LevelID, true)
    }

    function LevelDeselected(LevelID) {
        setLevelsSelection(current => current.filter(levelid => levelid !== parseInt(LevelID)))
        props.LevelChanged(LevelID, false)
    }

    function Select_All() {
        setisAllSelected(true)

        setisAllDeselected(false)
    }

    function Deselect_All() {
        setisAllDeselected(true)

        setisAllSelected(false)
    }

    return (
        <div>
            {Levels.map(level =>
                <Level key={level.levelid} Level={level} LevelSelected={LevelSelected} LevelDeselected={LevelDeselected} isLevelSelected={LevelsSelection.includes(parseInt(level.levelid))} isAllSelected={isAllSelected} isAllDeselected={isAllDeselected} setAllSelectors={bool => {setisAllSelected(bool); setisAllDeselected(bool)}} />
            )}

            {/* Button to select all */}
            <button onClick={Select_All}>Select All Levels</button>

            {/* Button to deselect all */}
            <button onClick={Deselect_All}>Deselect All Levels</button>
        </div>
    )
}

export default LevelSelector;