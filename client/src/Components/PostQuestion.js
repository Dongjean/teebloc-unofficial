import {useState} from 'react';

function PostQuestion(props) {
    const [QNImages, setQNImages] = useState([])
    
    function AddImage(event) {
        var temp = [...QNImages]
        temp.push(event.target.files[0])
        setQNImages(temp)
        props.onQuestionIMGChange(temp)
    }

    function ChangeImage(event, index) {
        var temp = [...QNImages]
        temp[index] = event.target.files[0]
        setQNImages(temp)
        props.onQuestionIMGChange(temp)
    }

    return (
        <div>
            {QNImages.length == 0 ?
                <input type='file' required onChange={AddImage} />
            :
            <div>
                {QNImages.map((QNImage, index) =>
                    <div key={index}>
                        {QNImage.name}<br />
                        <input type='file' onChange={(event) => {ChangeImage(event, index)}}/><br /><br />
                    </div>
                    
                )}
                <input type='file' onChange={AddImage} /><br />
            </div>
            }
        </div>
    )
}

export default PostQuestion;