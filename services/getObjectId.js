import { getDatabase } from "../database/db.js";
// Department Id
export async function getDepartmentId(name) {
    try {
        const result = await getDatabase().collection('department').findOne({ department: name });
        
        if (result) {
            console.log(result._id);
            return result._id;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err; // Re-throw the error to be handled by the calling function
    }
}

// Regulation Id
// (Similar functions for Regulation Id, Semester Id, Batch Id, and Subject code can be implemented in the same way)

export async function getRegulationId(name) {
    // Implementation for Regulation Id
    try {
        const result = await getDatabase().collection('regulation').findOne({ regulation: name });
        
        if (result) {
            console.log(result._id);
            return result._id;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err; // Re-throw the error to be handled by the calling function
    }
}

export async function getSemesterId(name) {
    // Implementation for Semester Id
}

export async function getBatchId(name) {
    // Implementation for Batch Id
}

export async function getSubjectCode(name) {
    // Implementation for Subject code
}
