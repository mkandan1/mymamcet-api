import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { checkUserRole } from '../middleware/checkUserRole.js';
import { addToDatabase } from '../services/Batch/batchServices.js';

const batchRoute = express.Router();

batchRoute.post('/add', authenticateUser, checkUserRole(['admin', 'hod']), async (req, res) => {
  const batchObject = req.body.batch_details;

  try {
    await addToDatabase(batchObject);
    res.json({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false });
  }
});



export default batchRoute;
