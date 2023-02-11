import {useState} from 'react';

//component imports
import QuestionIMGUploader from './QuestionIMGUploader.js';
import UploadModal from '../Upload/UploadModal.js';

function PostQuestion(props) {
    const [QNImages, setQNImages] = useState([])
    const [isUploadModalOpen, setisUploadModalOpen] = useState(false)

    function AddImage(file) {
        console.log(file)
        var temp = [...QNImages]
        temp.push({File: file, OriginalIMGData: URL.createObjectURL(file)})
        setQNImages(temp)
        props.onQuestionIMGChange(temp)
    }

    function onQuestionIMGChange(QNImage, index) {
        var temp = [...QNImages]
        temp[index] = QNImage
        setQNImages(temp)
        props.onQuestionIMGChange(temp)
    }

    function OpenUploadModal() {
        setisUploadModalOpen(true)
    }

    function CloseUploadModal() {
        setisUploadModalOpen(false)
    }

    function DeleteImage(index) {
        console.log(QNImages, index)
        console.log(QNImages[index])

        const temp = [...QNImages]
        temp.splice(index, 1)

        setQNImages(temp)
    }

    function MoveImageUp(index) {
        if (index !== 0) {
            const temp = [...QNImages]
            temp[index - 1] = temp[index]
            temp[index] = QNImages[index - 1]

            setQNImages(temp)
        }
    }

    function MoveImageDown(index) {
        const SwapTarget = QNImages[index + 1]
        if (SwapTarget) {
            const temp = [...QNImages]
            temp[index + 1] = temp[index]
            temp[index] = SwapTarget
            console.log(temp)
            setQNImages(temp)
            console.log(QNImages)
        }
    }

    return (
        <div>
            {QNImages.length == 0 ?
                //first file upload is required
                <div>
                    <button type='button' onClick={OpenUploadModal}>Upload A File</button>
                    {isUploadModalOpen ?
                        <UploadModal CloseUploadModal={CloseUploadModal} OnUploadImage={file => AddImage(file)} />
                    :
                        null
                    }
                </div>
            :
            <div>
                {QNImages.map((QNImage, index) =>
                    <QuestionIMGUploader key={index} index={index} QNImage={QNImage} onQuestionIMGChange={onQuestionIMGChange} CloseUploadModal={CloseUploadModal} DeleteImage={DeleteImage} MoveImageUp={MoveImageUp} MoveImageDown={MoveImageDown} />
                )}

                <button type='button' onClick={OpenUploadModal}>Upload a New File</button>
                {isUploadModalOpen ?
                    <UploadModal CloseUploadModal={CloseUploadModal} OnUploadImage={file => AddImage(file)} />
                :
                    null
                }
                <br />
            </div>
            }
        </div>
    )
}

export default PostQuestion;