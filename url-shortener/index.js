import express from 'express';

import {} from './db.js';
import routeUrl from './url.routes.js';

const app = express();
const PORT = 4100;

app.use(express.json());
app.use('/', routeUrl);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
