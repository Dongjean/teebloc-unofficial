import {useState} from 'react';

function Topic(props) {
    const [isChecked, setisChecked] = useState(true)

    function onClick() {
        setisChecked(!isChecked)

        if (!isChecked == true) {
            props.TopicSelected(props.Topic)
        } else {
            props.TopicDeselected(props.Topic)
        }
    }

    return (
        <div>
            {props.Topic.topicname} <input type='checkbox' checked={isChecked} onClick={onClick} readOnly={true} />
        </div>
    )
}

export default Topic;