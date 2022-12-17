import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    longUrl: {
      type: String,
      maxLength: 1024,
      required: true,
    },
    shortUrl: {
      type: String,
      maxLength: 64,
      required: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamp: true,
  }
);

const UrlModel = mongoose.model('Url', urlSchema);

export default UrlModel;
