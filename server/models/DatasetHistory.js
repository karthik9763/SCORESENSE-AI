const mongoose = require('mongoose');

const DatasetHistorySchema = new mongoose.Schema({
  versionName: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  recordCount: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: String,
    default: 'admin@college.edu'
  },
  action: {
    type: String,
    enum: ['UPLOAD', 'REPLACE', 'SEED', 'RESTORE'],
    default: 'UPLOAD'
  },
  backupFileName: {
    type: String,
    default: ''
  },
  summaryStats: {
    avgAttendance: Number,
    avgInternalMarks: Number,
    avgCGPA: Number,
    passRate: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DatasetHistory', DatasetHistorySchema);
