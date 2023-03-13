import {useState, useEffect} from 'react';

function Assessment(props) {
    const [isChecked, setisChecked] = useState(props.isAssessmentSelected)

    useEffect(() => {
        if (props.isAllSelected) {
            setisChecked(true)
            props.AssessmentSelected(props.Assessment.assessmentid)
        } else if (props.isAllDeselected) {
            setisChecked(false)
            props.AssessmentDeselected(props.Assessment.assessmentid)
        }
    }, [props.isAllSelected, props.isAllDeselected])

    function onClick() {
        setisChecked(!isChecked)

        props.setAllSelectors(false)
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