import {useState} from 'react';

function Assessment(props) {
    const [isChecked, setisChecked] = useState(props.isAssessmentSelected)

    function onClick() {
        setisChecked(!isChecked)

        if (!isChecked == true) {
            props.AssessmentSelected(props.Assessment.assessmentid)
        } else {
            props.AssessmentDeselected(props.Assessment.assessmentid)
        }
    }

    return (
        <div>
            {props.Assessment.assessmentname} <input type='checkbox' checked={isChecked} onClick={onClick} readOnly={true} />
        </div>
    )
}

export default Assessment;