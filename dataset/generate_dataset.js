const fs = require('fs');
const path = require('path');

function generateSyntheticDataset(numSamples = 5000, outputPath) {
  const departments = ["Computer Science", "Information Technology", "Electronics & Comm", "Electrical & Elec", "Mechanical Eng"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const firstNames = ["Aarav", "Ananya", "Rohan", "Priya", "Karthik", "Sneha", "Vikram", "Kavya", "Rahul", "Neha", 
                      "Aditya", "Pooja", "Siddharth", "Divya", "Arjun", "Meera", "Yash", "Riya", "Varun", "Isha",
                      "Amit", "Swati", "Nikhil", "Tanvi", "Suresh", "Bhavna", "Manish", "Deepika", "Kunal", "Shreya"];
  const lastNames = ["Sharma", "Verma", "Patel", "Rao", "Nair", "Iyer", "Gupta", "Singh", "Reddy", "Joshi",
                     "Kumar", "Deshmukh", "Chaudhary", "Bhat", "Kulkarni", "Mehta", "Agarwal", "Saxena", "Das", "Pillai"];

  const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomNormal = (mean = 0, stdev = 1) => {
    let u = 1 - Math.random();
    let v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdev + mean;
  };

  const rows = [];
  const headers = [
    "Register_Number", "Student_Name", "Department", "Semester", "Attendance", 
    "Internal_Marks", "Assignment_Marks", "Study_Hours", "Previous_GPA", 
    "Practical_Marks", "Project_Marks", "Extra_Activities", "Final_Score", "Pass_Fail", "Grade"
  ];
  rows.push(headers.join(","));

  for (let i = 1; i <= numSamples; i++) {
    const regNo = `REG2025${String(i).padStart(4, '0')}`;
    const name = `${randomChoice(firstNames)} ${randomChoice(lastNames)}`;
    const dept = randomChoice(departments);
    const sem = randomChoice(semesters);

    let attendance = parseFloat((Math.min(100, Math.max(40, 75 + randomNormal(0, 12)))).toFixed(2));
    let studyHours = parseFloat((Math.min(16, Math.max(0.5, 5.5 + randomNormal(0, 2.5)))).toFixed(1));
    let prevGPA = parseFloat((Math.min(10, Math.max(4.0, 7.2 + randomNormal(0, 1.2)))).toFixed(2));

    let internalMarks = parseFloat((Math.min(100, Math.max(10, 0.4 * attendance + 0.3 * (studyHours * 5) + 0.3 * (prevGPA * 10) + randomNormal(0, 4)))).toFixed(2));
    let assignmentMarks = parseFloat((Math.min(100, Math.max(20, 0.5 * internalMarks + 0.3 * (studyHours * 5) + randomNormal(5, 4)))).toFixed(2));
    let practicalMarks = parseFloat((Math.min(100, Math.max(15, 0.6 * internalMarks + 0.3 * attendance + randomNormal(3, 4)))).toFixed(2));
    let projectMarks = parseFloat((Math.min(100, Math.max(30, 0.4 * prevGPA * 10 + 0.4 * studyHours * 5 + randomNormal(15, 5)))).toFixed(2));
    
    let extraAct = Math.random() > 0.4 ? "Yes" : "No";
    let extraScore = extraAct === "Yes" ? 5 : 0;

    let finalScore = (
      0.25 * internalMarks + 
      0.15 * assignmentMarks + 
      0.20 * practicalMarks + 
      0.15 * projectMarks + 
      0.15 * (prevGPA * 10) + 
      0.08 * attendance + 
      0.02 * extraScore +
      randomNormal(0, 2)
    );
    finalScore = parseFloat(Math.min(100, Math.max(0, finalScore)).toFixed(2));

    let grade = "F";
    let passFail = "Fail";
    if (finalScore >= 85) { grade = "A+"; passFail = "Pass"; }
    else if (finalScore >= 75) { grade = "A"; passFail = "Pass"; }
    else if (finalScore >= 65) { grade = "B"; passFail = "Pass"; }
    else if (finalScore >= 50) { grade = "C"; passFail = "Pass"; }
    else if (finalScore >= 40) { grade = "D"; passFail = "Pass"; }

    rows.push([
      regNo, `"${name}"`, `"${dept}"`, sem, attendance, internalMarks, assignmentMarks,
      studyHours, prevGPA, practicalMarks, projectMarks, extraAct, finalScore, passFail, grade
    ].join(","));
  }

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, rows.join("\n"), "utf-8");
  console.log(`✅ Node dataset generator successfully created ${numSamples} records at: ${outputPath}`);
}

const targetPath = path.join(__dirname, "student_performance_5000.csv");
generateSyntheticDataset(5000, targetPath);
