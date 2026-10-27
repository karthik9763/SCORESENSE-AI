const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_dnn_mwp_2025_college_project');
    
    const datasetService = require('../utils/datasetService');

    // Check if user exists in DB or in-memory fallback
    try {
      if (decoded.id && decoded.id !== 'admin_master_id') {
        req.user = await User.findById(decoded.id).select('-password');
      } else if (decoded.role === 'Admin') {
        req.user = await User.findOne({ role: 'Admin' }).select('-password');
      }
    } catch (e) {
      req.user = null;
    }

    if (!req.user) {
      if (decoded.role === 'Admin') {
        req.user = {
          _id: decoded.id || 'admin_master_id',
          id: decoded.id || 'admin_master_id',
          name: decoded.name || 'System Administrator',
          email: decoded.email || 'admin@college.edu',
          role: 'Admin',
          registerNumber: 'ADMIN001',
          department: 'Administration',
          semester: 0,
          isActive: true
        };
      } else {
        const datasetStudent = decoded.registerNumber ? datasetService.getStudentByRegNo(decoded.registerNumber) : null;
        if (datasetStudent) {
          req.user = {
            _id: datasetStudent._id,
            id: datasetStudent._id,
            name: datasetStudent.name,
            email: datasetStudent.email,
            role: 'Student',
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
            extraActivities: datasetStudent.extraActivities,
            finalScore: datasetStudent.finalScore,
            grade: datasetStudent.grade,
            passFail: datasetStudent.passFail,
            riskLevel: datasetStudent.riskLevel,
            phone: datasetStudent.phone,
            avatar: datasetStudent.avatar,
            isActive: true
          };
        } else {
          req.user = {
            _id: decoded.id,
            id: decoded.id,
            name: decoded.name || 'User',
            email: decoded.email || 'user@college.edu',
            role: decoded.role || 'Student',
            registerNumber: decoded.registerNumber ? datasetService.normalizeRegNo(decoded.registerNumber) : '',
            department: decoded.department || 'Computer Science',
            semester: decoded.semester || 1,
            isActive: true
          };
        }
      }
    }

    if (req.user.isActive === false) {
      return res.status(403).json({ success: false, message: 'Your account has been disabled by System Administrator.' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: Role verification failed.'
      });
    }

    const normalizedAllowedRoles = roles.map(r => String(r).toLowerCase());
    const userRole = String(req.user.role).toLowerCase();

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

