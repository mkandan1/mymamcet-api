import mongoose, { Schema, mongo } from 'mongoose'

const batchSchema = new mongoose.Schema({
    batch: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    semester: { type: String, required: true },
    academic_year: { type: String, required: true },
    regulation_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Regulation', required: true},
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DepartmentModel', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentModel' }]
  });

const studentSchema = new mongoose.Schema({
    register_number: { type: Number, required: true },
    student_name: { type: String, required: true },
})

const departmentSchema = new mongoose.Schema({
    departmet: {type: String, required: true},
    hod: {type: String, required: true},
    batches: {type: mongoose.Schema.Types.ObjectId, ref: 'BatchModel', required: false}
})

const regulationSchema = new mongoose.Schema({
    regulation: {type: String, required: true},
    semesters: {type: mongoose.Schema.Types.ObjectId, ref: 'SemesterModel', required: false}
})

const semesterSchema = new mongoose.Schema({
    semester_name: {type: String, required: true},
    subjects: {type: mongoose.Schema.Types.ObjectId, ref: 'SubjectModel', required: false}
})

const subjectsSchema = new mongoose.Schema({
    subject_code: {type: String, required: true},
    subject_name: {type: String, required: true},
    subject_credits: {type: String, required: true}
})


const departmentModel = mongoose.model('DepartmentModel', departmentSchema);

const studentModel = mongoose.model('StudentModel', studentSchema);

const batchModel = mongoose.model('BatchModel', batchSchema);

const regulationModel = mongoose.model('RegulationModel', regulationSchema);

const semesterModel = mongoose.model('SemesterModel', semesterSchema);

const subjectModel = mongoose.model('SubjectModel', subjectsSchema);

export { batchModel, studentModel, departmentModel, regulationModel, semesterModel, subjectModel };