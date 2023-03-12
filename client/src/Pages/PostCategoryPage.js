import {useState, useRef} from 'react';
import API from '../utils/API';

//component imports
import SubjectPoster from '../Components/CategoryUpload/SubjectPoster.js';
import TopicPoster from '../Components/CategoryUpload/TopicPoster';
import LevelPoster from '../Components/CategoryUpload/LevelPoster';
import AssessmentPoster from '../Components/CategoryUpload/AssessmentPoster';
import SchoolPoster from '../Components/CategoryUpload/SchoolPoster';
import PaperPoster from '../Components/CategoryUpload/PaperPoster';

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
            //Reload Page
            window.location.reload(false);
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
            //Reload Page
            window.location.reload(false);
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
            //Reload Page
            window.location.reload(false);
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
            //Reload Page
            window.location.reload(false);
        } catch(err) {
            console.log(err)
        }
    }

    async function SubmitSchool(event, Subjects, NewSchool) {
        event.preventDefault()

        if (NewSchool.length == 0) {
            console.log('Please Enter the field for new School')
            return
        }

        try {
            await API.post('/Categories/New/School', {Subjects: Subjects, NewSchool: NewSchool})
            //Reload Page
            window.location.reload(false);
        } catch(err) {
            console.log(err)
        }
    }

    async function SubmitPaper(event, Subjects, NewPaper) {
        event.preventDefault()

        if (NewPaper.length == 0) {
            console.log('Please Enter the field for new Paper')
            return
        }

        try {
            await API.post('/Categories/New/Paper', {Subjects: Subjects, NewPaper: NewPaper})
            //Reload Page
            window.location.reload(false);
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
                    <option value='Paper'>Paper</option>
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

                {UploadCategory == 'Paper' ?
                    <PaperPoster SubmitPaper={SubmitPaper} />
                :
                    null
                }

                {UploadCategory == 'Assessment' ?
                    <AssessmentPoster SubmitAssessment={SubmitAssessment} />
                :
                    null
                }

                {UploadCategory == 'School' ?
                    <SchoolPoster SubmitSchool={SubmitSchool} />
                :
                    null
                }

            </form>
        </div>
    )
}

export default PostCategoryPage;