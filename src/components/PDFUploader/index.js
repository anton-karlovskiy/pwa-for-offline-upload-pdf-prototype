
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import './pdf-uploader.css';

const PDFUploader = () => {
  const onChangeHandler = useCallback(acceptedFiles => {
    // Do something with the files
    console.log('ray : [PDFUploader onChangeHandler] acceptedFiles => ', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: '.pdf',
    onDrop: onChangeHandler,
    multiple: false
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
