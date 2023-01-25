//css imports
import '../../CSS/UploadModal.css';

import {useEffect} from 'react';
function UploadModal(props) {
    useEffect(() => {
        window.addEventListener('paste', PasteListener)
    })

    function PasteListener(event) {
        if (event.clipboardData.files.length > 0) {
            props.OnUploadImage(event.clipboardData.files[0])
            CloseUploadModal()
        }
    }

    function CloseUploadModal() {
        props.CloseUploadModal()
        window.removeEventListener('paste', PasteListener)
    }

    return (
        <div className="ModalBackground" onClick={CloseUploadModal}>
            <div className="ModalContainer" onClick={event => event.stopPropagation()}>
                Paste to upload a file or <input type='file' onChange={(event) => {props.OnUploadImage(event.target.files[0]); CloseUploadModal();}} />
            </div>
        </div>
    )
}

export default UploadModal;