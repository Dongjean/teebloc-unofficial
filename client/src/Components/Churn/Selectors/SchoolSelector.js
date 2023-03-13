import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import School from '../Categories/School.js';

function SchoolSelector(props) {
    const [Schools, setSchools] = useState([])
    const [SchoolsSelection, setSchoolsSelection] = useState(props.SchoolsSelection)

    //isAllSelected and isAllDeselected do not store whether or not all the schools are selected/deselected
    //instead, it stores whether the Select All or Deselect All buttons have been clicked
    const [isAllSelected, setisAllSelected] = useState(false)
    const [isAllDeselected, setisAllDeselected] = useState(false)

    //calls everytime a new subject is selected
    useEffect(() => {
        getSchools(props.SubjectSelection)
    }, [props.SubjectSelection])

    async function getSchools(Subject) { //get Levels to display
        try {
            const result = await API.get('/Categories/Get/Schools/fromSubjectID/' + Subject)
            setSchools(result.data)

            const SchoolIDs = result.data.map(school => parseInt(school.schoolid))
            for (var i=0; i<SchoolsSelection.length; i++) {
                if (!SchoolIDs.includes(SchoolsSelection[i])) {
                    setSchoolsSelection(current => current.filter(schoolid => schoolid !== SchoolsSelection[i]))
                    props.SchoolChanged(SchoolsSelection[i], false)
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    function SchoolSelected(SchoolID) {
        setSchoolsSelection(current => {
            if (current.includes(parseInt(SchoolID))) {
                return current
            } else {
                current.push(parseInt(SchoolID))
                return current
            }
        })

        props.SchoolChanged(SchoolID, true)
    }

    function SchoolDeselected(SchoolID) {
        setSchoolsSelection(current => current.filter(schoolid => schoolid !== parseInt(SchoolID)))
        props.SchoolChanged(SchoolID, false)
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
            {Schools.map(school =>
                <School key={school.schoolid} School={school} SchoolSelected={SchoolSelected} SchoolDeselected={SchoolDeselected} isSchoolSelected={SchoolsSelection.includes(parseInt(school.schoolid))} isAllSelected={isAllSelected} isAllDeselected={isAllDeselected} setAllSelectors={bool => {setisAllSelected(bool); setisAllDeselected(bool)}} />
            )}

            {/* Button to select all */}
            <button onClick={Select_All}>Select All Schools</button>

            {/* Button to deselect all */}
            <button onClick={Deselect_All}>Deselect All Schools</button>
        </div>
    )
}

export default SchoolSelector;