import {useState} from 'react';

function Category(props) {
    const [isSelected, setSelected] = useState(false)

    function onClick(Cat) {
        if (!isSelected) {
            props.onCatSelected(Cat) //select the category if category was previously unselected
        } else {
            props.onCatDeselected(Cat) //deselect the category if category was previously selected
        }

        setSelected(!isSelected)
    }

    return (
        <div>
            <input type='checkbox' value={isSelected} onClick={() => {onClick(props.Cat)}} />
            {props.Cat.category}
        </div>
    )
}

export default Category;