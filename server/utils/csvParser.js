/**
 * CSV / Excel Dataset Parser & Validator Utility
 */

const REQUIRED_HEADERS = [
  'Student_ID',
  'Student_Name',
  'Attendance',
  'Internal_Marks',
  'Assignment_Marks',
  'Previous_GPA',
  'Predicted_Result'
];

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur.replace(/^["']|["']$/g, '').trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.replace(/^["']|["']$/g, '').trim());
  return result;
}

function parseCSVString(csvContent) {
  const lines = csvContent
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV file is empty or missing data rows');
  }

  // Header line
  const rawHeaders = parseCSVLine(lines[0]);

  // Check column names flexible casing
  const headerMap = {};
  rawHeaders.forEach((h, index) => {
    const normalized = h.toLowerCase().replace(/[^a-z0-9]/g, '');
    headerMap[normalized] = { original: h, index };
  });

  // Validate required headers present
  const missingHeaders = [];
  const requiredNorms = {
    studentid: ['studentid', 'student_id', 'regno', 'registernumber', 'id'],
    studentname: ['studentname', 'student_name', 'name'],
    attendance: ['attendance', 'attendance_pct', 'att'],
    internalmarks: ['internalmarks', 'internal_marks', 'internals'],
    assignmentmarks: ['assignmentmarks', 'assignment_marks', 'assignments'],
    previousgpa: ['previousgpa', 'previous_gpa', 'previous_cgpa', 'gpa', 'cgpa'],
    predictedresult: ['predictedresult', 'predicted_result', 'result', 'passfail']
  };

  const matchedIndices = {};
  for (const [key, aliases] of Object.entries(requiredNorms)) {
    let foundIndex = -1;
    for (const alias of aliases) {
      if (headerMap[alias] !== undefined) {
        foundIndex = headerMap[alias].index;
        break;
      }
    }
    if (foundIndex !== -1) {
      matchedIndices[key] = foundIndex;
    } else {
      missingHeaders.push(key);
    }
  }

  if (missingHeaders.length > 0) {
    throw new Error(`Invalid dataset format! Missing required columns: ${missingHeaders.join(', ')}. Standard required headers: Student_ID, Student_Name, Attendance, Internal_Marks, Assignment_Marks, Previous_GPA, Predicted_Result.`);
  }

  const records = [];
  const seenStudentIds = new Set();
  let duplicateCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < rawHeaders.length) continue;

    const studentId = cols[matchedIndices.studentid] || `STU${i}`;
    if (seenStudentIds.has(studentId)) {
      duplicateCount++;
      continue; // Skip duplicate records
    }
    seenStudentIds.add(studentId);

    const attendance = parseFloat(cols[matchedIndices.attendance]) || 75;
    const internalMarks = parseFloat(cols[matchedIndices.internalmarks]) || 70;
    const assignmentScores = parseFloat(cols[matchedIndices.assignmentmarks]) || 75;
    const previousSemesterCGPA = parseFloat(cols[matchedIndices.previousgpa]) || 7.5;
    const rawResult = (cols[matchedIndices.predictedresult] || 'Pass').toLowerCase();
    const predictedPerformance = rawResult.includes('pass') || rawResult.includes('1') ? 'Pass' : 'Fail';

    // Derive predicted grade based on score heuristics
    const score = (0.3 * internalMarks + 0.2 * assignmentScores + 0.4 * (previousSemesterCGPA * 10) + 0.1 * attendance);
    let predictedGrade = 'F';
    if (score >= 85) predictedGrade = 'A+';
    else if (score >= 75) predictedGrade = 'A';
    else if (score >= 65) predictedGrade = 'B';
    else if (score >= 50) predictedGrade = 'C';
    else if (score >= 40) predictedGrade = 'D';

    records.push({
      studentId,
      studentName: cols[matchedIndices.studentname] || `Student ${i}`,
      department: 'Computer Science',
      semester: 6,
      attendance,
      internalMarks,
      assignmentScores,
      studyHours: Math.round((attendance / 15) * 10) / 10,
      previousSemesterCGPA,
      practicalMarks: Math.min(100, Math.round(internalMarks * 1.05)),
      projectMarks: Math.min(100, Math.round(assignmentScores * 1.08)),
      predictedPerformance,
      predictedGrade
    });
  }

  // Calculate Dataset Statistics
  let sumAtt = 0, sumInt = 0, sumAss = 0, sumCGPA = 0, passCount = 0;
  records.forEach(r => {
    sumAtt += r.attendance;
    sumInt += r.internalMarks;
    sumAss += r.assignmentScores;
    sumCGPA += r.previousSemesterCGPA;
    if (r.predictedPerformance === 'Pass') passCount++;
  });

  const count = records.length;
  const stats = {
    totalStudents: count,
    duplicatesRemoved: duplicateCount,
    avgAttendance: count > 0 ? parseFloat((sumAtt / count).toFixed(2)) : 0,
    avgInternalMarks: count > 0 ? parseFloat((sumInt / count).toFixed(2)) : 0,
    avgAssignmentScores: count > 0 ? parseFloat((sumAss / count).toFixed(2)) : 0,
    avgPreviousCGPA: count > 0 ? parseFloat((sumCGPA / count).toFixed(2)) : 0,
    passPercentage: count > 0 ? parseFloat(((passCount / count) * 100).toFixed(2)) : 0,
    failPercentage: count > 0 ? parseFloat((((count - passCount) / count) * 100).toFixed(2)) : 0
  };

  return { records, stats };
}

module.exports = { parseCSVString, REQUIRED_HEADERS };
