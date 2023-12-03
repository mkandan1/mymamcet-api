
import { getDatabase } from '../../database/db.js';
import { getDepartmentId, getRegulationId } from '../getObjectId.js';
import {batchModel, studentModel} from '../../models/models.js';


export const addToDatabase = async (Obj) => {
    const db = getDatabase();
    const batchCollection = db.collection('batch');
    const departmentCollection = db.collection('department');  // Corrected typo
  
    try {
      // Get department id
      let departmentID = await getDepartmentId(Obj.department);

      //Regulation id
      let regulationId = await getRegulationId(Obj.regulation);
  
      // If department Id is empty
      if (departmentID == null) {
        const newDepartment = departmentModel({
          department: Obj.department,
          hod: null,
          batches: null,
        });
  
        // Insert New Department
        const result = await departmentCollection.insertOne(newDepartment);
  
        // Update the department Id
        departmentID = result.insertedId;
      }
  
      const newBatch = batchModel({
        batch: Obj.batch,
        department: Obj.department,
        year: Obj.year,
        semester: Obj.semester,
        academic_year: Obj.academicYear,
        department_id: departmentID,
        students: Obj.studentsList ? Object.keys(Obj.studentsList) : null
      });

      const result = await batchCollection.insertOne(newBatch);

      let batchId = result.insertedId;

      // Add students 
      if (Obj.studentsList) {
        const studentCollection = db.collection('students');
  
        let newStudentsList = [];
  
        for (let registerNumber in Obj.studentsList) {
          const student = Obj.studentsList[registerNumber];
          const newStudent = studentModel({
            register_number: student.registerNumber,
            student_name: student.name
          });
  
          newStudentsList.push(newStudent);
        }
  
        // Insert students and get their insertedIds
        const studentInsertionResult = await studentCollection.insertMany(newStudentsList);
        const studentIds = studentInsertionResult.insertedIds;
  
        // Update the batch document with the student references
        await batchCollection.updateOne({ _id: batchId }, { $set: { students: studentIds } });
        await departmentCollection.updateOne({_id: departmentID}, {$push: {batches: resu}})
      }

      if (!result.insertedId) {
        throw new Error("Failed to create");
      } else {
        return 50;  // Adjust the value you want to resolve with
      }
      
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };