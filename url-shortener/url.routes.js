import express from 'express';
import { customAlphabet } from 'nanoid';

import UrlModel from './url.model.js';
import { ALPHABET, NUMBERS } from './constants.js';
const urlRouter = express.Router();

urlRouter.post('/short', async (req, res, next) => {
  const { longUrl } = req.body;
  const shortUrl = customAlphabet(ALPHABET + NUMBERS, 6)();

  let urlData = await UrlModel.findOne({
    longUrl: longUrl,
  });

  if (!urlData) {
    urlData = await UrlModel.create({
      longUrl: longUrl,
      shortUrl: shortUrl,
    });
  }

  return res.status(201).json({
    error: false,
    message: 'Shortened url is successful!',
    longUrl: urlData.longUrl,
    shortUrl: `BASEURL/${urlData.shortUrl}`,
  });
});

urlRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const urlData = await UrlModel.findOneAndUpdate(
      { shortUrl: id },
      { $inc: { clicks: 1 } }
    );

    if (!urlData) {
      throw new Error();
    }

    await urlData.save();

    return res.redirect(urlData.longUrl);
  } catch (error) {
    return res.send('Page not found!');
  }
});

export default urlRouter;
