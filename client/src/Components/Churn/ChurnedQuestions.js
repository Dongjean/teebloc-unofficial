import API from '../../utils/API.js';

import {useState, useEffect, useRef} from 'react';
import Cookies from '../../utils/Cookies.js';

function ChurnedQuestions(props) {
    const isLoadingRef = useRef(true) //loading at first
    const [Churned, setChurned] = useState({})

    //gets a new set of churned questions on mount/when ForceUpdate is used in HomePage.js and Update state changes
    useEffect(() => {
        GetChurnedQuestions(props.TopicsSelection, props.LevelsSelection, props.PapersSelection, props.AssessmentsSelection)
    }, [props.Update])

    async function GetChurnedQuestions(TopicsSelection, LevelsSelection, PapersSelection, AssessmentsSelection) {
        try {
            var ChurnedQNIDs = Cookies.get('ChurnedQNIDs')
            if (!ChurnedQNIDs) {
                ChurnedQNIDs = [] //if the cookies dont exist, ChurnedQNIDs is an empty array
            }
            console.log(ChurnedQNIDs)
            const Queries =
                'Topics=' + JSON.stringify(TopicsSelection) + '&' +
                'Levels=' + JSON.stringify(LevelsSelection) + '&' +
                'Papers=' + JSON.stringify(PapersSelection) + '&' +
                'Assessments=' + JSON.stringify(AssessmentsSelection) + '&' +
                'ChurnedQNIDs=' + JSON.stringify(ChurnedQNIDs)
            
            const result = await API.get(`/Questions/Churn?` + Queries)

            //push the newly churned QuestionIDs into ChurnedQNIDs
            const Questions = result.data.Questions
            for (var i=0; i<Questions.length; i++) {
                ChurnedQNIDs.push(Questions[i].questionid)
            }

            //set this new ChurnedQNIDs to a cookie so that new churns will not include these QNIDs
            Cookies.set('ChurnedQNIDs', ChurnedQNIDs)
            isLoadingRef.current = false
            setChurned(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            {!isLoadingRef.current ?
                Churned.Questions.length == 0 ?
                    <div>
                        No more Questions to Churn
                    </div>
                    :
                    Churned.Questions.map(Question =>
                        <div key={Question.questionid}>
                            <button>
                                School: {Question.schoolname ? Question.schoolname : <span>NA</span>} <br />
                                Uploader: {Question.firstname + ' ' + Question.lastname} <br />
                                <br />
                            </button>
                            <br />
                        </div>)
            :
                null
            }
        </div>
    )
}

export default ChurnedQuestions;