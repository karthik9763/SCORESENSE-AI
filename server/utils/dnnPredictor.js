const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

function executeDNNPrediction(inputData) {
  return new Promise((resolve) => {
    const parseValue = (val, defaultVal = 0) => {
      if (val === undefined || val === null || val === '') return defaultVal;
      const num = parseFloat(val);
      return isNaN(num) ? defaultVal : num;
    };

    // Parse the 3 key semester evaluation marks
    const internalMarks = parseValue(inputData.internalMarks ?? inputData.Internal_Marks, 0);
    const assignmentMarks = parseValue(inputData.assignmentMarks ?? inputData.Assignment_Marks, 0);
    const semesterMarks = parseValue(inputData.semesterMarks ?? inputData.Semester_Marks, 0);

    // non-mark metadata fields
    const attendance = parseValue(inputData.attendance ?? inputData.Attendance, 75);
    const studyHours = parseValue(inputData.studyHours ?? inputData.Study_Hours, 5);
    const previousGPA = parseValue(inputData.previousGPA ?? inputData.Previous_GPA, 7.5);
    const practicalMarks = parseValue(inputData.practicalMarks ?? inputData.Practical_Marks, 70);
    const projectMarks = parseValue(inputData.projectMarks ?? inputData.Project_Marks, 75);
    const extraActivities = (inputData.extraActivities || inputData.Extra_Activities || 'No') === 'Yes' ? 'Yes' : 'No';

    // Calculate prediction composite score STRICTLY from semester marks (Internal, Assignment, Semester Examination)
    const compositeScore = parseFloat(((internalMarks + assignmentMarks + semesterMarks) / 3.0).toFixed(2));
    const finalScore = Math.min(100.0, Math.max(0.0, compositeScore));

    // Analyze criteria across all three semester marks (Passing criterion: >= 50 in each evaluation)
    const failingMarks = [];
    if (internalMarks < 50) failingMarks.push(`Internal Marks (${internalMarks}/100)`);
    if (assignmentMarks < 50) failingMarks.push(`Assignment Marks (${assignmentMarks}/100)`);
    if (semesterMarks < 50) failingMarks.push(`Semester Marks (${semesterMarks}/100)`);

    const hasFailedCriteria = failingMarks.length > 0 || finalScore < 50;

    let passFail = "Fail";
    let grade = "F";
    let performanceLevel = "";
    let probabilityScore = null;
    let confidenceScore = null;

    if (hasFailedCriteria) {
      passFail = "Fail";
      grade = "F";
      performanceLevel = `Fail - Failed subject criteria (< 50 marks) in: ${failingMarks.join(', ')}`;
      // Strictly do NOT provide pass probability score for failed students
      probabilityScore = null;
      confidenceScore = null;
    } else {
      passFail = "Pass";
      if (finalScore >= 85) {
        grade = "A+";
        performanceLevel = "Outstanding / High Distinction";
      } else if (finalScore >= 75) {
        grade = "A";
        performanceLevel = "Very Good / First Class";
      } else if (finalScore >= 65) {
        grade = "B";
        performanceLevel = "Good / Upper Second Class";
      } else {
        grade = "C";
        performanceLevel = "Satisfactory Pass";
      }

      // Compute pass probability percentage strictly for passed criteria
      const z = (finalScore - 50.0) / 7.5;
      const probability = 1.0 / (1.0 + Math.exp(-z));
      probabilityScore = parseFloat(probability.toFixed(4));
      confidenceScore = parseFloat((probability * 100).toFixed(2));
    }

    // Actionable AI Suggestions based on analysis of semester marks
    const suggestions = [];
    if (hasFailedCriteria) {
      suggestions.push(`🔴 FAIL CRITERIA ANALYSIS: Must secure at least 50/100 in all semester evaluations. Failed mark(s): ${failingMarks.join(', ')}.`);
      if (internalMarks < 50) {
        suggestions.push(`📚 Internal Assessment (${internalMarks}/100): Attend remedial lectures and prepare for mid-term re-evaluations.`);
      }
      if (assignmentMarks < 50) {
        suggestions.push(`📝 Assignment Marks (${assignmentMarks}/100): Submit all overdue coursework and problem sets.`);
      }
      if (semesterMarks < 50) {
        suggestions.push(`🔬 Semester Examination Marks (${semesterMarks}/100): Focus on core syllabus topics and past exam papers.`);
      }
    } else {
      suggestions.push("🌟 PASS: All 3 semester mark criteria satisfy passing requirements! Maintain your study regimen.");
      suggestions.push("🚀 Participate in advanced technical workshops and semester capstone project challenges.");
    }

    const result = {
      passFail,
      grade,
      compositeScore: finalScore,
      confidenceScore,
      probabilityScore,
      performanceLevel,
      suggestions,
      failingMarks,
      inputs: {
        studentName: inputData.studentName || 'Student',
        registerNumber: inputData.registerNumber || 'REG20250001',
        department: inputData.department || 'Computer Science',
        semester: Number(inputData.semester || 6),
        attendance,
        internalMarks,
        assignmentMarks,
        studyHours,
        previousGPA,
        practicalMarks,
        projectMarks,
        semesterMarks,
        extraActivities
      }
    };

    resolve(result);
  });
}

module.exports = { executeDNNPrediction };
