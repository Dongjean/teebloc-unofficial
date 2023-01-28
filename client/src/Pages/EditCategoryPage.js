import {useState} from "react";

//component imports
import SubjectEditor from "../Components/CategoryEdit/SubjectEditor";

function EditCategoryPage() {
    const [EditCategory, setEditCategory] = useState('Subject') //Initially edit subjects

    return (
        <div>
            Which Category would you like to edit?
            <select onChange={event => setEditCategory(event.target.value)}>
                <option>Subject</option>
                <option>Topic</option>
                <option>Level</option>
                <option>Paper</option>
                <option>Assessment</option>
                <option>School</option>
            </select>

            {/* Subject Editor */}
            {EditCategory == 'Subject' ?
                <SubjectEditor />
            :
                null
            }

        </div>
    )
}

export default EditCategoryPage