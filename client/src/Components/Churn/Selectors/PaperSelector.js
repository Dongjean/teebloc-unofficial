import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Paper from '../Categories/Paper.js';

function PaperSelector(props) {
    const [Papers, setPapers] = useState([])
    const [PapersSelection, setPapersSelection] = useState([])

    //calls everytime a new subject is selected
    useEffect(() => {
        getPapers(props.SubjectSelection)
    }, [props.SubjectSelection])

    async function getPapers(Subject) { //get Papers to display
        try {
            const result = await API.get('/Categories/Papers/Get/' + Subject)
            setPapers(result.data)

            const PaperIDs = result.data.map(Paper => Paper.paperid)
            setPapersSelection(PaperIDs)
            props.PaperChanged(PaperIDs)
        } catch(err) {
            console.log(err)
        }
    }

    function PaperSelected(PaperID) {
        var temp = [...PapersSelection]
        temp.push(PaperID)
        setPapersSelection(temp)
        props.PaperChanged(temp)
    }

    function PaperDeselected(PaperID) {
        const temp = PapersSelection.filter(paperid => paperid !== PaperID)
        setPapersSelection(temp)
        props.PaperChanged(temp)
    }

    return (
        <div>
            {Papers.map(paper =>
                <Paper key={paper.paperid} Paper={paper} PaperSelected={PaperSelected} PaperDeselected={PaperDeselected} />
            )}
        </div>
    )
}

export default PaperSelector;