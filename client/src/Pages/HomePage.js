//Components imports
import CategoriesSelector from "../Components/CategoriesSelector.js";
import ChurnedQuestions from "../Components/ChurnedQuestions.js";

import {useState} from 'react';

function HomePage() {
    const [Selected, setSelected] = useState([])
    const [state, set] = useState();

    function onCatSelected(Cat) {
        //push Cat into Selected and set the state to that
        var temp = Selected
        temp.push(Cat)
        setSelected([...temp])
    }

    function onCatDeselected(Cat) {
        //filter out Cat from Selected and set the state to that
        setSelected(Selected.filter(Category => Category.categoryid !== Cat.categoryid))
    }
    
    return(
        <div>
            {Selected.map(Cat => <div key={Cat.categoryid}>{Cat.category}</div>)}
            <CategoriesSelector onCatSelected={onCatSelected} onCatDeselected={onCatDeselected} /> <br />
            <ChurnedQuestions Selected={Selected} />
        </div>
    )
}

export default HomePage;