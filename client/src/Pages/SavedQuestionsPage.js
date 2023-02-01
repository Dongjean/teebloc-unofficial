import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {useState, useEffect, useMemo} from 'react';
import API from '../utils/API';

//component imports
import MasterSelector from '../Components/Churn/MasterSelector';
import ChurnedQuestions from "../Components/Churn/ChurnedQuestions";

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

function SavedQuestionsPage(props) {
    let {Email} = useParams();
    const query = useQuery();
    const navigate = useNavigate();
    
    const [isLoading, setisLoading] = useState(true)
    const [SavedQuestions, setSavedQuestions] = useState()

    const [isFiltering, setisFiltering] = useState(false)

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
    
    const [CurrURL, setCurrURL] = useState('/Account/' + Email + '/Saved')

    function navigator(Queries) {
        console.log('/Account/' + Email + '/Saved/' + Queries)
        setCurrURL('/Account/' + Email + '/Saved/' + Queries)
    }

    useEffect(() => {
        console.log(CurrURL)
        navigate(CurrURL)
    }, [CurrURL])

    useEffect(() => {
        GetAllSavedQuestions(Email)
    }, [])

    async function GetAllSavedQuestions(Email) {
        try {
            const result = await API.get('/Questions/Get/Saved/' + Email)
            console.log(result.data)
            setSavedQuestions(result.data)
            
            const temp = Selection
            temp.isChurned = true
            temp.initialPage = temp.initialPage || 1
            setSelection(temp)
            
            setisLoading(false)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            {isLoading ?
                null
            :
                <div>
                    {isFiltering ?
                        <div>
                            <MasterSelector LoginData={props.LoginData} OpenQuestion={props.OpenQuestion} navigator={navigator} setSelection={setSelection} />
                            <button onClick={() => setisFiltering(false)}>Close Filters</button>
                        </div>
                    :
                        <div>
                            <button onClick={() => setisFiltering(true)}>Open Filters</button>
                        </div>
                    }

                    <ChurnedQuestions
                        Churned={SavedQuestions}
                        OpenQuestion={(QuestionID) => props.OpenQuestion(QuestionID)}
                        Selection={Selection}
                        LoginData={props.LoginData}
                        navigator={navigator}
                    />
                </div>
            }
        </div>
    )
}

export default SavedQuestionsPage;