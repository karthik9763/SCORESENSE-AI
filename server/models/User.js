const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter name']
  },
  email: {
    type: String,
    required: [true, 'Please enter email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please enter password']
  },
  role: {
    type: String,
    enum: ['Student', 'Admin'],
    default: 'Student'
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male'
  },
  registerNumber: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: 'Computer Science'
  },
  semester: {
    type: Number,
    default: 6
  },
  internalMarks: {
    type: Number,
    default: 75
  },
  assignmentMarks: {
    type: Number,
    default: 80
  },
  practicalMarks: {
    type: Number,
    default: 78
  },
  projectMarks: {
    type: Number,
    default: 82
  },
  semesterMarks: {
    type: Number,
    default: 75
  },
  attendance: {
    type: Number,
    default: 85
  },
  studyHours: {
    type: Number,
    default: 5.5
  },
  previousGPA: {
    type: Number,
    default: 8.0
  },
  extraActivities: {
    type: String,
    default: 'Yes'
  },
  phone: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);

