import API from '../../utils/API.js';

import {useState, useEffect, useRef} from 'react';

function ChurnedQuestions(props) {
    const isLoadingRef = useRef(true) //loading at first
    const [Churned, setChurned] = useState({})

    //gets a new set of churned questions on mount/when ForceUpdate is used in HomePage.js and Update state changes
    useEffect(() => {
        console.log("hi")
        GetChurnedQuestions(props.TopicsSelection, props.LevelsSelection, props.PapersSelection, props.AssessmentsSelection)
    }, [props.Update])

    async function GetChurnedQuestions(TopicsSelection, LevelsSelection, PapersSelection, AssessmentsSelection) {
        try {
            const Queries =
                'Topics=' + JSON.stringify(TopicsSelection) + '&' +
                'Levels=' + JSON.stringify(LevelsSelection) + '&' +
                'Papers=' + JSON.stringify(PapersSelection) + '&' +
                'Assessments=' + JSON.stringify(AssessmentsSelection)
            
            const result = await API.get(`/Questions/Churn?` + Queries)
            console.log(result.data)
            isLoadingRef.current = false
            setChurned(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            {!isLoadingRef.current ?
                Churned.Questions.map(Question =>
                    <div key={Question.questionid}>
                        School: {Question.schoolname ? Question.schoolname : <span>NA</span>} <br />
                        Uploader: {Question.firstname + Question.lastname} <br />
                        <br />
                    </div>)
            :
                null
            }
        </div>
    )
}

export default ChurnedQuestions;