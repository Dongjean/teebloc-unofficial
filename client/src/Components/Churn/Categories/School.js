import {useState} from 'react';

function School(props) {
    const [isChecked, setisChecked] = useState(props.isSchoolSelected)

    function onClick() {
        setisChecked(!isChecked)

        if (!isChecked == true) {
            props.SchoolSelected(props.School.schoolid)
        } else {
            props.SchoolDeselected(props.School.schoolid)
        }
    }

    return (
        <div>
            {props.School.schoolname} <input type='checkbox' checked={isChecked} onClick={onClick} readOnly={true} />
        </div>
    )
}

export default School;