const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'build')));

const UPLOADED_PDFS_PATH = './uploaded-pdfs';
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADED_PDFS_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}-${Date.now()}.pdf`);
  }
});
const upload = multer({ storage: storage }).array('file');
const utils = require('./utils');

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/upload-pdf', async (req, res) => {
  await utils.createFolder(UPLOADED_PDFS_PATH);

  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
        console.log('[server route upload-pdf] error case 1 => ', error);
        return res.status(500).json(error);
    } else if (error) {
        console.log('[server route upload-pdf] error case 2 => ', error);
        return res.status(500).json(error);
    }

    return res.status(200).send({data: req.files});
  });
});

// need to declare a "catch all" route on your express server 
// that captures all page requests and directs them to the client
// the react-router do the route part
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(
    process.env.PORT || 5000,
    () => {
      console.log(`Frontend start on http://localhost:5000`);
    }
);