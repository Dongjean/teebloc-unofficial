import {useState} from 'react';

//component imports
import QuestionIMGUploader from './QuestionIMGUploader.js';

function PostQuestion(props) {
    const [QNImages, setQNImages] = useState([])

    function AddImage(event) {
        var temp = [...QNImages]
        temp.push({File: event.target.files[0], OriginalIMGData: URL.createObjectURL(event.target.files[0])})
        event.target.value = null //set the value of the file upload input field to none so duplicate files can be uplaoded        setQNImages(temp)
        setQNImages(temp)
        props.onQuestionIMGChange(temp)
    }

    function onQuestionIMGChange(QNImage, index) {
        var temp = [...QNImages]
        temp[index] = QNImage
        setQNImages(temp)
        props.onQuestionIMGChange(temp)
    }

    return (
        <div>
            {QNImages.length == 0 ?
                //first file upload is required
                <input type='file' onChange={AddImage} />
            :
            <div>
                {QNImages.map((QNImage, index) =>
                    <QuestionIMGUploader key={index} index={index} QNImage={QNImage} onQuestionIMGChange={onQuestionIMGChange} />
                )}
                <input type='file' onChange={AddImage} /><br />
            </div>
            }
        </div>
    )
}

export default PostQuestion;