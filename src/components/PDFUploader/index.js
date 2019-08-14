
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { uploadPDFs } from '../../utils/side-effect';
import { SYNC_PDFS, SYNC_NEW_PDFS } from '../../utils/constants';
import './pdf-uploader.css';
import { writeData } from '../../utils/idb';

const PDFUploader = () => {
  const [uploading, setUploading] = useState(false);

  const onChangeHandler = useCallback(acceptedFiles => {
    if (uploading || acceptedFiles.length === 0) {
      return;
    }

    const uploadHandler = async () => {
      try {
        setUploading(true);
        const { uploadedPDFs } = await uploadPDFs(Date.now(), acceptedFiles);
        console.log('[uploadHandler try] uploadedPDFs => ', uploadedPDFs);
        setUploading(false);
      } catch(error) {
        console.log('[uploadHandler catch] error => ', error);
      }
    };

    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then(async sw => {
          const entry = {
            id: Date.now(),
            pdfFiles: acceptedFiles
          };
          setUploading(true);
          await writeData(SYNC_PDFS, entry);
          await sw.sync.register(SYNC_NEW_PDFS);
          setUploading(false);
        });
    // FYI: fallback if not supported
    } else {
      uploadHandler();
    }
  }, [uploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: '.pdf',
    onDrop: onChangeHandler,
    multiple: false,
    disabled: uploading
  });

  return (
    <div className='root' {...getRootProps()}>
      <input {...getInputProps()} />
      { isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      ) }
    </div>
  );
};

export default PDFUploader;
