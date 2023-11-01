import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

const app = express();
const PORT = 3030;
dotenv.config();

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
    },
  };
} catch (error) {
  console.log('Unauthorized activity');
}

app.use(cors(corsOptions));
app.use(express.json());

// Firebase Initialize
const adminIntialize = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY
      ? process.env.PRIVATE_KEY.replace(/\\n/gm, '\n')
      : undefined,
    clientEmail: process.env.CLIENT_EMAIL,
  }),
  databaseURL: process.env.DATABASE_URL,
});

const auth = getAuth(adminIntialize);
const db = getDatabase(adminIntialize);

app.get('/fetch/exam/options', async (req, res) => {
  try {
    const dbRef = db.ref('/search_options');
    const snaphot = await dbRef.once('value');
    res.send({ search_options: snaphot.val() });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/fetch/exam/data', async (req, res) => {
  try {
    const data = req.body.search_queries[0];
    const dbRef = db.ref(
      `data/departments/${data.department}/${data.batch}/academic_years/${data.academic_year}/semesters/${data.semester}/exam_type/${data.exam_type}`
    );

    const snaphot = await dbRef.once('value');

    if (snaphot.val() !== null) {
      const header = snaphot.val().Headers;
      const result = Object.values(snaphot.val().Students);
      res.send({ result: result, header: header });
    } else {
      res.send({ result: null });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/fetch/management/batches', async (req, res)=> {
  try{
    const department = req.body.search_queries[0].department;
    const dbRef = db.ref(`/data/departments/${department}`);

    const snaphot = await dbRef.once('value');

    if (snaphot.val() !== null) {
      const result = Object.values(snaphot.val());
      res.send({ result: result });
    } else {
      res.send({ result: null });
    }
  }
  catch(e){
    console.error(e);
  }
})

app.get('/fetch/users/all', async (req, res) => {
  try {
    const listUsersResult = await admin.auth(adminIntialize).listUsers(10);
    const users = listUsersResult.users.map((userRecord) => {
      const name = userRecord.displayName;
      const email = userRecord.email;
      const role = userRecord.customClaims ? 'Has Claim' : 'No Claim';
      return { Name: name, Email: email, Role: role };
    });

    res.send({ users: users });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/batches/add', async (req, res)=> {
  const {batch, department, year, semester, academicYear, studentsList} = req.body.batch_details;

  const data = {"Academic Year": academicYear, "Batch": batch, "Department": department, "Year": year, "Semester": semester, 'Students': studentsList}

  const dbRef = db.ref(`/data/departments/${department}/${batch}`);

  const result = await dbRef.set(data);

  res.send({message: 'ok'});
})

app.get('/fetch/batches', async (req, res)=>{
  const departmentQueries = req.query.department;
  console.log(departmentQueries);
  const dbRef = db.ref(`/data/departments/${departmentQueries}`)

  const data = await dbRef.once('value');
  const dataObj = {result: data.val()};
  res.send(dataObj)
})

app.post('/add/user', async (req, res) => {
  try {
    const { name, email, password } = req.body.data;

    console.log(email);

    getAuth(adminIntialize)
      .createUser({
        email: email,
        displayName: name,
        password: password
      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
      })
      .catch((error) => {
        console.log('Error creating new user:', error);
      });

    res.send('User added successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => console.log(`Server listening http://localhost:${PORT}/`));
