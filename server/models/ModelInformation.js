const mongoose = require('mongoose');

const ModelInformationSchema = new mongoose.Schema({
  version: {
    type: String,
    default: '1.0.0'
  },
  architecture: {
    type: String,
    default: '4-Layer Sequential Deep Neural Network (Dense 64 -> BatchNorm -> Dense 32 -> Dropout 0.3 -> Dense 16 -> Sigmoid 1)'
  },
  accuracy: {
    type: Number,
    default: 0.9964
  },
  precision: {
    type: Number,
    default: 0.9974
  },
  recall: {
    type: Number,
    default: 0.9982
  },
  f1Score: {
    type: Number,
    default: 0.9978
  },
  datasetVersion: {
    type: String,
    default: 'v1.0'
  },
  totalTrainingSamples: {
    type: Number,
    default: 5000
  },
  trainedBy: {
    type: String,
    default: 'admin@college.edu'
  },
  trainedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ModelInformation', ModelInformationSchema);
