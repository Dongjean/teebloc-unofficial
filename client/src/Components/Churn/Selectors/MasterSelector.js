//Components imports
import TopicSelector from "./TopicSelector.js";
import SubjectSelector from "./SubjectSelector.js";
import LevelSelector from "./LevelSelector.js";
import PaperSelector from "./PaperSelector.js";
import AssessmentSelector from "./AssessmentSelector.js";
import SchoolSelector from "./SchoolSelector.js";

import {useMemo, useState, useRef} from 'react';
import {useLocation} from "react-router-dom";

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

function MasterSelector(props) {
    const query = useQuery()

    const [TopicsDisplay, setTopicsDisplay] = useState('none')
    const [LevelsDisplay, setLevelsDisplay] = useState('none')
    const [PapersDisplay, setPapersDisplay] = useState('none')
    const [AssessmentsDisplay, setAssessmentsDisplay] = useState('none')
    const [SchoolsDiplay, setSchoolsDiplay] = useState('none')

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

    var Schools = [];
    const SchoolsQuery = query.get('Schools')
    if (SchoolsQuery) {
        Schools = JSON.parse(SchoolsQuery)
    }
    const [SchoolsSelection, setSchoolsSelection] = useState(Schools)

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
    
    var Pageno = null;
    const PageQuery = query.get('Page')
    if (isChurnedRef.current && PageQuery) { //Page number can only exist when there are questions churned to have pages for
        Pageno = PageQuery
    }
    const PageRef = useRef(Pageno)

    function Churn() {
        if (
            SubjectSelection !== 0 &&
            TopicsSelection.length !== 0 &&
            LevelsSelection.length !== 0 &&
            PapersSelection.length !== 0 &&
            AssessmentsSelection.length !== 0 &&
            SchoolsSelection.length !== 0
        ) {
            isChurnedRef.current = true
            PageRef.current = 1
            props.setSelection({
                isFiltered: true,
                Subject: SubjectSelection,
                Topics: TopicsSelection,
                Levels: LevelsSelection,
                Papers: PapersSelection,
                Assessments: AssessmentsSelection,
                Schools: SchoolsSelection,
                QNsperPage: QNsperPageRef.current,
                isChurned: isChurnedRef.current,
                initialPage: PageRef.current
            })
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

            {/* For Displaying Schools */}
            {SchoolsDiplay == 'none' ?
                <div>
                    <a onClick={() => setSchoolsDiplay('inline')}>▼ Schools</a>
                    <br />
                </div>
            :
                <a onClick={() => setSchoolsDiplay('none')}>▲ Schools</a>
            }
            <span style={{display: SchoolsDiplay}}>
                <SchoolSelector SubjectSelection={SubjectSelection} SchoolChanged={(Schools) => setSchoolsSelection(Schools)} SchoolsSelection={SchoolsSelection} />
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
        </div>
    )
}

export default MasterSelector;