//Components imports
// import ChurnedQuestions from "../Components/ChurnedQuestions.js";
import TopicSelector from "../Components/Churn/Selectors/TopicSelector.js";
import SubjectSelector from "../Components/Churn/Selectors/SubjectSelector.js";
import LevelSelector from "../Components/Churn/Selectors/LevelSelector.js";
import PaperSelector from "../Components/Churn/Selectors/PaperSelector.js";
import AssessmentSelector from "../Components/Churn/Selectors/AssessmentSelector.js";

import {useState} from 'react';

function HomePage() {
    const [TopicsDisplay, setTopicsDisplay] = useState('none')
    const [LevelsDisplay, setLevelsDisplay] = useState('none')
    const [PapersDisplay, setPapersDisplay] = useState('none')
    const [AssessmentsDisplay, setAssessmentsDisplay] = useState('none')

    const [SubjectSelection, setSubjectSelection] = useState(0)
    const [TopicsSelection, setTopicsSelection] = useState([])
    const [LevelsSelection, setLevelsSelection] = useState([])
    const [PapersSelection, setPapersSelection] = useState([])
    const [AssessmentsSelection, setAssessmentsSelection] = useState([])
    
    console.log(SubjectSelection)
    console.log(TopicsSelection)
    console.log(LevelsSelection)
    console.log(PapersSelection)
    console.log(AssessmentsSelection)

    function onSubjectSelected(Subject) {
        setSubjectSelection(Subject)
    }

    return(
        <div>
            <SubjectSelector onSubjectSelected={onSubjectSelected} />

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
            
            {/* <ChurnedQuestions Selected={Selected} /> */}
        </div>
    )
}

export default HomePage;