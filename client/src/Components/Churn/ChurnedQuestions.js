import API from '../../utils/API.js';

import {useMemo, useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Cookies from '../../utils/Cookies.js';

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

function ChurnedQuestions(props) {
    const navigate = useNavigate()
    const query = useQuery()

    const [Page, setPage] = useState(query.get('Page')) //set the initial page value to the queried value
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
            console.log(result.data)

            const ChurnedQuestions = localStorage.getItem('Churned')
            var temp = {
                haveChurned: false
            };

            if (ChurnedQuestions == null) {
                //if there is no churned questions saved in localstorage yet,
                localStorage.setItem('Churned', JSON.stringify(result.data))
                console.log(JSON.stringify(result.data))
            } else {
                //if there is already some churned questions saved in localstorage,
                temp = JSON.parse(ChurnedQuestions)
                for (var i=0; i<result.data.Questions.length; i++) {
                    temp.Questions.push(result.data.Questions[i])
                }

                for (var i=0; i<result.data.QuestionImages.length; i++) {
                    temp.QuestionImages.push(result.data.QuestionImages[i])
                }

                for (var i=0; i<result.data.AnswerImages.length; i++) {
                    temp.AnswerImages.push(result.data.AnswerImages[i])
                }

                localStorage.setItem('Churned', JSON.stringify(temp))
            }

            //push the newly churned QuestionIDs into ChurnedQNIDs
            const Questions = result.data.Questions
            for (var i=0; i<Questions.length; i++) {
                ChurnedQNIDs.push(Questions[i].questionid)
            }

            //set this new ChurnedQNIDs to a cookie so that new churns will not include these QNIDs
            Cookies.set('ChurnedQNIDs', ChurnedQNIDs)
            isLoadingRef.current = false

            setPage(1)
            props.setPage(1)
            setChurned(temp)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            {!isLoadingRef.current ?
                Churned.haveChurned == false ?
                    <div>
                        No more Questions to Churn
                    </div>
                    :
                    <div>
                        {console.log(Churned.Questions.slice(2 * (Page-1), 2 * (Page-1) + 2))}
                        {Churned.Questions.slice(2 * (Page-1), 2 * (Page-1) + 2).map(Question =>
                            <div key={Question.questionid}>
                                <button onClick={() => props.OpenQuestion(Question.questionid, Churned)}>
                                    School: {Question.schoolname ? Question.schoolname : <span>NA</span>} <br />
                                    Uploader: {Question.firstname + ' ' + Question.lastname} <br />
                                    <br />
                                </button>
                                <br />
                            </div>
                        )}

                        {/* Page Buttons */}
                        <button onClick={() => {setPage(Page - 1); props.DecrementPage();}}>Previous Page</button>
                        <button onClick={() => {setPage(Page + 1); props.IncrementPage();}}>Next Page</button>
                    </div>
            :
                null
            }
        </div>
    )
}

export default ChurnedQuestions;