import csv
import random
import numpy as np
import os

def generate_synthetic_dataset(num_samples=5000, output_path="student_performance_5000.csv"):
    np.random.seed(42)
    random.seed(42)

    departments = ["Computer Science", "Information Technology", "Electronics & Comm", "Electrical & Elec", "Mechanical Eng"]
    semesters = [1, 2, 3, 4, 5, 6, 7, 8]
    extra_activities_options = ["Yes", "No"]

    data = []
    
    first_names = ["Aarav", "Ananya", "Rohan", "Priya", "Karthik", "Sneha", "Vikram", "Kavya", "Rahul", "Neha", 
                   "Aditya", "Pooja", "Siddharth", "Divya", "Arjun", "Meera", "Yash", "Riya", "Varun", "Isha",
                   "Amit", "Swati", "Nikhil", "Tanvi", "Suresh", "Bhavna", "Manish", "Deepika", "Kunal", "Shreya"]
    last_names = ["Sharma", "Verma", "Patel", "Rao", "Nair", "Iyer", "Gupta", "Singh", "Reddy", "Joshi",
                  "Kumar", "Deshmukh", "Chaudhary", "Bhat", "Kulkarni", "Mehta", "Agarwal", "Saxena", "Das", "Pillai"]

    for i in range(1, num_samples + 1):
        reg_no = f"REG2025{i:04d}"
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        dept = random.choice(departments)
        sem = random.choice(semesters)
        
        # Correlated academic variables
        attendance = round(np.random.beta(5, 1.5) * 100, 2)  # Skewed towards 65-100%
        attendance = max(40.0, min(100.0, attendance))
        
        study_hours = round(np.random.gamma(shape=3, scale=1.5), 1) # Avg 4-8 hours
        study_hours = max(0.5, min(16.0, study_hours))

        prev_gpa = round(np.random.normal(loc=7.2, scale=1.2), 2)
        prev_gpa = max(4.0, min(10.0, prev_gpa))

        internal_marks = round(0.4 * attendance + 0.3 * (study_hours * 5) + 0.3 * (prev_gpa * 10) + np.random.normal(0, 5), 2)
        internal_marks = max(10.0, min(100.0, internal_marks))

        assignment_marks = round(0.5 * internal_marks + 0.3 * (study_hours * 5) + np.random.normal(10, 5), 2)
        assignment_marks = max(20.0, min(100.0, assignment_marks))

        practical_marks = round(0.6 * internal_marks + 0.3 * attendance + np.random.normal(5, 4), 2)
        practical_marks = max(15.0, min(100.0, practical_marks))

        project_marks = round(0.4 * prev_gpa * 10 + 0.4 * study_hours * 5 + np.random.normal(20, 8), 2)
        project_marks = max(30.0, min(100.0, project_marks))

        extra_act = random.choice(extra_activities_options)
        extra_score = 5.0 if extra_act == "Yes" else 0.0

        # Weighted calculation of composite performance score (0-100)
        final_score = (
            0.25 * internal_marks + 
            0.15 * assignment_marks + 
            0.20 * practical_marks + 
            0.15 * project_marks + 
            0.15 * (prev_gpa * 10) + 
            0.08 * attendance + 
            0.02 * extra_score +
            np.random.normal(0, 2)
        )
        final_score = round(max(0.0, min(100.0, final_score)), 2)

        # Classification label
        if final_score >= 85:
            grade = "A+"
            pass_fail = "Pass"
        elif final_score >= 75:
            grade = "A"
            pass_fail = "Pass"
        elif final_score >= 65:
            grade = "B"
            pass_fail = "Pass"
        elif final_score >= 50:
            grade = "C"
            pass_fail = "Pass"
        elif final_score >= 40:
            grade = "D"
            pass_fail = "Pass"
        else:
            grade = "F"
            pass_fail = "Fail"

        data.append([
            reg_no, name, dept, sem, attendance, internal_marks, assignment_marks, 
            study_hours, prev_gpa, practical_marks, project_marks, extra_act, final_score, pass_fail, grade
        ])

    headers = [
        "Register_Number", "Student_Name", "Department", "Semester", "Attendance", 
        "Internal_Marks", "Assignment_Marks", "Study_Hours", "Previous_GPA", 
        "Practical_Marks", "Project_Marks", "Extra_Activities", "Final_Score", "Pass_Fail", "Grade"
    ]

    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else ".", exist_ok=True)
    with open(output_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(data)

    print(f"✅ Successfully generated dataset with {num_samples} records at: {output_path}")

if __name__ == "__main__":
    dataset_file = os.path.join(os.path.dirname(__file__), "student_performance_5000.csv")
    generate_synthetic_dataset(5000, dataset_file)
