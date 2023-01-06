import {useState} from 'react';

function Assessment(props) {
    const [isChecked, setisChecked] = useState(true)

    function onClick() {
        setisChecked(!isChecked)

        if (!isChecked == true) {
            props.AssessmentSelected(props.Assessment)
        } else {
            props.AssessmentDeselected(props.Assessment)
        }
    }

    return (
        <div>
            {props.Assessment.assessmentname} <input type='checkbox' checked={isChecked} onClick={onClick} readOnly={true} />
        </div>
    )
}

export default Assessment;