# REST API Specifications & Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register Account
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Karthik Sharma",
  "email": "karthik@college.edu",
  "password": "password123",
  "role": "Student",
  "registerNumber": "REG20250089",
  "department": "Computer Science",
  "semester": 6
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f123456789...",
    "name": "Karthik Sharma",
    "email": "karthik@college.edu",
    "role": "Student",
    "registerNumber": "REG20250089",
    "department": "Computer Science",
    "semester": 6
  }
}
```

### 1.2 User Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "student@college.edu",
  "password": "student123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### 1.3 Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Access**: Private (Requires `Authorization: Bearer <token>`)

---

## 2. Student Endpoints (`/api/student`)

### 2.1 Generate DNN Prediction
- **Endpoint**: `POST /api/student/predict`
- **Access**: Private
- **Request Body**:
```json
{
  "studentName": "Alex Johnson",
  "registerNumber": "REG20250042",
  "department": "Computer Science",
  "semester": 6,
  "attendance": 88,
  "internalMarks": 82,
  "assignmentMarks": 85,
  "studyHours": 6.5,
  "previousGPA": 8.4,
  "practicalMarks": 88,
  "projectMarks": 90,
  "extraActivities": "Yes"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "prediction": {
    "passFail": "Pass",
    "grade": "A+",
    "compositeScore": 87.4,
    "confidenceScore": 98.6,
    "probabilityScore": 0.986,
    "performanceLevel": "Outstanding / High Distinction",
    "suggestions": [
      "🌟 Exceptional academic metrics! Continue your current study regimen."
    ]
  }
}
```

### 2.2 Get Prediction History
- **Endpoint**: `GET /api/student/history`
- **Access**: Private

### 2.3 Delete Prediction History Record
- **Endpoint**: `DELETE /api/student/history/:id`
- **Access**: Private

---

## 3. Admin Endpoints (`/api/admin`)

### 3.1 Get System Metrics Dashboard
- **Endpoint**: `GET /api/admin/dashboard-stats`
- **Access**: Private (Admin Role Required)

### 3.2 List All Registered Users
- **Endpoint**: `GET /api/admin/users?search=alex&department=Computer+Science`
- **Access**: Private (Admin Role Required)

### 3.3 Delete User Account
- **Endpoint**: `DELETE /api/admin/users/:id`
- **Access**: Private (Admin Role Required)

### 3.4 Export 5,000 Dataset CSV
- **Endpoint**: `GET /api/admin/export-csv`
- **Access**: Private (Admin Role Required)
- **Response**: CSV File Stream (`Content-Disposition: attachment; filename=Student_Performance_Dataset_5000.csv`)
