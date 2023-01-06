import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Topic from '../Topic.js';

function TopicSelector(props) {
    const [Topics, setTopics] = useState([])
    const [TopicsSelection, setTopicsSelection] = useState([])

    //calls everytime a new subject is selected
    useEffect(() => {
        getTopics(props.SubjectSelection)
    }, [props.SubjectSelection])

    async function getTopics(Subject) { //get Topics to display
        try {
            const result = await API.get('/Categories/Topics/Get/' + Subject)
            setTopics(result.data)
            setTopicsSelection(result.data)
            props.TopicChanged(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    function TopicSelected(Topic) {
        var temp = [...TopicsSelection]
        temp.push(Topic)
        setTopicsSelection(temp)
        props.TopicChanged(temp)
    }

    function TopicDeselected(Topic) {
        const temp = TopicsSelection.filter(topic => topic.topicid !== Topic.topicid)
        setTopicsSelection(temp)
        props.TopicChanged(temp)
    }

    return (
        <div>
            {Topics.map(topic =>
                <Topic key={topic.topicid} Topic={topic} TopicSelected={TopicSelected} TopicDeselected={TopicDeselected} />
            )}          
        </div>
    )
}

export default TopicSelector;