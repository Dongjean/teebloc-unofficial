import {useState, useEffect} from 'react';

function School(props) {
    const [isChecked, setisChecked] = useState(props.isSchoolSelected)

    useEffect(() => {
        if (props.isAllSelected) {
            setisChecked(true)
            props.SchoolSelected(props.School.schoolid)
        } else if (props.isAllDeselected) {
            setisChecked(false)
            props.SchoolDeselected(props.School.schoolid)
        }
    }, [props.isAllSelected, props.isAllDeselected])

    function onClick() {
        setisChecked(!isChecked)

        props.setAllSelectors(false)
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