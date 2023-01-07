import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Topic from '../Categories/Topic.js';

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

            const TopicIDs = result.data.map(Topic => Topic.topicid)
            setTopicsSelection(TopicIDs)
            props.TopicChanged(TopicIDs)
        } catch(err) {
            console.log(err)
        }
    }

    function TopicSelected(TopicID) {
        var temp = [...TopicsSelection]
        temp.push(TopicID)
        setTopicsSelection(temp)
        props.TopicChanged(temp)
    }

    function TopicDeselected(TopicID) {
        const temp = TopicsSelection.filter(topicid => topicid !== TopicID)
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