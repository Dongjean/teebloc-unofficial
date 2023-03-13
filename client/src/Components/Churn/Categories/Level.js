import {useState, useEffect} from 'react';

function Level(props) {
    const [isChecked, setisChecked] = useState(props.isLevelSelected)

    useEffect(() => {
        if (props.isAllSelected) {
            setisChecked(true)
            props.LevelSelected(props.Level.levelid)
        } else if (props.isAllDeselected) {
            setisChecked(false)
            props.LevelDeselected(props.Level.levelid)
        }
    }, [props.isAllSelected, props.isAllDeselected])

    function onClick() {
        setisChecked(!isChecked)

        props.setAllSelectors(false)
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