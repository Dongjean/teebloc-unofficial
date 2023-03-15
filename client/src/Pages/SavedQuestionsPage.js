import {useParams, useNavigate} from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';
import API from '../utils/API';
import useQuery from '../utils/useQuery';

//component imports
import MasterSelector from '../Components/Churn/Selectors/MasterSelector';
import ChurnedQuestions from "../Components/Churn/ChurnedQuestions";

//Churn Loading GIF import
import ChurnLoadingGIF from '../Images/Loading.gif';

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
        Page: parseInt(query.get('Page')),

        Subject: JSON.parse(query.get('Subject')) || null,
        Topics: JSON.parse(query.get('Topics')) || null,
        Levels: JSON.parse(query.get('Levels')) || null,
        Papers: JSON.parse(query.get('Papers')) || null,
        Assessments: JSON.parse(query.get('Assessments')) || null,
        Schools: JSON.parse(query.get('Schools')) || null
    })
    
    const [CurrURL, setCurrURL] = useState('/Account/' + Email + '/Saved')

    const [isChurnLoading, setisChurnLoading] = useState(false)

    function navigator(Queries) {
        console.log('/Account/' + Email + '/Saved/' + Queries)
        setCurrURL('/Account/' + Email + '/Saved/' + Queries)
    }

    const isFirstMountRef = useRef(true)
    useEffect(() => {
        if (isFirstMountRef.current) {
            isFirstMountRef.current = false
        } else {
            console.log(CurrURL)
            navigate(CurrURL)
        }
    }, [CurrURL])

    useEffect(() => {
        if (Selection.isFiltered) {
            GetQueriedSavedQuestions(Email, Selection)
        } else {
            GetAllSavedQuestions(Email)
        }
    }, [Selection])

    async function GetAllSavedQuestions(Email) {
        try {
            const result = await API.get('/Questions/Get/Saved/All/' + Email)
            console.log(result.data)
            setSavedQuestions(result.data)
            
            const temp = Selection
            temp.isChurned = true
            console.log(temp.Page)
            temp.Page = temp.Page || 1
            setSelection(temp)
            
            setisLoading(false)
        } catch(err) {
            console.log(err)
        }
    }
console.log(Selection)
    async function GetQueriedSavedQuestions(Email, Selection) {
        try {
            const Queries = '?' +
            'Topics=' + JSON.stringify(Selection.Topics) + '&' +
            'Levels=' + JSON.stringify(Selection.Levels) + '&' +
            'Papers=' + JSON.stringify(Selection.Papers) + '&' +
            'Assessments=' + JSON.stringify(Selection.Assessments) + '&' +
            'Schools=' + JSON.stringify(Selection.Schools)

            setisChurnLoading(true)
            const result = await API.get('/Questions/Get/Saved/Filtered/' + Email + Queries)
            setisChurnLoading(false)
            console.log(result.data)
            setSavedQuestions(result.data)
            
            const temp = Selection
            temp.isChurned = true
            console.log(temp.Page)
            temp.Page = temp.Page || 1
            setSelection(temp)
            
            setisLoading(false)
        } catch(err) {
            console.log(err)
            if (isChurnLoading) {
                setisChurnLoading(false)
            }
        }
    }

    return (
        <div>
            {isLoading ?
                //Loading GIF for first Churn of all Saved questions
                <img src={ChurnLoadingGIF} width={20} />
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

                    {/* Loading GIF for subsequent filtered churns of Saved questions */}
                    {isChurnLoading ?
                        <img src={ChurnLoadingGIF} width={20} />
                    :
                        null
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