const mongoose = require('mongoose');

const AcademicDatasetSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    index: true
  },
  studentName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    default: 'Computer Science'
  },
  semester: {
    type: Number,
    default: 6
  },
  attendance: {
    type: Number,
    required: true
  },
  internalMarks: {
    type: Number,
    required: true
  },
  assignmentScores: {
    type: Number,
    required: true
  },
  studyHours: {
    type: Number,
    default: 5
  },
  previousSemesterCGPA: {
    type: Number,
    required: true
  },
  practicalMarks: {
    type: Number,
    default: 70
  },
  projectMarks: {
    type: Number,
    default: 75
  },
  semesterMarks: {
    type: Number,
    default: 70
  },
  predictedPerformance: {
    type: String,
    enum: ['Pass', 'Fail'],
    default: 'Pass'
  },
  predictedGrade: {
    type: String,
    default: 'A'
  },
  datasetVersion: {
    type: String,
    default: 'v1.0'
  },
  uploadedBy: {
    type: String,
    default: 'System Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AcademicDataset', AcademicDatasetSchema);
