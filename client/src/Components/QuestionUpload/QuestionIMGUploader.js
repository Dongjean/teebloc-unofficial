import {useState, useRef} from 'react';
import Cropper from 'react-cropper';
import '../../CSS/Cropperjs/Cropper.css';

function QuestionIMGUploader(props) {
    const [isCropping, setisCropping] = useState(true) //initially image is in crop mode
    const [QNImage, setQNImage] = useState(props.QNImage)
    const cropperRef = useRef(null)

    function ChangeImage(event, index) {
        const temp = {File: event.target.files[0], OriginalIMGData: URL.createObjectURL(event.target.files[0])}
        setisCropping(true)
        setQNImage(temp)
        event.target.value = null //set the value of the file upload input field to none so duplicate files can be uplaoded
        props.onQuestionIMGChange(temp, index)
    }

    function EndCrop() {
        const imageElement = cropperRef.current;
        const cropper = imageElement.cropper;
        const CroppedIMGData = cropper.getCroppedCanvas().toDataURL();
        
        var temp = QNImage
        temp.CroppedIMGData = CroppedIMGData
        setisCropping(false)
        setQNImage(temp)
    }

    function StartCrop() {
        setisCropping(true)
    }

    return (
        <div>
            {QNImage.File.name}<br />
            {isCropping ?
                <div>
                    <Cropper
                        src={QNImage.OriginalIMGData} 
                        style={{ height: 400, width: "100%" }}
                        // Cropper.js options
                        initialAspectRatio={210/297} //image aspect ratio to decide later
                        dragMode='move'
                        cropBoxMovable={false}
                        guides={false}
                        ref={cropperRef}
                        background={false}
                        responsive={false}
                    />
                    <button type='button' onClick={EndCrop}>Crop</button>
                </div>
                :
                <div>
                    <img src={QNImage.CroppedIMGData} style={{width: 500}} />
                    <button type='button' onClick={StartCrop}>Re-Crop</button>
                </div>
            }

            <input type='file' onChange={(event) => {ChangeImage(event, props.index)}} /><br /><br />
        </div>
    )
}

export default QuestionIMGUploader;