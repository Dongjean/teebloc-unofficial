import API from '../../utils/API.js';

import {useMemo, useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Cookies from '../../utils/Cookies.js';

//component imports
import Question from './Question.js';

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

function ChurnedQuestions(props) {
    const navigate = useNavigate()
    const query = useQuery()

    const [Page, setPage] = useState(query.get('Page')) //set the initial page value to the queried value
    const isLoadingRef = useRef(true) //loading at first
    
    const LocalChurned = JSON.parse(localStorage.getItem('Churned'))
    var ChurnedINIT = {}
    if (!LocalChurned) {
        GetChurnedQuestions(props.TopicsSelection, props.LevelsSelection, props.PapersSelection, props.AssessmentsSelection, props.SchoolsSelection)
    } else {
        ChurnedINIT = LocalChurned
        isLoadingRef.current = false
    }
    const [Churned, setChurned] = useState(ChurnedINIT)

    const isFirstRenderRef = useRef(true)
    //gets a new set of churned questions on mount/when ForceUpdate is used in HomePage.js and Update state changes
    useEffect(() => {
        if (isFirstRenderRef.current) {
            //dont do anything on first mount
            isFirstRenderRef.current = false
        } else {
            GetChurnedQuestions(
                props.TopicsSelection,
                props.LevelsSelection,
                props.PapersSelection,
                props.AssessmentsSelection,
                props.SchoolsSelection
            )
        }
    }, [props.Update])

    async function GetChurnedQuestions(TopicsSelection, LevelsSelection, PapersSelection, AssessmentsSelection, SchoolsSelection) {
        try {
            const Queries =
                'Topics=' + JSON.stringify(TopicsSelection) + '&' +
                'Levels=' + JSON.stringify(LevelsSelection) + '&' +
                'Papers=' + JSON.stringify(PapersSelection) + '&' +
                'Assessments=' + JSON.stringify(AssessmentsSelection) + '&' +
                'Schools=' + JSON.stringify(SchoolsSelection)
            
            const result = await API.get(`/Questions/Churn?` + Queries)

            console.log(result.data)

            localStorage.setItem('Churned', JSON.stringify(result.data))

            isLoadingRef.current = false
            console.log(typeof(Page))
            if (!Page || Page == 'null') {
                setPage(1)
                props.setPage(1)
            }
            setChurned(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            {!isLoadingRef.current ?
                    <div>
                        {Churned.Questions.slice(props.QNsperPage * (Page-1), props.QNsperPage * (Page-1) + props.QNsperPage).map(question =>
                            <div key={question.questionid}>
                                <button onClick={() => props.OpenQuestion(question.questionid, Churned)}>
                                    <Question Question={question} FirstQuestionIMG={Churned.QuestionImages.filter(QuestionImage => QuestionImage.QuestionID == question.questionid)[0]} LoginData={props.LoginData} />
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