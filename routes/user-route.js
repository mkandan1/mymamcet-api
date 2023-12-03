import express from 'express'
import { checkUserRole } from '../middleware/checkUserRole.js';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin'
import firebaseConfig  from '../firebase/config.js'

const userRoute = express.Router();

userRoute.post('/add', authenticateUser, checkUserRole(['admin', 'hod']), async (req, res) => {
    try {
        const { name, email, password, role } = req.body.data;

        getAuth(firebaseConfig.adminIntialize)
            .createUser({
                email: email,
                displayName: name,
                password: password
            })
            .then(async (userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log('Successfully created new user:', userRecord.uid);

                const assignedRole = await getAuth(firebaseConfig.adminIntialize).setCustomUserClaims(userRecord.uid, { role: role })

                res.send({ message: 'User added successfully' });
            })
            .catch((error) => {
                console.log('Error creating new user:', error);
                res.send({ message: 'Error' })
            });

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

userRoute.get('/getAllUsers', authenticateUser, checkUserRole(['admin', 'hod']), async (req, res) => {
    try {
        const listUsersResult = await admin.auth(firebaseConfig.adminIntialize).listUsers(10);
        const users = listUsersResult.users.map((userRecord) => {
            const name = userRecord.displayName;
            const email = userRecord.email;
            const role = userRecord.customClaims ? userRecord.customClaims.role : 'No Claim';
            return { Name: name, Email: email, Role: role };
        });

        res.send({ users: users });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
})

export default userRoute