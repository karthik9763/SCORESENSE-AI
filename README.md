# Student Performance Prediction Using Deep Neural Network and Modern Web Programming

[![Model Accuracy](https://img.shields.io/badge/DNN%20Accuracy-99.64%25-brightgreen)](https://github.com/)
[![React](https://img.shields.io/badge/Frontend-React.js%2018-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Express.js%204-green)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-emerald)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

A production-ready, full-stack college mini project combining a 4-Layer Sequential Deep Neural Network (DNN) written with TensorFlow/Keras, Node.js Express REST API server with JWT authentication & MongoDB database, and a React SPA frontend UI with responsive glassmorphism design, dark mode, interactive charts, and PDF report downloads.

---

## 📁 Repository Folder Structure

```text
c:\Users\Karthik\OneDrive\Desktop\DNN&MWP/
├── client/                     # React.js Single Page Application Frontend
│   ├── public/                 # HTML templates & static assets
│   └── src/
│       ├── components/         # Navbar, Footer, ProtectedRoute, Toast, PDFReportModal
│       ├── context/            # AuthContext & ThemeContext
│       ├── pages/              # 12 Pages (Landing, Login, Register, Dashboard, Predict, etc.)
│       ├── index.css           # Glassmorphism design tokens & dark/light theme CSS
│       ├── App.js              # React Router SPA routing configuration
│       └── index.js            # React DOM rendering entry point
│
├── server/                     # Node.js Express REST API Backend
│   ├── config/                 # MongoDB database connector (db.js)
│   ├── middleware/             # JWT Auth protection & RBAC middleware
│   ├── models/                 # Mongoose Schemas (User, Prediction, Admin, Log)
│   ├── routes/                 # Auth, Student & Admin API routes
│   ├── utils/                  # DNN Prediction neural evaluator (dnnPredictor.js)
│   ├── seed.js                 # Database seeder script (populates admin & demo student)
│   └── server.js               # Express application entry point
│
├── ml_model/                   # Machine Learning Deep Neural Network Pipeline
│   ├── train_model.py          # TensorFlow/Keras DNN training script
│   ├── train_model.js          # Standalone Node.js neural evaluation trainer
│   ├── predict_api.py          # Python inference CLI & REST prediction bridge
│   ├── scaler.json             # Feature standardizer mean & scale parameters
│   ├── model_metrics.json      # Accuracy, Precision, Recall & Confusion Matrix logs
│   └── plots/                  # Loss progression & confusion matrix PNG plots
│
├── dataset/                    # Synthetic & Empirical Student Academic Records
│   ├── generate_dataset.py     # Python 5,000 synthetic dataset generator
│   ├── generate_dataset.js     # Node.js dataset generator
│   └── student_performance_5000.csv # Generated 5,000 student CSV records
│
├── documentation/              # Major Project Documentation & Viva Resources
│   ├── IEEE_Project_Report.md  # IEEE-style Project Report (60-80 page structure)
│   ├── Presentation_PPT_Content.md # 15-Slide PowerPoint Deck & Demo Script
│   ├── Viva_Questions_50.md    # 50 Technical Viva Questions & Answers
│   ├── API_Documentation.md    # REST API endpoints & JSON payloads
│   └── Deployment_Guide.md     # Netlify, Render & Atlas deployment guide
│
└── README.md                   # Project overview & execution guide
```

---

## ⚡ Quick Start & Execution Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Python 3.8+ (Optional, Python/TensorFlow environment)
- MongoDB (Optional, local instance or MongoDB Atlas string; app includes automatic fallback)

---

### Step 1: Generate 5,000 Student Dataset & Train DNN Model
```bash
# Option A: Train via Node.js neural engine
node dataset/generate_dataset.js
node ml_model/train_model.js

# Option B: Train via Python TensorFlow/Keras
python dataset/generate_dataset.py
python ml_model/train_model.py
```

---

### Step 2: Launch Express Backend Server
```bash
cd server
npm install
npm run seed     # Seeds default admin & student demo credentials
npm start        # Launches Express server on http://localhost:5000
```

---

### Step 3: Launch React Frontend Application
```bash
cd ../client
npm install
npm start        # Launches React client on http://localhost:3000
```

---

## 🔑 One-Click Demo Login Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Student** | `student@college.edu` | `student123` | Student Dashboard, Predictor, PDF Reports, History, Suggestions |
| **Admin** | `admin@college.edu` | `admin123` | Admin Panel, User Search/Delete, 5000 CSV Export, System Analytics |

---

## 🧠 Deep Neural Network Architecture & Accuracy

| Metric | Score |
| :--- | :--- |
| **Validation Accuracy** | **99.64%** |
| **Precision** | **99.74%** |
| **Recall** | **99.82%** |
| **F1-Score** | **99.78%** |
| **Neural Layers** | 4 Sequential Layers (Dense 64 -> BatchNorm -> Dense 32 -> Dropout 0.3 -> Dense 16 -> Sigmoid 1) |

---

## 🌟 Key Application Features

1. **12 Academic Parameter Form**: Captures Name, Reg No, Department, Semester, Attendance %, Internal Marks, Assignment Marks, Study Hours, Previous GPA, Practical Marks, Project Marks, Extra Activities.
2. **Instant DNN Prediction**: Calculates Pass/Fail probability, grade (A+, A, B, C, D, F), confidence score, and AI recommendations.
3. **PDF Report Export**: Downloads printable student evaluation reports.
4. **Interactive Analytics**: Chart.js Line, Bar, and Pie graphs displaying score trends.
5. **Glassmorphism Design**: Frosted glass UI with dark/light mode toggle.
6. **5,000 Dataset Management**: Admin panel allows searching, filtering, user deletion, and CSV downloading.

---

## 📜 License
This project is open-source under the MIT License.
