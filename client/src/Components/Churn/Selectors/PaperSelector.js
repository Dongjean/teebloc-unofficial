import API from '../../../utils/API.js';

import {useState, useEffect} from 'react';

//component imports
import Paper from '../Paper.js';

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
            setPapersSelection(result.data)
            props.PaperChanged(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    function PaperSelected(Paper) {
        var temp = [...PapersSelection]
        temp.push(Paper)
        setPapersSelection(temp)
        props.PaperChanged(temp)
    }

    function PaperDeselected(Paper) {
        const temp = PapersSelection.filter(paper => paper.paperid !== Paper.paperid)
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