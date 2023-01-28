import {useState} from "react";

//component imports
import SubjectEditor from "../Components/CategoryEdit/SubjectEditor";
import LevelEditor from "../Components/CategoryEdit/LevelEditor";
import PaperEditor from "../Components/CategoryEdit/PaperEditor";
import AssessmentEditor from "../Components/CategoryEdit/AssessmentEditor";
import SchoolEditor from "../Components/CategoryEdit/SchoolEditor";
import TopicEditor from "../Components/CategoryEdit/TopicEditor";

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

            {/* Topic Editor */}
            {EditCategory == 'Topic' ?
                <TopicEditor />
            :
                null
            }

            {/* Level Editor */}
            {EditCategory == 'Level' ?
                <LevelEditor />
            :
                null
            }

            {/* Paper Editor */}
            {EditCategory == 'Paper' ?
                <PaperEditor />
            :
                null
            }

            {/* Assessment Editor */}
            {EditCategory == 'Assessment' ?
                <AssessmentEditor />
            :
                null
            }

            {/* School Editor */}
            {EditCategory == 'School' ?
                <SchoolEditor />
            :
                null
            }

        </div>
    )
}

export default EditCategoryPage