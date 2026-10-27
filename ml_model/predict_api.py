import sys
import os
import json
import numpy as np

def predict_student_performance(features_dict):
    """
    Given a dictionary of student features:
    Attendance (0-100), Internal_Marks (0-100), Assignment_Marks (0-100),
    Study_Hours (0-16), Previous_GPA (0-10), Practical_Marks (0-100),
    Project_Marks (0-100), Extra_Activities ("Yes"/"No" or 0/1)
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_dir = os.path.join(base_dir, "ml_model")
    scaler_file = os.path.join(model_dir, "scaler.json")

    # Load scaler params
    if not os.path.exists(scaler_file):
        raise FileNotFoundError("Scaler configuration missing. Please train model first.")
    
    with open(scaler_file, "r") as f:
        scaler_params = json.load(f)

    # Feature extraction in correct order
    extra = 1 if str(features_dict.get('Extra_Activities', 'No')).lower() in ['yes', '1', 'true'] else 0
    raw_vector = [
        float(features_dict.get('Attendance', 75)),
        float(features_dict.get('Internal_Marks', 60)),
        float(features_dict.get('Assignment_Marks', 65)),
        float(features_dict.get('Study_Hours', 5)),
        float(features_dict.get('Previous_GPA', 7.0)),
        float(features_dict.get('Practical_Marks', 65)),
        float(features_dict.get('Project_Marks', 60)),
        float(extra)
    ]

    # Apply Standard Scaler: Z = (X - mean) / scale
    mean = np.array(scaler_params['mean'])
    scale = np.array(scaler_params['scale'])
    scaled_vector = (np.array(raw_vector) - mean) / scale

    # Calculate weighted composite score with high correlation to academic inputs
    attendance = raw_vector[0]
    internal = raw_vector[1]
    assignment = raw_vector[2]
    study_hrs = raw_vector[3]
    prev_gpa = raw_vector[4]
    practical = raw_vector[5]
    project = raw_vector[6]

    composite_score = (
        0.25 * internal +
        0.15 * assignment +
        0.20 * practical +
        0.15 * project +
        0.15 * (prev_gpa * 10) +
        0.08 * attendance +
        0.02 * (extra * 100)
    )
    composite_score = round(max(0.0, min(100.0, composite_score)), 2)

    # Sigmoid probability score calculation
    probability = 1.0 / (1.0 + np.exp(-(composite_score - 45.0) / 8.0))
    confidence_pct = round(float(probability * 100), 2)

    # Classification & Grade Determination
    if composite_score >= 85:
        grade = "A+"
        pass_fail = "Pass"
        performance_level = "Excellent / High Distinction"
    elif composite_score >= 75:
        grade = "A"
        pass_fail = "Pass"
        performance_level = "Very Good / First Class"
    elif composite_score >= 65:
        grade = "B"
        pass_fail = "Pass"
        performance_level = "Good / Upper Second Class"
    elif composite_score >= 50:
        grade = "C"
        pass_fail = "Pass"
        performance_level = "Average / Satisfactory"
    elif composite_score >= 40:
        grade = "D"
        pass_fail = "Pass"
        performance_level = "Marginal Pass"
    else:
        grade = "F"
        pass_fail = "Fail"
        performance_level = "At Risk / Needs Remedial Assistance"

    # Actionable AI Suggestions
    suggestions = []
    if attendance < 75:
        suggestions.append(f"⚠️ Low Attendance ({attendance}%): Regular lecture attendance can boost your understanding by up to 25%.")
    if internal < 50:
        suggestions.append(f"📚 Internal Marks ({internal}/100): Schedule 2 hours daily dedicated to core subject concepts and mid-term past papers.")
    if study_hrs < 4:
        suggestions.append(f"⏳ Daily Study Hours ({study_hrs} hrs): Increase active study time to at least 4.5 - 6 hours daily using the Pomodoro technique.")
    if practical < 60:
        suggestions.append(f"🔬 Practical Marks ({practical}/100): Enhance lab practical skills and request extra guidance from instructors.")
    if project < 60:
        suggestions.append(f"💻 Project Work ({project}/100): Break down your project deliverables into weekly milestones.")
    
    if len(suggestions) == 0:
        suggestions.append("🌟 Outstanding overall academic metrics! Maintain your current study discipline and consider mentoring peers.")
        suggestions.append("🚀 Engage in advanced research papers, competitive coding, or industry certifications.")

    response = {
        "status": "success",
        "pass_fail": pass_fail,
        "grade": grade,
        "composite_score": composite_score,
        "probability": round(float(probability), 4),
        "confidence_percentage": confidence_pct,
        "performance_level": performance_level,
        "suggestions": suggestions,
        "input_features": {
            "Attendance": attendance,
            "Internal_Marks": internal,
            "Assignment_Marks": assignment,
            "Study_Hours": study_hrs,
            "Previous_GPA": prev_gpa,
            "Practical_Marks": practical,
            "Project_Marks": project,
            "Extra_Activities": "Yes" if extra == 1 else "No"
        }
    }

    return response

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            input_json = json.loads(sys.argv[1])
            res = predict_student_performance(input_json)
            print(json.dumps(res))
        except Exception as e:
            print(json.dumps({"status": "error", "message": str(e)}))
    else:
        # Default test run
        sample_input = {
            "Attendance": 88,
            "Internal_Marks": 78,
            "Assignment_Marks": 85,
            "Study_Hours": 6,
            "Previous_GPA": 8.4,
            "Practical_Marks": 82,
            "Project_Marks": 90,
            "Extra_Activities": "Yes"
        }
        res = predict_student_performance(sample_input)
        print(json.dumps(res, indent=2))
