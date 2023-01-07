import {useState} from 'react';

function Topic(props) {
    const [isChecked, setisChecked] = useState(true)

    function onClick() {
        setisChecked(!isChecked)

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