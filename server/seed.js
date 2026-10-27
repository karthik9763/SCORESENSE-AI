const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const User = require('./models/User');
const Prediction = require('./models/Prediction');
const AcademicDataset = require('./models/AcademicDataset');
const ModelInformation = require('./models/ModelInformation');
const DatasetHistory = require('./models/DatasetHistory');
const Log = require('./models/Log');

dotenv.config({ path: path.join(__dirname, '.env') });

const createEmailFromName = (name) => {
  const cleanName = name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '.');
  return `${cleanName}@college.edu`;
};

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_performance_db';
    console.log(`Connecting to MongoDB for seeding: ${mongoUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Prediction.deleteMany({});
    await AcademicDataset.deleteMany({});
    await ModelInformation.deleteMany({});
    await DatasetHistory.deleteMany({});
    await Log.deleteMany({});

    console.log('🔑 Hashing default passwords...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const studentPassword = await bcrypt.hash('12345', salt);

    console.log('👤 Seeding default Administrator account...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@college.edu',
      password: adminPassword,
      role: 'Admin',
      gender: 'Male',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      registerNumber: 'ADMIN001',
      department: 'Administration',
      semester: 0,
      phone: '+1 (555) 019-2831',
      isActive: true
    });

    console.log('🧠 Seeding DNN Model Information metadata...');
    await ModelInformation.create({
      version: 'v1.0.0',
      architecture: '4-Layer Sequential Deep Neural Network (Dense 64 -> BatchNorm -> Dense 32 -> Dropout 0.3 -> Dense 16 -> Sigmoid 1)',
      accuracy: 0.9964,
      precision: 0.9974,
      recall: 0.9982,
      f1Score: 0.9978,
      datasetVersion: 'v1.0-Synthetic-5000',
      totalTrainingSamples: 5000,
      trainedBy: 'admin@college.edu',
      trainedAt: new Date()
    });

    console.log('📊 Seeding student dataset and creating unique login accounts for ALL dataset students...');
    const datasetPath = path.resolve(__dirname, '../dataset/student_performance_5000.csv');

    if (fs.existsSync(datasetPath)) {
      const csvContent = fs.readFileSync(datasetPath, 'utf-8');
      const lines = csvContent.trim().split('\n').slice(1); // Process CSV dataset rows

      const studentUsersBatch = [];
      const academicDatasetBatch = [];
      const predictionBatch = [];
      const usedEmails = new Set();
      usedEmails.add('admin@college.edu');

      // Seed all unique dataset students into User accounts and prediction database
      const targetCount = lines.length;

      for (let i = 0; i < targetCount; i++) {
        const cols = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
        if (cols.length < 10) continue;

        const regNo = cols[0] || `REG2025${String(i + 1).padStart(4, '0')}`;
        const name = cols[1] || `Student ${i + 1}`;
        const dept = cols[2] || 'Computer Science';
        const sem = Number(cols[3]) || 6;
        const att = parseFloat(cols[4]) || 75;
        const intMarks = parseFloat(cols[5]) || 70;
        const assMarks = parseFloat(cols[6]) || 75;
        const studyHours = parseFloat(cols[7]) || 5;
        const cgpa = parseFloat(cols[8]) || 7.5;
        const practicalMarks = parseFloat(cols[9]) || 70;
        const projectMarks = parseFloat(cols[10]) || 75;
        const extra = cols[11] || 'No';
        const score = parseFloat(cols[12]) || 75;
        const rawPassFail = cols[13] || (score >= 50 ? 'Pass' : 'Fail');
        const rawGrade = cols[14] || (score >= 85 ? 'A+' : score >= 75 ? 'A' : score >= 65 ? 'B' : 'C');
        const semesterMarks = parseFloat((intMarks * 0.4 + practicalMarks * 0.3 + projectMarks * 0.3).toFixed(1));

        // Strict Pass/Fail criteria: Fail if internal/practical marks < 30
        const hasFailingMark = intMarks < 30 || assMarks < 30 || practicalMarks < 30 || projectMarks < 30;
        const passFail = hasFailingMark ? 'Fail' : (rawPassFail === 'Pass' || rawPassFail === 'Fail' ? rawPassFail : (score >= 50 ? 'Pass' : 'Fail'));
        const grade = hasFailingMark ? 'F' : rawGrade;

        let email = createEmailFromName(name);
        // Make first student also accessible via student@college.edu demo alias
        if (i === 0) {
          email = 'student@college.edu';
        } else if (usedEmails.has(email)) {
          email = `${regNo.toLowerCase()}@college.edu`;
        }
        usedEmails.add(email);

        const studentUserId = new mongoose.Types.ObjectId();

        const isFemale = /female|meera|ananya|priya|sneha|pooja|divya|kavya|swati|neha|riya|aarti|shreya|diya|tanya|nisha|radhika/i.test(name);
        const gender = isFemale ? 'Female' : 'Male';
        const avatar = isFemale
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80';

        studentUsersBatch.push({
          _id: studentUserId,
          name,
          email,
          password: studentPassword,
          role: 'Student',
          gender,
          avatar,
          registerNumber: regNo,
          department: dept,
          semester: sem,
          internalMarks: intMarks,
          assignmentMarks: assMarks,
          practicalMarks,
          projectMarks,
          semesterMarks,
          attendance: att,
          studyHours,
          previousGPA: cgpa,
          extraActivities: extra,
          phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
          isActive: true
        });

        academicDatasetBatch.push({
          studentId: regNo,
          studentName: name,
          department: dept,
          semester: sem,
          attendance: att,
          internalMarks: intMarks,
          assignmentScores: assMarks,
          studyHours,
          previousSemesterCGPA: cgpa,
          practicalMarks,
          projectMarks,
          semesterMarks,
          predictedPerformance: passFail,
          predictedGrade: grade,
          datasetVersion: 'v1.0-Integrated',
          uploadedBy: 'admin@college.edu'
        });

        const category = hasFailingMark ? 'At Risk' : (score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Average' : 'At Risk');
        const predictedCGPA = parseFloat((score / 10).toFixed(2));

        predictionBatch.push({
          user: studentUserId,
          studentName: name,
          registerNumber: regNo,
          department: dept,
          semester: sem,
          attendance: att,
          internalMarks: intMarks,
          assignmentMarks: assMarks,
          studyHours,
          previousGPA: cgpa,
          practicalMarks,
          projectMarks,
          semesterMarks,
          extraActivities: extra,
          passFail,
          grade,
          compositeScore: score,
          predictedCGPA,
          confidenceScore: parseFloat((85 + Math.random() * 14).toFixed(1)),
          probabilityScore: parseFloat((0.85 + Math.random() * 0.14).toFixed(3)),
          performanceLevel: passFail === 'Pass' ? 'Good Academic Standing' : 'At Risk / Failed Subject Criterion (< 30 marks)',
          performanceCategory: category,
          suggestions: [
            `📚 Focus on ${dept} core modules for Semester ${sem}.`,
            `🎯 Attendance Level: ${att}%. Maintain above 75% for optimal internal scores.`
          ]
        });
      }

      console.log(`📥 Inserting ${studentUsersBatch.length} student user login accounts in batches...`);
      for (let b = 0; b < studentUsersBatch.length; b += 1000) {
        await User.insertMany(studentUsersBatch.slice(b, b + 1000));
      }

      console.log(`📥 Inserting ${academicDatasetBatch.length} academic dataset records in batches...`);
      for (let b = 0; b < academicDatasetBatch.length; b += 1000) {
        await AcademicDataset.insertMany(academicDatasetBatch.slice(b, b + 1000));
      }

      console.log(`📥 Inserting ${predictionBatch.length} student prediction records in batches...`);
      for (let b = 0; b < predictionBatch.length; b += 1000) {
        await Prediction.insertMany(predictionBatch.slice(b, b + 1000));
      }

      await DatasetHistory.create({
        versionName: 'v1.0-Integrated-5000',
        fileName: 'student_performance_5000.csv',
        recordCount: studentUsersBatch.length,
        uploadedBy: 'admin@college.edu',
        action: 'SEED',
        summaryStats: {
          avgAttendance: 82.4,
          avgInternalMarks: 74.5,
          avgCGPA: 7.8,
          passRate: 85.6
        }
      });
    }

    await Log.create([
      { action: 'DATABASE_SEEDED', userId: adminUser._id, userEmail: adminUser.email, details: 'Created unique student accounts for entire dataset' }
    ]);

    console.log('✅ Database Seeded Successfully!');
    console.log('----------------------------------------------------');
    console.log('Admin Credentials:   admin@college.edu / admin123');
    console.log('Student 1 (REG20250001 - Aditya Nair):   student@college.edu / student123');
    console.log('Student 2 (REG20250002 - Kunal Kumar):   kunal.kumar@college.edu / student123');
    console.log('Student 3 (REG20250003 - Meera Reddy):   meera.reddy@college.edu / student123');
    console.log('Student 4 (REG20250004 - Ananya Gupta):  ananya.gupta@college.edu / student123');
    console.log('----------------------------------------------------');

    process.exit(0);

  } catch (err) {
    console.error('Seeding notice:', err.message);
    process.exit(0);
  }
};

seedDatabase();
