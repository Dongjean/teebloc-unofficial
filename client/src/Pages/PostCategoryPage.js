import {useState, useRef} from 'react';
import API from '../utils/API';

//component imports
import SubjectPoster from '../Components/CategoryUpload/SubjectPoster.js';

function PostCategoryPage() {
    const [UploadCategory, setUploadCategory] = useState('Subject')
    
    const NewCategoryRef = useRef()

    function OnCategorySelected(event) {
        const SelectedCategory = event.target.value
        setUploadCategory(SelectedCategory)
    }

    async function SubmitSubject(event, Levels, Papers, Schools, NewSubject) {
        event.preventDefault()
        if (NewSubject.length == 0) {
            console.log('Please Enter the field for new Subject')
            return
        }
        
        try{
            API.post('/Categories/New/Subject', {Levels: Levels, Papers: Papers, Schools: Schools, NewSubject: NewSubject})
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <form >
                <select defaultValue='Subject' onChange={OnCategorySelected}>
                    <option value='Subject'>Subject</option>
                    <option value='Topic'>Topic</option>
                    <option value='Level'>Level</option>
                    <option value='Assessment'>Assessment</option>
                    <option value='School'>School</option>
                </select>

                {UploadCategory == 'Subject' ?
                    <SubjectPoster SubmitSubject={SubmitSubject}/>
                :
                    null
                }
            </form>
        </div>
    )
}

export default PostCategoryPage;