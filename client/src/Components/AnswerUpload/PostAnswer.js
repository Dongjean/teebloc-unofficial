import {useState} from 'react';

//component imports
import AnswerIMGUploader from './AnswerIMGUploader.js';
import UploadModal from '../Upload/UploadModal.js';

function PostAnswer(props) {
    const [ANSImages, setANSImages] = useState([])

    const [isUploadModalOpen, setisUploadModalOpen] = useState(false)

    function AddImage(file) {
        console.log(file)
        var temp = [...ANSImages]
        temp.push({File: file, OriginalIMGData: URL.createObjectURL(file)})
        setANSImages(temp)
        props.onAnswerIMGChange(temp)
    }

    function onAnswerIMGChange(ANSImage, index) {
        var temp = [...ANSImages]
        temp[index] = ANSImage
        setANSImages(temp)
        props.onAnswerIMGChange(temp)
    }

    function OpenUploadModal() {
        setisUploadModalOpen(true)
    }

    function CloseUploadModal() {
        setisUploadModalOpen(false)
    }

    return (
        <div>
            {ANSImages.length == 0 ?
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
                {ANSImages.map((ANSImage, index) =>
                    <AnswerIMGUploader key={index} index={index} ANSImage={ANSImage} onAnswerIMGChange={onAnswerIMGChange} />
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

export default PostAnswer;