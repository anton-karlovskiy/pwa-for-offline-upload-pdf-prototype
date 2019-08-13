
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import './pdf-uploader.css';

const PDFUploader = () => {
  const [uploading, setUploading] = useState(false);

  const onChangeHandler = useCallback(acceptedFiles => {
    if (uploading || acceptedFiles.length === 0) {
      return;
    }

    const pdfData = new FormData();
    for (const file of acceptedFiles) {
      pdfData.append('file', file);
    }

    setUploading(true);
    const uploadPDF = async () => {
      try {
        // ray test touch <
        const url = `/upload-pdf?id=${Date.now()}`;
        // ray test touch >
        const { data: uploadedPDFs } = await fetch(url, {
          method: 'POST',
          body: pdfData
        }).then(res => res.json());
        console.log('[uploadPDF try] uploadedPDFs => ', uploadedPDFs);
        setUploading(false);
      } catch(error) {
        console.log('[uploadPDF catch] error => ', error);
      }
    };

    uploadPDF();
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
