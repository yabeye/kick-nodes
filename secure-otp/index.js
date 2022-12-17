const app = require('express')();

const PORT = process.env.PORT || 4100;

const authRoute = require('./auth');

app.use('/auth', authRoute);
// Other routes here
app.get('*', (req, res) => {
  return res.json({
    message: 'Hello From Secure OTP!',
  });
});

app.listen(PORT, () => {
  console.log('Server is listening on PORT, ' + PORT);
});
