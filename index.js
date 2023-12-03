import express from 'express';
import cors from 'cors';
import batchRoute from './routes/batch-route.js';
import userRoute from './routes/user-route.js';
import { connectToDatabase } from './database/db.js';

const app = express();
const PORT = 3030;

try {
  var whitelist = [
    'http://localhost:5173',
    'https://mymamcet.vercel.app',
    'https://mymamcet.up.railway.app',
  ];
  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
      credentials: true
    },
  };
} catch (error) {
  console.log('Unauthorized activity');
}


app.use(cors(corsOptions));
app.use(express.json());

connectToDatabase();

app.use('/batch', batchRoute);
app.use('/platform/users', userRoute);


app.listen(PORT, () => console.log(`Server listening http://localhost:${PORT}/`));
