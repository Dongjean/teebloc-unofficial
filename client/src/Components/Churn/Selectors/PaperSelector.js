import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Paper from '../Categories/Paper.js';

function PaperSelector(props) {
    const [Papers, setPapers] = useState([])
    const [PapersSelection, setPapersSelection] = useState(props.PapersSelection)

    //isAllSelected and isAllDeselected do not store whether or not all the papers are selected/deselected
    //instead, it stores whether the Select All or Deselect All buttons have been clicked
    const [isAllSelected, setisAllSelected] = useState(false)
    const [isAllDeselected, setisAllDeselected] = useState(false)

    //calls everytime a new subject is selected
    useEffect(() => {
        getPapers(props.SubjectSelection)
    }, [props.SubjectSelection])

    async function getPapers(Subject) { //get Papers to display
        try {
            const result = await API.get('/Categories/Get/Papers/fromSubjectID/' + Subject)
            setPapers(result.data)

            const PaperIDs = result.data.map(paper => parseInt(paper.paperid))
            for (var i=0; i<PapersSelection.length; i++) {
                if (!PaperIDs.includes(PapersSelection[i])) {
                    setPapersSelection(current => current.filter(paperid => paperid !== PapersSelection[i]))
                    props.PaperChanged(PapersSelection[i], false)
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    function PaperSelected(PaperID) {
        setPapersSelection(current => {
            if (current.includes(parseInt(PaperID))) {
                return current
            } else {
                current.push(parseInt(PaperID))
                return current
            }
        })

        props.PaperChanged(PaperID, true)
    }

    function PaperDeselected(PaperID) {
        setPapersSelection(current => current.filter(paperid => paperid !== parseInt(PaperID)))
        props.PaperChanged(PaperID, false)
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
            {Papers.map(paper =>
                <Paper key={paper.paperid} Paper={paper} PaperSelected={PaperSelected} PaperDeselected={PaperDeselected} isPaperSelected={PapersSelection.includes(parseInt(paper.paperid))} isAllSelected={isAllSelected} isAllDeselected={isAllDeselected} setAllSelectors={bool => {setisAllSelected(bool); setisAllDeselected(bool)}} />
            )}

            {/* Button to select all */}
            <button onClick={Select_All}>Select All Papers</button>

            {/* Button to deselect all */}
            <button onClick={Deselect_All}>Deselect All Papers</button>
        </div>
    )
}

export default PaperSelector;