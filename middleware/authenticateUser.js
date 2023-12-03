import firebaseConfig  from '../firebase/config.js'
import { getAuth } from 'firebase-admin/auth'

export const authenticateUser = async (req, res, next) => {
  try {

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Error('Invalid authorization header')
    }

    const idToken = authHeader.split(' ')[1];

    const decodedToken = await getAuth(firebaseConfig.adminIntialize).verifyIdToken(idToken);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};