import {useNavigate} from "react-router-dom";
import {useState, useEffect} from 'react';
import API from '../utils/API.js';
import useQuery from "../utils/useQuery.js";

//component imports
import MasterSelector from '../Components/Churn/Selectors/MasterSelector';
import ChurnedQuestions from "../Components/Churn/ChurnedQuestions";

function HomePage(props) {
    const query = useQuery();
    const navigate = useNavigate();

    const [Selection, setSelection] = useState({
        isChurned: query.get('isChurned') == 'true' || false,
        isFiltered: query.get('isFiltered') == 'true' || false,
        QNsperPage: parseInt(query.get('QNsperPage')) || 5,
        initialPage: parseInt(query.get('initialPage')),

        Subject: JSON.parse(query.get('Subject')) || null,
        Topics: JSON.parse(query.get('Topics')) || null,
        Levels: JSON.parse(query.get('Levels')) || null,
        Papers: JSON.parse(query.get('Papers')) || null,
        Assessments: JSON.parse(query.get('Assessments')) || null,
        Schools: JSON.parse(query.get('Schools')) || null
    })

    const [CurrURL, setCurrURL] = useState('/')

    const [Churned, setChurned] = useState()

    function navigator(Queries) {
        console.log(Queries)
        setCurrURL('/' + Queries)
    }

    useEffect(() => {
        console.log(CurrURL)
        navigate(CurrURL)
    }, [CurrURL])

    useEffect(() => {
        if (Selection.isChurned) {
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
            const Queries = '?' +
                'Topics=' + JSON.stringify(TopicsSelection) + '&' +
                'Levels=' + JSON.stringify(LevelsSelection) + '&' +
                'Papers=' + JSON.stringify(PapersSelection) + '&' +
                'Assessments=' + JSON.stringify(AssessmentsSelection) + '&' +
                'Schools=' + JSON.stringify(SchoolsSelection)
            
            const result = await API.get(`/Questions/Churn` + Queries)

            console.log(result.data)
            const temp = Selection
            temp.isChurned = true
            temp.initialPage = temp.initialPage || 1
            setSelection(temp)

            setChurned(result.data)
        } catch(err) {
            console.log(err)
        }
    }

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