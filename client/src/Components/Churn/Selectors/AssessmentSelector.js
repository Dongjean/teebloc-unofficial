import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Assessment from '../Categories/Assessment.js';

function AssessmentSelector(props) {
    const [Assessments, setAssessments] = useState([])
    const [AssessmentsSelection, setAssessmentsSelection] = useState(props.AssessmentsSelection)

    //isAllSelected and isAllDeselected do not store whether or not all the assessments are selected/deselected
    //instead, it stores whether the Select All or Deselect All buttons have been clicked
    const [isAllSelected, setisAllSelected] = useState(false)
    const [isAllDeselected, setisAllDeselected] = useState(false)


    //calls everytime new Levels are selected
    useEffect(() => {
        getAssessments(props.LevelsSelection)
    }, [props.LevelsSelection])

    async function getAssessments(LevelIDs) { //get Assessments to display
        try {
            LevelIDs = JSON.stringify(LevelIDs)
            const result = await API.get('/Categories/Get/Assessments/fromLevels/' + LevelIDs)
            setAssessments(result.data)
            
            const AssessmentIDs = result.data.map(Assessment => parseInt(Assessment.assessmentid))
            for (var i=0; i<AssessmentsSelection.length; i++) {
                if (!AssessmentIDs.includes(AssessmentsSelection[i])) {
                    setAssessmentsSelection(current => current.filter(assessmentid => assessmentid !== AssessmentsSelection[i]))
                    props.AssessmentChanged(AssessmentsSelection[i], false)
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    function AssessmentSelected(AssessmentID) {
        setAssessmentsSelection(current => {
            if (current.includes(parseInt(AssessmentID))) {
                return current
            } else {
                current.push(parseInt(AssessmentID))
                return current
            }
        })

        props.AssessmentChanged(AssessmentID, true)
    }

    function AssessmentDeselected(AssessmentID) {
        setAssessmentsSelection(current => current.filter(assessmentid => assessmentid !== parseInt(AssessmentID)))
        props.AssessmentChanged(AssessmentID, false)
    }

    function Select_All() {
        setisAllSelected(true)

        setisAllDeselected(false)
    }

    function Deselect_All() {
        setisAllDeselected(true)

        setisAllSelected(false)
    }

    return (
        <div>
            {Assessments.map(assessment =>
                <Assessment key={assessment.assessmentid} Assessment={assessment} AssessmentSelected={AssessmentSelected} AssessmentDeselected={AssessmentDeselected} isAssessmentSelected={AssessmentsSelection.includes(parseInt(assessment.assessmentid))} isAllSelected={isAllSelected} isAllDeselected={isAllDeselected} setAllSelectors={bool => {setisAllSelected(bool); setisAllDeselected(bool)}} />
            )}

            {/* Button to select all */}
            <button onClick={Select_All}>Select All Assessments</button>

            {/* Button to deselect all */}
            <button onClick={Deselect_All}>Deselect All Assessments</button>
        </div>
    )
}

export default AssessmentSelector;