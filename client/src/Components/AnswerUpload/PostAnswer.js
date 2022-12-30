import {useState} from 'react';

//component imports
import AnswerIMGUploader from './AnswerIMGUploader.js';

function PostAnswer(props) {
    const [ANSImages, setANSImages] = useState([])

    function AddImage(event) {
        var temp = [...ANSImages]
        temp.push({File: event.target.files[0], OriginalIMGData: URL.createObjectURL(event.target.files[0])})
        event.target.value = null //set the value of the file upload input field to none so duplicate files can be uplaoded        setQNImages(temp)
        setANSImages(temp)
        props.onAnswerIMGChange(temp)
    }

    function onAnswerIMGChange(ANSImage, index) {
        var temp = [...ANSImages]
        temp[index] = ANSImage
        setANSImages(temp)
        props.onAnswerIMGChange(temp)
    }

    return (
        <div>
            {ANSImages.length == 0 ?
                //first file upload is required
                <input type='file' onChange={AddImage} />
            :
            <div>
                {ANSImages.map((ANSImage, index) =>
                    <AnswerIMGUploader key={index} index={index} ANSImage={ANSImage} onAnswerIMGChange={onAnswerIMGChange} />
                )}
                <input type='file' onChange={AddImage} /><br />
            </div>
            }
        </div>
    )
}

export default PostAnswer;