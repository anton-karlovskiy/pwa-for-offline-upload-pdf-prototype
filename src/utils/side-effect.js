
const uploadPDFs = async (id, pdfFiles) => {
  const pdfData = new FormData();
  for (const file of pdfFiles) {
    pdfData.append('file', file);
  }

  const url = `/upload-pdf?id=${id}`;
  const { data: uploadedPDFs, id: uploadId } = await fetch(url, {
    method: 'POST',
    body: pdfData
  }).then(res => res.json());
  
  return {uploadId, uploadedPDFs};
};

export { uploadPDFs };