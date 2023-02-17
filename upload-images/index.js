const express = require('express');
const multer = require('multer');

const app = express();
const PORT = 4100;

app.use(express.json());

const uploadRoute = require('./upload.routes');

// Routes
app.use('/kick-nodes/product', express.static('upload/images'));
app.use('/api/upload', uploadRoute);

app.use((err, req, res, next) => {
  let serverErrorMessage = err.message ?? 'We are unable to do that!.';

  if (err instanceof multer.MulterError) {
    serverErrorMessage = err.message;
  }

  return res.status(500).json({
    success: false,
    message: serverErrorMessage,
  });
});

// app.get('*', (req, res) => {
//   return res.json({
//     code: '200',
//     message: '* All Route!',
//   });
// });

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
