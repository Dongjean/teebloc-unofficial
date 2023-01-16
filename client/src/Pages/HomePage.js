//Components imports
import ChurnedQuestions from "../Components/Churn/ChurnedQuestions.js";
import TopicSelector from "../Components/Churn/Selectors/TopicSelector.js";
import SubjectSelector from "../Components/Churn/Selectors/SubjectSelector.js";
import LevelSelector from "../Components/Churn/Selectors/LevelSelector.js";
import PaperSelector from "../Components/Churn/Selectors/PaperSelector.js";
import AssessmentSelector from "../Components/Churn/Selectors/AssessmentSelector.js";

import {useMemo, useState, useRef, useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

function HomePage(props) {
    const query = useQuery()
    const navigate = useNavigate()

    const [TopicsDisplay, setTopicsDisplay] = useState('none')
    const [LevelsDisplay, setLevelsDisplay] = useState('none')
    const [PapersDisplay, setPapersDisplay] = useState('none')
    const [AssessmentsDisplay, setAssessmentsDisplay] = useState('none')

    //getting URL query data if it exists, if not set the category selections to an empty selection
    var Subject = 0;
    const SubjectQuery = query.get('Subject')
    if (SubjectQuery) {
        Subject = SubjectQuery
    }
    const [SubjectSelection, setSubjectSelection] = useState(Subject)

    var Topics = [];
    const TopicsQuery = query.get('Topics')
    if (TopicsQuery) {
        Topics = JSON.parse(TopicsQuery)
    }
    const [TopicsSelection, setTopicsSelection] = useState(Topics)

    var Levels = [];
    const LevelsQuery = query.get('Levels')
    if (LevelsQuery) {
        Levels = JSON.parse(LevelsQuery)
    }
    const [LevelsSelection, setLevelsSelection] = useState(Levels)

    var Papers = [];
    const PapersQuery = query.get('Papers')
    if (PapersQuery) {
        Papers = JSON.parse(PapersQuery)
    }
    const [PapersSelection, setPapersSelection] = useState(Papers)

    var Assessments = [];
    const AssessmentsQuery = query.get('Assessments')
    if (AssessmentsQuery) {
        Assessments = JSON.parse(AssessmentsQuery)
    }
    const [AssessmentsSelection, setAssessmentsSelection] = useState(Assessments)

    var QNsperPage = 5; //by default have 5 qns per page
    const QNsperPageQuery = query.get('QNsperPage')
    if (QNsperPageQuery) {
        QNsperPage = QNsperPageQuery
    }
    const QNsperPageRef = useRef(QNsperPage)

    var isChurned = false;
    const isChurnedQuery = query.get('isChurned')
    if (isChurnedQuery) {
        isChurned = (isChurnedQuery =='true')
    }
    const isChurnedRef = useRef(isChurned)

    var ChurnedDisplay = 'none';
    if (isChurned) {
        ChurnedDisplay = 'inline'
    }
    const ChurnedQNsDisplay = useRef(ChurnedDisplay) //initially questions are not churned unless otherwise stated by URL Query Params

    var Pageno = null;
    const PageQuery = query.get('Page')
    if (isChurnedRef.current && PageQuery) { //Page number can only exist when there are questions churned to have pages for
        Pageno = PageQuery
    }
    const [Page, setPage] = useState(Pageno)

    const [Update, setUpdate] = useState(true) //state to help re-render components
    function ForceUpdate() {
        setUpdate(!Update) //re-renders the components as the Update state has changed
    }

    //updates the URL query parameters to include the selections everytime selections are made
    useEffect(() => {
        navigate(
            '/?Subject=' + SubjectSelection + '&' +
            'Topics=' + JSON.stringify(TopicsSelection) + '&' +
            'Levels=' + JSON.stringify(LevelsSelection) + '&' +
            'Papers=' + JSON.stringify(PapersSelection) + '&' +
            'Assessments=' + JSON.stringify(AssessmentsSelection) + '&' +
            'QNsperPage=' + QNsperPage + '&' +
            'isChurned=' + isChurnedRef.current + '&' +
            'Page=' + Page
        )
    }, [Update, Page])

    function Churn() {
        if (
            SubjectSelection !== 0 &&
            TopicsSelection.length !== 0 &&
            LevelsSelection.length !== 0 &&
            PapersSelection.length !== 0 &&
            AssessmentsSelection.length !== 0
        ) {
            ChurnedQNsDisplay.current = 'inline'
            isChurnedRef.current = true
            ForceUpdate()
        } else {
            console.log('Please Select All Categories')
        }
    }

    return(
        <div>
            <SubjectSelector onSubjectSelected={(Subject) => setSubjectSelection(Subject)} SubjectSelection={SubjectSelection} />

            {/* For Displaying Topics */}
            {TopicsDisplay == 'none' ?
                <div> 
                    <a onClick={() => setTopicsDisplay('inline')}>▼ Topics:</a>
                    <br />
                </div>
            :
                <a onClick={() => setTopicsDisplay('none')}>▲ Topics:</a>
            }
            <span style={{display: TopicsDisplay}}>
                <TopicSelector SubjectSelection={SubjectSelection} TopicChanged={(Topics) => setTopicsSelection(Topics)} TopicsSelection={TopicsSelection} />
            </span>

            {/* For Displaying Levels */}
            {LevelsDisplay == 'none' ?
                <div>
                    <a onClick={() => setLevelsDisplay('inline')}>▼ Levels:</a>
                    <br />
                </div>
            :
                <a onClick={() => setLevelsDisplay('none')}>▲ Levels:</a>
            }
            <span style={{display: LevelsDisplay}}>
                <LevelSelector SubjectSelection={SubjectSelection} LevelChanged={(Levels) => setLevelsSelection(Levels)} LevelsSelection={LevelsSelection} />
            </span>

            {/* For Displaying Papers */}
            {PapersDisplay == 'none' ?
                <div>
                    <a onClick={() => setPapersDisplay('inline')}>▼ Papers:</a>
                    <br />
                </div>
            :
                <a onClick={() => setPapersDisplay('none')}>▲ Papers:</a>
            }
            <span style={{display: PapersDisplay}}>
                <PaperSelector SubjectSelection={SubjectSelection} PaperChanged={(Papers) => setPapersSelection(Papers)} PapersSelection={PapersSelection} />
            </span>

            {/* For Displaying Assessments */}
            {AssessmentsDisplay == 'none' ?
                <div>
                    <a onClick={() => setAssessmentsDisplay('inline')}>▼ Assessments:</a>
                    <br />
                </div>
            :
                <a onClick={() => setAssessmentsDisplay('none')}>▲ Assessments:</a>
            }
            <span style={{display: AssessmentsDisplay}}>
                <AssessmentSelector LevelsSelection={LevelsSelection} AssessmentChanged={(Assessments) => setAssessmentsSelection(Assessments)} AssessmentsSelection={AssessmentsSelection} />
            </span>

            {/* by default have 5 Questions per page if not specified by URL query params */}
            <select defaultValue={parseInt(QNsperPageRef.current)} onChange={event => QNsperPageRef.current = event.target.value}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
            </select>

            <button onClick={Churn}>Churn</button> {/* Button to Churn Questions */}

            <div style={{display: ChurnedQNsDisplay.current}}>
                <ChurnedQuestions
                    TopicsSelection={TopicsSelection}
                    LevelsSelection={LevelsSelection}
                    PapersSelection={PapersSelection}
                    AssessmentsSelection={AssessmentsSelection}
                    QNsperPage={parseInt(QNsperPageRef.current)}
                    Update={Update}
                    OpenQuestion={(QuestionID, Churned) => props.OpenQuestion(QuestionID, Churned)}
                    IncrementPage={() => setPage(Page + 1)}
                    DecrementPage={() => setPage(Page - 1)}
                    setPage={Page => {setPage(Page);console.log(Page)}}
                />
            </div>
        </div>
    )
}

export default HomePage;