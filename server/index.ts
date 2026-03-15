import express from 'express';
import cors from 'cors';
import { rssRouter } from './routes/rss.js';
import { stocksRouter } from './routes/stocks.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/api/rss', rssRouter);
app.use('/api/stocks', stocksRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
