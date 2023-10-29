import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'

const app = express();
const PORT = 3030;
dotenv.config();

try{
  var whitelist = ['http://localhost:5173', 'https://mymamcet.vercel.app/', 'https://mymamcet.up.railway.app/']
  var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}  }
catch{
  console.log('Unauthorized activity')
}

app.use(cors(corsOptions));
app.use(express.json());


// Firebase Initialize
const adminIntialize = admin.initializeApp({
  credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      privateKey: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.replace(/\\n/gm, "\n") : undefined,
      clientEmail: process.env.CLIENT_EMAIL,
  }),
  databaseURL: process.env.DATABASE_URL
});

const auth = getAuth(adminIntialize)
const db = getDatabase(adminIntialize);

app.get('/fetch/exam/options', (req, res)=>{


  const dbRef = db.ref('/search_options');

  dbRef.once('value', ( snaphot) => {
      
      res.send({search_options: snaphot.val()})
      res.end();
  })

  // send department, batch, academic year, semester, subjects, exam type
  // department ---> IT, CSE, ECE, etc
  //  batch ---> 2021 - 2025
  // Academic year ---> 2023 - 2024, etc
  // semester ----> V, etc
  // Subjects ----> SOft computing, etc

} )

app.get('/fetch/exam/marks', (req, res)=>{
  res.send({message: 'All good'})
});



app.listen(PORT, ()=> console.log(`Server listening http://localhost:${PORT}/`))