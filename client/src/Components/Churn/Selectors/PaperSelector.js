import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Paper from '../Categories/Paper.js';

function PaperSelector(props) {
    const [Papers, setPapers] = useState([])
    const [PapersSelection, setPapersSelection] = useState(props.PapersSelection)

    //calls everytime a new subject is selected
    useEffect(() => {
        getPapers(props.SubjectSelection)
    }, [props.SubjectSelection])

    async function getPapers(Subject) { //get Papers to display
        try {
            const result = await API.get('/Categories/Get/Papers/fromSubjectID/' + Subject)
            setPapers(result.data)

            var temp = PapersSelection;
            const PaperIDs = result.data.map(paper => parseInt(paper.paperid))
            for (var i=0; i<PapersSelection.length; i++) {
                if (!PaperIDs.includes(PapersSelection[i])) {
                    temp = temp.filter(PaperID => PaperID !== PapersSelection[i])
                }
            }
            setPapersSelection(temp)
            props.PaperChanged(temp)
        } catch(err) {
            console.log(err)
        }
    }

    function PaperSelected(PaperID) {
        var temp = [...PapersSelection]
        temp.push(parseInt(PaperID))
        setPapersSelection(temp)
        props.PaperChanged(temp)
    }

    function PaperDeselected(PaperID) {
        const temp = PapersSelection.filter(paperid => paperid !== parseInt(PaperID))
        setPapersSelection(temp)
        props.PaperChanged(temp)
    }

    return (
        <div>
            {Papers.map(paper =>
                <Paper key={paper.paperid} Paper={paper} PaperSelected={PaperSelected} PaperDeselected={PaperDeselected} isPaperSelected={PapersSelection.includes(parseInt(paper.paperid))} />
            )}
        </div>
    )
}

export default PaperSelector;