import {useState, useEffect} from "react";

//Component imports
import PostQuestion from "../Components/PostQuestion.js";

import API from '../utils/API.js';

function PostPage() {
    const [AllCats, setAllCats] = useState([])
    const [Subject, setSubject] = useState('')
    const [QNImages, setQNImages] = useState([])

    //runs only once on mount
    useEffect(() => {
        getAllCats()
    }, [])

    async function getAllCats() { //get all categories initially to display
        try {
            const result = await API.get('/Categories/GetAll')
            setAllCats(result.data)
            setSubject(result.data[0].category)
        } catch(err) {
            console.log(err)
        }
    }

    function onChange(event) {
        setSubject(event.target.value)
    }

    function SubmitPost(event) {
        event.preventDefault();
        console.log("submitted!") //will change this later to API call to submit the post
    }

    function onQuestionIMGChange(QNImages) {
        setQNImages(QNImages)
    }

    return (
        AllCats.length !== 0 ?
        <div>
            <form onSubmit={SubmitPost}>
                Post Subject: 
                <select defaultValue={AllCats[0].category} onChange={onChange}>
                    {AllCats.map(Cat => <option key={Cat.categoryid} value={Cat.category}>{Cat.category}</option>)}
                </select>
                <PostQuestion  onQuestionIMGChange={onQuestionIMGChange} />
                <input type='submit' value='Upload' />
            </form>
        </div>
        : null
    )
}

export default PostPage;