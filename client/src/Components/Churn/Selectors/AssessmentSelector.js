import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Assessment from '../Categories/Assessment.js';

function AssessmentSelector(props) {
    const [Assessments, setAssessments] = useState([])
    const [AssessmentsSelection, setAssessmentsSelection] = useState(props.AssessmentsSelection)

    //calls everytime new Levels are selected
    useEffect(() => {
        getAssessments(props.LevelsSelection)
    }, [props.LevelsSelection])

    async function getAssessments(LevelIDs) { //get Assessments to display
        try {
            LevelIDs = JSON.stringify(LevelIDs)
            const result = await API.get('/Categories/Get/Assessments/fromLevels/' + LevelIDs)
            setAssessments(result.data)
            
            var temp = AssessmentsSelection;
            const AssessmentIDs = result.data.map(Assessment => Assessment.assessmentid)
            for (var i=0; i<AssessmentsSelection.length; i++) {
                if (!AssessmentIDs.includes(AssessmentsSelection[i])) {
                    temp = temp.filter(AssessmentID => AssessmentID !== AssessmentsSelection[i])
                }
            }
            setAssessmentsSelection(temp)
            props.AssessmentChanged(temp)
        } catch(err) {
            console.log(err)
        }
    }

    function AssessmentSelected(AssessmentID) {
        var temp = [...AssessmentsSelection]
        temp.push(AssessmentID)
        setAssessmentsSelection(temp)
        props.AssessmentChanged(temp)
    }

    function AssessmentDeselected(AssessmentID) {
        const temp = AssessmentsSelection.filter(assessmentid => assessmentid !== AssessmentID)
        setAssessmentsSelection(temp)
        props.AssessmentChanged(temp)
    }

    return (
        <div>
            {Assessments.map(assessment =>
                <Assessment key={assessment.assessmentid} Assessment={assessment} AssessmentSelected={AssessmentSelected} AssessmentDeselected={AssessmentDeselected} isAssessmentSelected={AssessmentsSelection.includes(assessment.assessmentid)} />
            )}          
        </div>
    )
}

export default AssessmentSelector;