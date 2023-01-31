import {useNavigate} from "react-router-dom";
import {useState, useEffect} from 'react';
import API from '../utils/API.js';

//component imports
import MasterSelector from '../Components/Churn/MasterSelector';
import ChurnedQuestions from "../Components/Churn/ChurnedQuestions";

function HomePage(props) {
    const navigate = useNavigate()

    const [Selection, setSelection] = useState({isChurned: false})
    const [CurrURL, setCurrURL] = useState('/')

    const [Churned, setChurned] = useState()

    function navigator(Queries) {
        console.log(Queries)
        setCurrURL('/' + Queries)
    }

    useEffect(() => {
        navigate(CurrURL)
    }, [CurrURL])

    useEffect(() => {
        if (Selection.Subject) {
            GetChurnedQuestions(
                Selection.Topics,
                Selection.Levels,
                Selection.Papers,
                Selection.Assessments,
                Selection.Schools
            )
        }
    }, [Selection])

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

            setChurned(result.data)
        } catch(err) {
            console.log(err)
        }
    }console.log(Selection.isChurned)

    return(
        <div>
            <MasterSelector LoginData={props.LoginData} OpenQuestion={props.OpenQuestion} navigator={navigator} setSelection={setSelection} />

            <ChurnedQuestions
                Churned={Churned}
                OpenQuestion={(QuestionID) => props.OpenQuestion(QuestionID)}
                Selection={Selection}
                LoginData={props.LoginData}
                navigator={navigator}
            />
        </div>
    )
}

export default HomePage;