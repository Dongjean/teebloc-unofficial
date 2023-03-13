import {useState, useEffect} from 'react';

function Paper(props) {
    const [isChecked, setisChecked] = useState(props.isPaperSelected)

    useEffect(() => {
        if (props.isAllSelected) {
            setisChecked(true)
            props.PaperSelected(props.Paper.paperid)
        } else if (props.isAllDeselected) {
            setisChecked(false)
            props.PaperDeselected(props.Paper.paperid)
        }
    }, [props.isAllSelected, props.isAllDeselected])

    function onClick() {
        setisChecked(!isChecked)

        props.setAllSelectors(false)
        if (!isChecked == true) {
            props.PaperSelected(props.Paper.paperid)
        } else {
            props.PaperDeselected(props.Paper.paperid)
        }
    }

    return (
        <div>
            {props.Paper.paper} <input type='checkbox' checked={isChecked} onClick={onClick} readOnly={true} />
        </div>
    )
}

export default Paper;