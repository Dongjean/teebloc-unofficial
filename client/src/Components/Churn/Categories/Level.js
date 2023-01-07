import {useState} from 'react';

function Level(props) {
    const [isChecked, setisChecked] = useState(true)

    function onClick() {
        setisChecked(!isChecked)

        if (!isChecked == true) {
            props.LevelSelected(props.Level.levelid)
        } else {
            props.LevelDeselected(props.Level.levelid)
        }
    }

    return (
        <div>
            {props.Level.level} <input type='checkbox' checked={isChecked} onClick={onClick} readOnly={true} />
        </div>
    )
}

export default Level;