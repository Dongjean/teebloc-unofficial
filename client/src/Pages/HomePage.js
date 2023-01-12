//Components imports
import ChurnedQuestions from "../Components/Churn/ChurnedQuestions.js";
import TopicSelector from "../Components/Churn/Selectors/TopicSelector.js";
import SubjectSelector from "../Components/Churn/Selectors/SubjectSelector.js";
import LevelSelector from "../Components/Churn/Selectors/LevelSelector.js";
import PaperSelector from "../Components/Churn/Selectors/PaperSelector.js";
import AssessmentSelector from "../Components/Churn/Selectors/AssessmentSelector.js";

import {useState, useRef} from 'react';

function HomePage(props) {    
    const [TopicsDisplay, setTopicsDisplay] = useState('none')
    const [LevelsDisplay, setLevelsDisplay] = useState('none')
    const [PapersDisplay, setPapersDisplay] = useState('none')
    const [AssessmentsDisplay, setAssessmentsDisplay] = useState('none')

    const [SubjectSelection, setSubjectSelection] = useState(0)
    const [TopicsSelection, setTopicsSelection] = useState([])
    const [LevelsSelection, setLevelsSelection] = useState([])
    const [PapersSelection, setPapersSelection] = useState([])
    const [AssessmentsSelection, setAssessmentsSelection] = useState([])

    const isChurnedRef = useRef(false) //initially questions are not churned

    const [Update, setUpdate] = useState(true) //state to help re-render components
    function ForceUpdate() {
        setUpdate(!Update) //re-renders the components as the Update state has changed
    }

    function Churn() {
        if (
            SubjectSelection !== 0 &&
            TopicsSelection.length !== 0 &&
            LevelsSelection.length !== 0 &&
            PapersSelection.length !== 0 &&
            AssessmentsSelection.length !== 0
        ) {
            isChurnedRef.current = true
            ForceUpdate()
        } else {
            console.log('Please Select All Categories')
        }
    }

    return(
        <div>
            <SubjectSelector onSubjectSelected={(Subject) => setSubjectSelection(Subject)} />

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
                <TopicSelector SubjectSelection={SubjectSelection} TopicChanged={(Topics) => setTopicsSelection(Topics)} />
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
                <LevelSelector SubjectSelection={SubjectSelection} LevelChanged={(Levels) => setLevelsSelection(Levels)} />
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
                <PaperSelector SubjectSelection={SubjectSelection} PaperChanged={(Papers) => setPapersSelection(Papers)} />
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
                <AssessmentSelector LevelsSelection={LevelsSelection} AssessmentChanged={(Assessments) => setAssessmentsSelection(Assessments)} />
            </span>

            <button onClick={Churn}>Churn</button> {/* Button to Churn Questions */}

            {isChurnedRef.current ?
                <ChurnedQuestions
                    TopicsSelection={TopicsSelection}
                    LevelsSelection={LevelsSelection}
                    PapersSelection={PapersSelection}
                    AssessmentsSelection={AssessmentsSelection}
                    Update={Update}
                    OpenQuestion={(QuestionID, Churned) => props.OpenQuestion(QuestionID, Churned)}
                />
            :
                null
            }
        </div>
    )
}

export default HomePage;