import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import School from '../Categories/School.js';

function SchoolSelector(props) {
    const [Schools, setSchools] = useState([])
    const [SchoolsSelection, setSchoolsSelection] = useState(props.SchoolsSelection)

    //calls everytime a new subject is selected
    useEffect(() => {
        getSchools(props.SubjectSelection)
    }, [props.SubjectSelection])

    async function getSchools(Subject) { //get Levels to display
        try {
            const result = await API.get('/Categories/Get/Schools/fromSubjectID/' + Subject)
            setSchools(result.data)

            var temp = SchoolsSelection;
            const SchoolIDs = result.data.map(school => school.schoolid)
            for (var i=0; i<SchoolsSelection.length; i++) {
                if (!SchoolIDs.includes(SchoolsSelection[i])) {
                    temp = temp.filter(SchoolID => SchoolID !== SchoolsSelection[i])
                }
            }
            setSchoolsSelection(temp)
            props.SchoolChanged(temp)
        } catch(err) {
            console.log(err)
        }
    }

    function SchoolSelected(SchoolID) {
        var temp = [...SchoolsSelection]
        temp.push(SchoolID)
        setSchoolsSelection(temp)
        props.SchoolChanged(temp)
    }

    function SchoolDeselected(SchoolID) {
        const temp = SchoolsSelection.filter(schoolid => schoolid !== SchoolID)
        setSchoolsSelection(temp)
        props.SchoolChanged(temp)
    }

    return (
        <div>
            {Schools.map(school =>
                <School key={school.schoolid} School={school} SchoolSelected={SchoolSelected} SchoolDeselected={SchoolDeselected} isSchoolSelected={SchoolsSelection.includes(school.schoolid)} />
            )}
        </div>
    )
}

export default SchoolSelector;