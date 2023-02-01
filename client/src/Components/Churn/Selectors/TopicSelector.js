import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Topic from '../Categories/Topic.js';

function TopicSelector(props) {
    const [Topics, setTopics] = useState([])
    const [TopicsSelection, setTopicsSelection] = useState(props.TopicsSelection)

    //calls everytime a new subject is selected
    useEffect(() => {
        getTopics(props.SubjectSelection)
    }, [props.SubjectSelection])

    async function getTopics(Subject) { //get Topics to display
        try {
            const result = await API.get('/Categories/Get/Topics/fromSubjectID/' + Subject)
            setTopics(result.data)

            var temp = TopicsSelection;
            const TopicIDs = result.data.map(topic => topic.topicid)
            for (var i=0; i<TopicsSelection.length; i++) {
                if (!TopicIDs.includes(TopicsSelection[i])) {
                    temp = temp.filter(TopicID => TopicID !== TopicsSelection[i])
                }
            }
            setTopicsSelection(temp)
            props.TopicChanged(temp)
        } catch(err) {
            console.log(err)
        }
    }

    function TopicSelected(TopicID) {
        var temp = [...TopicsSelection]
        temp.push(parseInt(TopicID))
        setTopicsSelection(temp)
        props.TopicChanged(temp)
    }

    function TopicDeselected(TopicID) {
        const temp = TopicsSelection.filter(topicid => topicid !== parseInt(TopicID))
        setTopicsSelection(temp)
        props.TopicChanged(temp)
    }

    return (
        <div>
            {Topics.map(topic =>
                <Topic key={topic.topicid} Topic={topic} TopicSelected={TopicSelected} TopicDeselected={TopicDeselected} isTopicSelected={TopicsSelection.includes(topic.topicid)} />
            )}          
        </div>
    )
}

export default TopicSelector;