import API from '../utils/API.js';

//Component imports
import Category from './Category.js';

import {useState, useEffect} from 'react';

function CategoriesSelector(props) {
    const [AllCats, setAllCats] = useState([])

    //calls only on mount
    useEffect(() => {
        getAllCats()
    }, [])

    async function getAllCats() { //get all categories initially to display
        try {
            const result = await API.get('/Categories/GetAll')
            setAllCats(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    function onCatSelected(Cat) {
        props.onCatSelected(Cat)
    }

    function onCatDeselected(Cat) {
        props.onCatDeselected(Cat)
    }

    return (
        <div>
            {AllCats.map(Cat => 
            <div key={Cat.categoryid}>
                <Category Cat={Cat} onCatSelected={onCatSelected} onCatDeselected={onCatDeselected} />
            </div>)}
        </div>
    )
}

export default CategoriesSelector;