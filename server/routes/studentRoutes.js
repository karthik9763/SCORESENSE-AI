const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Prediction = require('../models/Prediction');
const Log = require('../models/Log');
const { protect, authorize } = require('../middleware/auth');
const { executeDNNPrediction } = require('../utils/dnnPredictor');

// In-Memory Fallback store for student predictions
const inMemoryPredictions = [];

// Helper to determine Performance Category
const getPerformanceCategory = (compositeScore) => {
  if (compositeScore >= 85) return 'Excellent';
  if (compositeScore >= 70) return 'Good';
  if (compositeScore >= 50) return 'Average';
  return 'At Risk';
};

const datasetService = require('../utils/datasetService');

// @route   GET /api/student/search
// @desc    Global Search any student across 100% of dataset records by RegNo, Name, or Department
// @access  Public
router.get('/search', (req, res) => {
  try {
    const query = req.query.q || '';
    const results = datasetService.searchStudents(query, 25);
    res.json({
      success: true,
      count: results.length,
      students: results
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error searching students', error: err.message });
  }
});

// @route   GET /api/student/verify-dataset
// @desc    Full automated audit report of all 5,000 dataset records
// @access  Public
router.get('/verify-dataset', (req, res) => {
  try {
    const report = datasetService.getDatasetHealthReport();
    res.json({
      success: true,
      report
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating dataset verification report', error: err.message });
  }
});

// @route   GET /api/student/profile/:regNo
// @desc    Get any student's complete academic record, prediction, and risk level from the dataset
// @access  Public
router.get('/profile/:regNo', (req, res) => {
  try {
    const normRegNo = datasetService.normalizeRegNo(req.params.regNo);
    const student = datasetService.getStudentByRegNo(normRegNo);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found in the existing dataset.'
      });
    }

    res.json({
      success: true,
      student
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching student profile', error: err.message });
  }
});

// @route   GET /api/student/dashboard
// @desc    Get logged in student's dashboard metrics, academic profile, current semester details, performance trend
// @access  Private (Student & Admin)
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const normRegNo = datasetService.normalizeRegNo(req.user.registerNumber);

    // 1. Fetch exact student record from the complete dataset
    const datasetStudent = datasetService.getStudentByRegNo(normRegNo);

    let userObj = req.user;
    let userPredictions = [];

    try {
      if (userId && !String(userId).startsWith('ds_student_')) {
        const dbUser = await User.findById(userId).select('-password');
        if (dbUser) userObj = dbUser;
      }

      userPredictions = await Prediction.find({
        $or: [
          { user: userId },
          { registerNumber: normRegNo }
        ]
      }).sort({ createdAt: -1 });
    } catch (dbErr) {
      userPredictions = inMemoryPredictions.filter(
        p => String(p.user) === String(userId) || datasetService.normalizeRegNo(p.registerNumber) === normRegNo
      );
    }

    // 2. Build or fetch latest prediction strictly from student's dataset record if none in DB
    let latestPrediction = userPredictions.length > 0 ? userPredictions[0] : null;

    if (!latestPrediction && datasetStudent) {
      const prob = 1.0 / (1.0 + Math.exp(-(datasetStudent.finalScore - 50.0) / 7.5));
      latestPrediction = {
        studentName: datasetStudent.studentName,
        registerNumber: datasetStudent.registerNumber,
        department: datasetStudent.department,
        semester: datasetStudent.semester,
        attendance: datasetStudent.attendance,
        internalMarks: datasetStudent.internalMarks,
        assignmentMarks: datasetStudent.assignmentMarks,
        studyHours: datasetStudent.studyHours,
        previousGPA: datasetStudent.previousGPA,
        practicalMarks: datasetStudent.practicalMarks,
        projectMarks: datasetStudent.projectMarks,
        semesterMarks: datasetStudent.internalMarks,
        extraActivities: datasetStudent.extraActivities,
        passFail: datasetStudent.passFail,
        grade: datasetStudent.grade,
        compositeScore: datasetStudent.finalScore,
        predictedCGPA: datasetStudent.cgpa,
        confidenceScore: parseFloat((prob * 100).toFixed(2)),
        probabilityScore: parseFloat(prob.toFixed(4)),
        performanceLevel: datasetStudent.passFail === 'Pass' ? 'Good Academic Standing' : 'At Risk / Action Required',
        performanceCategory: datasetStudent.finalScore >= 85 ? 'Excellent' : datasetStudent.finalScore >= 70 ? 'Good' : datasetStudent.finalScore >= 50 ? 'Average' : 'At Risk',
        riskLevel: datasetStudent.riskLevel,
        suggestions: [
          `🌟 Verified Record for ${datasetStudent.studentName} (${datasetStudent.registerNumber}).`,
          `📚 Department: ${datasetStudent.department} • Semester ${datasetStudent.semester}.`,
          `🎯 Attendance: ${datasetStudent.attendance}% • Cumulative CGPA: ${datasetStudent.cgpa}/10.0.`
        ],
        createdAt: new Date().toISOString()
      };
    }

    // Calculate Performance Trend strictly for this student
    const trendData = userPredictions.length > 0
      ? userPredictions.slice(0, 5).reverse().map(p => ({
          date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: p.compositeScore,
          cgpa: p.predictedCGPA || parseFloat((p.compositeScore / 10).toFixed(2))
        }))
      : [
          { date: 'Sem 1', score: Math.max(40, datasetStudent ? datasetStudent.finalScore - 8 : 70), cgpa: datasetStudent ? Math.max(4, datasetStudent.cgpa - 0.8) : 7.0 },
          { date: 'Sem 2', score: Math.max(45, datasetStudent ? datasetStudent.finalScore - 4 : 74), cgpa: datasetStudent ? Math.max(4.5, datasetStudent.cgpa - 0.4) : 7.4 },
          { date: `Sem ${datasetStudent?.semester || userObj.semester || 6}`, score: datasetStudent ? datasetStudent.finalScore : 80, cgpa: datasetStudent ? datasetStudent.cgpa : 8.0 }
        ];

    res.json({
      success: true,
      student: {
        id: userObj._id || userObj.id || `ds_${normRegNo}`,
        name: datasetStudent?.studentName || userObj.name,
        email: datasetStudent?.email || userObj.email,
        registerNumber: normRegNo || datasetStudent?.registerNumber || userObj.registerNumber,
        department: datasetStudent?.department || userObj.department || 'Computer Science',
        semester: datasetStudent?.semester || userObj.semester || 1,
        year: datasetStudent?.year || Math.ceil((userObj.semester || 1) / 2),
        attendance: datasetStudent?.attendance ?? userObj.attendance ?? 75,
        internalMarks: datasetStudent?.internalMarks ?? userObj.internalMarks ?? 70,
        assignmentMarks: datasetStudent?.assignmentMarks ?? userObj.assignmentMarks ?? 75,
        studyHours: datasetStudent?.studyHours ?? userObj.studyHours ?? 5,
        previousGPA: datasetStudent?.previousGPA ?? userObj.previousGPA ?? 7.5,
        cgpa: datasetStudent?.cgpa ?? userObj.previousGPA ?? 7.5,
        practicalMarks: datasetStudent?.practicalMarks ?? userObj.practicalMarks ?? 70,
        projectMarks: datasetStudent?.projectMarks ?? userObj.projectMarks ?? 75,
        extraActivities: datasetStudent?.extraActivities ?? userObj.extraActivities ?? 'Yes',
        finalScore: datasetStudent?.finalScore ?? 75,
        grade: datasetStudent?.grade ?? 'B',
        passFail: datasetStudent?.passFail ?? 'Pass',
        riskLevel: datasetStudent?.riskLevel ?? 'Low Risk',
        phone: datasetStudent?.phone || userObj.phone || '',
        avatar: userObj.avatar || ''
      },
      currentSemester: {
        semester: datasetStudent?.semester || userObj.semester || 1,
        academicYear: '2025 - 2026',
        totalSubjects: 6,
        creditsCompleted: (datasetStudent?.semester || userObj.semester || 1) * 20
      },
      latestPrediction,
      totalPredictionsCount: userPredictions.length || 1,
      performanceTrend: trendData
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error loading student dashboard', error: err.message });
  }
});

// @route   POST /api/student/predict
// @desc    Generate student performance prediction via DNN (Strictly tied to student)
// @access  Private (Student & Admin)
router.post('/predict', protect, async (req, res) => {
  try {
    const inputData = {
      ...req.body,
      studentName: req.user.name,
      registerNumber: req.user.registerNumber || 'REG20250042',
      department: req.user.department || 'Computer Science',
      semester: req.user.semester || 6
    };

    const predictionResult = await executeDNNPrediction(inputData);

    const category = getPerformanceCategory(predictionResult.compositeScore);
    const predictedCGPA = parseFloat((predictionResult.compositeScore / 10.0).toFixed(2));

    let savedPrediction = null;
    try {
      savedPrediction = await Prediction.create({
        user: req.user.id || req.user._id,
        studentName: req.user.name,
        registerNumber: req.user.registerNumber,
        department: req.user.department,
        semester: req.user.semester,
        attendance: predictionResult.inputs.attendance,
        internalMarks: predictionResult.inputs.internalMarks,
        assignmentMarks: predictionResult.inputs.assignmentMarks,
        studyHours: predictionResult.inputs.studyHours,
        previousGPA: predictionResult.inputs.previousGPA,
        practicalMarks: predictionResult.inputs.practicalMarks,
        projectMarks: predictionResult.inputs.projectMarks,
        semesterMarks: predictionResult.inputs.semesterMarks,
        extraActivities: predictionResult.inputs.extraActivities,
        passFail: predictionResult.passFail,
        grade: predictionResult.grade,
        compositeScore: predictionResult.compositeScore,
        predictedCGPA,
        confidenceScore: predictionResult.confidenceScore,
        probabilityScore: predictionResult.probabilityScore,
        performanceLevel: predictionResult.performanceLevel,
        performanceCategory: category,
        suggestions: predictionResult.suggestions
      });

      await Log.create({
        action: 'PREDICTION_GENERATED',
        userId: req.user.id || req.user._id,
        userEmail: req.user.email,
        details: `Grade: ${predictionResult.grade}, Category: ${category}`
      });
    } catch (dbErr) {
      savedPrediction = {
        _id: 'pred_' + Date.now(),
        user: req.user.id || req.user._id,
        ...predictionResult.inputs,
        ...predictionResult,
        predictedCGPA,
        performanceCategory: category,
        createdAt: new Date()
      };
      inMemoryPredictions.unshift(savedPrediction);
    }

    res.status(201).json({
      success: true,
      message: 'Student Academic Performance computed successfully by Deep Neural Network engine',
      prediction: savedPrediction || { ...predictionResult, predictedCGPA, performanceCategory: category }
    });

  } catch (err) {
    console.error('Prediction Engine Error:', err);
    res.status(500).json({ success: false, message: 'Error processing DNN prediction', error: err.message });
  }
});

// @route   GET /api/student/history
// @desc    Get prediction history strictly for logged in student
// @access  Private (Student & Admin)
router.get('/history', protect, async (req, res) => {
  try {
    let history = [];
    const userId = req.user.id || req.user._id;
    const registerNumber = req.user.registerNumber;

    try {
      history = await Prediction.find({
        $or: [
          { user: userId },
          { registerNumber: registerNumber }
        ]
      }).sort({ createdAt: -1 });
    } catch (dbErr) {
      history = inMemoryPredictions.filter(
        p => String(p.user) === String(userId) || p.registerNumber === registerNumber
      );
    }

    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching prediction history', error: err.message });
  }
});


// @route   DELETE /api/student/history/:id
// @desc    Delete a specific prediction history record (Admin Only)
// @access  Private (Admin only)
router.delete('/history/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Prediction.findByIdAndDelete(id);
    } catch (e) {
      const idx = inMemoryPredictions.findIndex(p => p._id === id);
      if (idx !== -1) inMemoryPredictions.splice(idx, 1);
    }

    res.json({ success: true, message: 'Prediction history record removed successfully by Admin.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting history record', error: err.message });
  }
});

