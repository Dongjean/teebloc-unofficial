import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Assessment from '../Assessment.js';

function AssessmentSelector(props) {
    const [Assessments, setAssessments] = useState([])
    const [AssessmentsSelection, setAssessmentsSelection] = useState([])

    //calls everytime new Levels are selected
    useEffect(() => {
        getAssessments(props.LevelsSelection)
    }, [props.LevelsSelection])

    async function getAssessments(Levels) { //get Assessments to display
        try {
            Levels = JSON.stringify(Levels.map(Level => Level.levelid))
            const result = await API.get('/Categories/Assessments/GetFromLevels/' + Levels)
            setAssessments(result.data)
            setAssessmentsSelection(result.data)
            props.AssessmentChanged(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    function AssessmentSelected(Assessment) {
        var temp = [...AssessmentsSelection]
        temp.push(Assessment)
        setAssessmentsSelection(temp)
        props.AssessmentChanged(temp)
    }

    function AssessmentDeselected(Assessment) {
        const temp = AssessmentsSelection.filter(assessment => assessment.assessmentid !== Assessment.assessmentid)
        setAssessmentsSelection(temp)
        props.AssessmentChanged(temp)
    }

    return (
        <div>
            {Assessments.map(assessment =>
                <Assessment key={assessment.assessmentid} Assessment={assessment} AssessmentSelected={AssessmentSelected} AssessmentDeselected={AssessmentDeselected} />
            )}          
        </div>
    )
}

export default AssessmentSelector;