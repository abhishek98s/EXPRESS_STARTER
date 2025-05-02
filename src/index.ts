import 'express-async-errors';
import app from './app';

import { config } from './config/config';

const port = config.app.port;
const name = config.app.name;

app.listen(port, () => {
  console.log(`${name} started at http://localhost:${port}`);
});

export default app;
