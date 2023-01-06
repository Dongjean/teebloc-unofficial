import API from '../utils/API.js';

//Component imports
import Question from './Question.js';
import Answer from './Answer.js';

import {useState, useEffect} from 'react';

function ChurnedQuestions(props) {
    const [Churned, setChurned] = useState([])
    const [isAnswerOpen, setAnswerOpen] = useState(false)

    //gets a new set of churned questions everytime the selected categories change
    useEffect(() => {
        GetChurnedQuestions(props.Selected)
    }, [props.Selected])

    async function GetChurnedQuestions(Selected) {
        try {
            const result = await API.get(`/Questions/Churn/` + JSON.stringify(Selected))
            setChurned(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            {Churned.map(Qn =>
                <div key={Qn.questionid}>
                    <Question Question={Qn} />
                    {isAnswerOpen ?
                    <div>
                        <Answer Question={Qn} />
                        <button onClick={() => setAnswerOpen(!isAnswerOpen)}>Hide Answer</button>
                    </div>:
                    <button onClick={() => setAnswerOpen(!isAnswerOpen)}>Open Answer</button>}
                </div>)}
        </div>
    )
}

export default ChurnedQuestions;