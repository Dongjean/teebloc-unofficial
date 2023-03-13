import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Topic from '../Categories/Topic.js';

function TopicSelector(props) {
    const [Topics, setTopics] = useState([])
    const [TopicsSelection, setTopicsSelection] = useState(props.TopicsSelection)


    //isAllSelected and isAllDeselected do not store whether or not all the topics are selected/deselected
    //instead, it stores whether the Select All or Deselect All buttons have been clicked
    const [isAllSelected, setisAllSelected] = useState(false)
    const [isAllDeselected, setisAllDeselected] = useState(false)

    //calls everytime a new subject is selected
    useEffect(() => {
        getTopics(props.SubjectSelection)
    }, [props.SubjectSelection])

    async function getTopics(Subject) { //get Topics to display
        try {
            const result = await API.get('/Categories/Get/Topics/fromSubjectID/' + Subject)
            setTopics(result.data)

            const TopicIDs = result.data.map(topic => parseInt(topic.topicid))
            for (var i=0; i<TopicsSelection.length; i++) {
                if (!TopicIDs.includes(TopicsSelection[i])) {
                    setTopicsSelection(current => current.filter(topicid => topicid !== TopicsSelection[i]))
                    props.TopicChanged(TopicsSelection[i], false)
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    function TopicSelected(TopicID) {
        setTopicsSelection(current => {
            if (current.includes(parseInt(TopicID))) {
                return current
            } else {
                current.push(parseInt(TopicID))
                return current
            }
        })

        props.TopicChanged(TopicID, true)
    }

    function TopicDeselected(TopicID) {
        setTopicsSelection(current => current.filter(topicid => topicid !== parseInt(TopicID)))
        props.TopicChanged(TopicID, false)
    }

    function Select_All() {
        setisAllSelected(true)

        setisAllDeselected(false)
    }

    function Deselect_All() {
        setisAllDeselected(true)

        setisAllSelected(false)
    }

    return (
        <div>
            {Topics.map(topic =>
                <Topic key={topic.topicid} Topic={topic} TopicSelected={TopicSelected} TopicDeselected={TopicDeselected} isTopicSelected={TopicsSelection.includes(parseInt(topic.topicid))} isAllSelected={isAllSelected} isAllDeselected={isAllDeselected} setAllSelectors={bool => {setisAllSelected(bool); setisAllDeselected(bool)}} />
            )}          

            {/* Button to select all */}
            <button onClick={Select_All}>Select All Topics</button>

            {/* Button to deselect all */}
            <button onClick={Deselect_All}>Deselect All Topics</button>
        </div>
    )
}

export default TopicSelector;