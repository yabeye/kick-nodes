import mongoose from 'mongoose';

mongoose.set('strictQuery', true);
mongoose
  .connect('mongodb://localhost/Short-Urls', {})
  .then((_) => {
    console.log(`Database is connected successfully !`);
  })
  .catch((err) => {
    console.error("Couldn't connect to the database.");
  });
