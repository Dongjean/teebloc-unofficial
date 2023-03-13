import {useState, useEffect} from 'react';

function Topic(props) {
    const [isChecked, setisChecked] = useState(props.isTopicSelected)

    useEffect(() => {
        if (props.isAllSelected) {
            setisChecked(true)
            props.TopicSelected(props.Topic.topicid)
        } else if (props.isAllDeselected) {
            setisChecked(false)
            props.TopicDeselected(props.Topic.topicid)
        }
    }, [props.isAllSelected, props.isAllDeselected])

    function onClick() {
        setisChecked(!isChecked)

        props.setAllSelectors(false)
        if (!isChecked == true) {
            props.TopicSelected(props.Topic.topicid)
        } else {
            props.TopicDeselected(props.Topic.topicid)
        }
    }

    return (
        <div>
            {props.Topic.topicname} <input type='checkbox' checked={isChecked} onClick={onClick} readOnly={true} />
        </div>
    )
}

export default Topic;