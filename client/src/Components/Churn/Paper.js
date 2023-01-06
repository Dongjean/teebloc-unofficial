import {useState} from 'react';

function Paper(props) {
    const [isChecked, setisChecked] = useState(true)

    function onClick() {
        setisChecked(!isChecked)

        if (!isChecked == true) {
            props.PaperSelected(props.Paper)
        } else {
            props.PaperDeselected(props.Paper)
        }
    }

    return (
        <div>
            {props.Paper.paper} <input type='checkbox' checked={isChecked} onClick={onClick} readOnly={true} />
        </div>
    )
}

export default Paper;