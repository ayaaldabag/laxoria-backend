const express = require('express');
const dotenv = require('dotenv');
const { authRouter } = require('./auth');
dotenv.config();
const app = express();
app.use(express.json());
app.get('/', (req, res) => res.json({ ok: true, app: process.env.APP_NAME || 'Laxoria' }));
app.use('/auth', authRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Laxoria backend running on port ${port}`);
});
