import {useState, useRef} from 'react';
import API from '../utils/API';

//component imports
import SubjectPoster from '../Components/CategoryUpload/SubjectPoster.js';
import TopicPoster from '../Components/CategoryUpload/TopicPoster';
import LevelPoster from '../Components/CategoryUpload/LevelPoster';
import AssessmentPoster from '../Components/CategoryUpload/AssessmentPoster';

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
        
        try {
            await API.post('/Categories/New/Subject', {Levels: Levels, Papers: Papers, Schools: Schools, NewSubject: NewSubject})
        } catch(err) {
            console.log(err)
        }
    }

    async function SubmitTopic(event, Subject, NewTopic) {
        event.preventDefault()
        console.log(Subject.length)
        if (NewTopic.length == 0) {
            if (Subject.length == 0) {
                console.log('Please Enter the field for new Topic and its Subject')
                return
            } else {
                console.log('Please Enter the field for new Topic')
                return
            }
        }

        try {
            await API.post('/Categories/New/Topic', {Subject: Subject, NewTopic:NewTopic})
        } catch(err) {
            console.log(err)
        }
    }

    async function SubmitLevel(event, Subjects, Assessments, NewLevel) {
        event.preventDefault()

        if (NewLevel.length == 0) {
            console.log('Please Enter the field for new Level')
            return
        }

        try {
            await API.post('/Categories/New/Level', {Subjects: Subjects, Assessments: Assessments, NewLevel: NewLevel})
        } catch(err) {
            console.log(err)
        }
    }

    async function SubmitAssessment(event, Levels, NewAssessment) {
        event.preventDefault()

        if (NewAssessment.length == 0) {
            console.log('Please Enter the field for new Assessment')
            return
        }

        try {
            await API.post('/Categories/New/Assessment', {Levels: Levels, NewAssessment: NewAssessment})
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

                {UploadCategory == 'Topic' ?
                    <TopicPoster SubmitTopic={SubmitTopic} />
                :
                    null
                }

                {UploadCategory == 'Level' ?
                    <LevelPoster SubmitLevel={SubmitLevel} />
                :
                    null
                }

                {UploadCategory == 'Assessment' ?
                    <AssessmentPoster SubmitAssessment={SubmitAssessment} />
                :
                    null
                }

            </form>
        </div>
    )
}

export default PostCategoryPage;