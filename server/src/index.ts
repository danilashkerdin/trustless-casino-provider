import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../../public')));

app.get('/api/status', (_req, res) => {
  res.json({ status: 'ok', network: 'testnet' });
});

app.listen(PORT, () => {
  console.log(`Trustless Casino — http://localhost:${PORT}`);
});