// @route   PUT /api/student/profile
// @desc    Update student personal profile (Personal info for students, full control for Admin)
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, password, avatar, registerNumber, department, semester, semesterMarks } = req.body;
    const userId = req.user.id || req.user._id;
    const isAdmin = String(req.user.role || '').toLowerCase() === 'admin';

    // Guard: Non-admins cannot alter read-only institutional academic parameters
    if (!isAdmin) {
      if (registerNumber || department || (semester && semester !== req.user.semester) || semesterMarks !== undefined) {
        return res.status(403).json({
          success: false,
          message: 'Academic parameters (Register Number, Department, Semester, Marks) are institutional records and can only be modified by a System Administrator.'
        });
      }
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (avatar) updateFields.avatar = avatar;

    if (isAdmin) {
      if (registerNumber) updateFields.registerNumber = registerNumber;
      if (department) updateFields.department = department;
      if (semester) updateFields.semester = Number(semester);
      if (semesterMarks !== undefined) updateFields.semesterMarks = Number(semesterMarks);
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      }
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    let updatedUser = null;
    try {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        updateFields,
        { new: true, runValidators: true }
      ).select('-password');

      await Log.create({
        action: isAdmin ? 'ADMIN_UPDATED_STUDENT_PROFILE' : 'STUDENT_UPDATED_PROFILE',
        userId,
        userEmail: req.user.email
      });
    } catch (e) {
      updatedUser = {
        ...req.user,
        ...updateFields
      };
    }

    res.json({
      success: true,
      message: isAdmin ? 'Student profile updated successfully by Administrator.' : 'Personal profile updated successfully.',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating profile', error: err.message });
  }
});

// Configure Multer for Avatar & Document Image Uploads
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const avatarsDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `avatar_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Please upload PNG, JPG, or JPEG image files only.'), false);
  }
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

// @route   POST /api/student/upload-avatar
// @desc    Upload student profile avatar / mark sheet image with validation (PNG, JPG, JPEG)
// @access  Private
router.post('/upload-avatar', protect, (req, res) => {
  uploadAvatar.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Error uploading image file',
        error: err
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided. Please select a valid PNG, JPG, or JPEG image file.',
        error: { field: 'image' }
      });
    }

    const imageUrl = `http://localhost:5000/uploads/avatars/${req.file.filename}`;
    const userId = req.user.id || req.user._id;

    try {
      await User.findByIdAndUpdate(userId, { avatar: imageUrl });
      await Log.create({ action: 'STUDENT_UPLOADED_IMAGE', userId, userEmail: req.user.email, details: req.file.filename });
    } catch (e) {
      if (req.user) req.user.avatar = imageUrl;
    }

    res.json({
      success: true,
      message: 'Profile image uploaded and saved successfully.',
      data: {
        url: imageUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      user: {
        ...req.user,
        avatar: imageUrl
      }
    });
  });
});

module.exports = router;
