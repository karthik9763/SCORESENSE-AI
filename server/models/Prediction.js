const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  studentName: {
    type: String,
    required: true
  },
  registerNumber: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  attendance: {
    type: Number,
    required: true
  },
  internalMarks: {
    type: Number,
    required: true
  },
  assignmentMarks: {
    type: Number,
    required: true
  },
  studyHours: {
    type: Number,
    required: true
  },
  previousGPA: {
    type: Number,
    required: true
  },
  practicalMarks: {
    type: Number,
    required: true
  },
  projectMarks: {
    type: Number,
    required: true
  },
  semesterMarks: {
    type: Number,
    required: true,
    default: 70
  },
  extraActivities: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No'
  },
  // Prediction Outputs
  passFail: {
    type: String,
    enum: ['Pass', 'Fail'],
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  compositeScore: {
    type: Number,
    required: true
  },
  predictedCGPA: {
    type: Number,
    default: 8.5
  },
  confidenceScore: {
    type: Number,
    required: true
  },
  probabilityScore: {
    type: Number,
    required: true
  },
  performanceLevel: {
    type: String,
    default: 'Satisfactory'
  },
  performanceCategory: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'At Risk'],
    default: 'Good'
  },
  suggestions: [{
    type: String
  }],
  isEditedByAdmin: {
    type: Boolean,
    default: false
  },
  editedBy: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', PredictionSchema);

