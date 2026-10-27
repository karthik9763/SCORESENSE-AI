# SCORESENSE AI - Full-Stack Deployment Guide (Render + Vercel)

This production deployment guide details the step-by-step setup to host **SCORESENSE AI**:
- **Backend API Server**: [Render](https://render.com) (Node.js Express + DNN Evaluator)
- **Frontend SPA**: [Vercel](https://vercel.com) (React.js + TailwindCSS + Chart.js)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud DB)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in or create an account.
2. Create a free **M0 Shared Cluster**.
3. In the Atlas dashboard:
   - Navigate to **Security** -> **Database Access** -> **Add New Database User**. Choose username (e.g., `admin`) and password.
   - Navigate to **Security** -> **Network Access** -> **Add IP Address** -> Select **Allow Access From Anywhere** (`0.0.0.0/0`).
4. Click **Database** -> **Connect** -> **Drivers** (Node.js).
5. Copy your connection URI string. It looks like:
   ```env
   mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/student_performance_db?retryWrites=true&w=majority
   ```

---

## 🚀 Step 2: Deploy Backend to Render

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `https://github.com/karthik9763/SCORESENSE-AI`.
4. Configure the Web Service settings:
   - **Name**: `scoresense-ai-backend` (or your preferred name)
   - **Region**: Closest to you (e.g., *Singapore*, *Oregon*, or *Frankfurt*)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Expand **Environment Variables** and add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production environment mode |
   | `PORT` | `10000` | Render internal port |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | `scoresense_prod_super_secret_jwt_key_2026` | Secure random key |
   | `JWT_EXPIRE` | `7d` | Token lifetime |
6. Click **Create Web Service**.
7. Wait 2-3 minutes for the build and deployment. Once live, Render will provide your Backend URL:
   - Example: `https://scoresense-ai-backend.onrender.com`
   - Verify health at: `https://scoresense-ai-backend.onrender.com/` (should return JSON status `"API Service Active"`).

*(Optional: To seed the 5,000 students in Render, open Render **Shell** tab and run `npm run seed`)*

---

## ⚡ Step 3: Deploy Frontend to Vercel

1. Log into [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `karthik9763/SCORESENSE-AI`.
4. Configure the Project:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: Click *Edit* and select `client` (or leave as root; the included `vercel.json` handles both).
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `REACT_APP_API_URL` | `https://your-backend-name.onrender.com/api` |
   *(Replace with your actual Render URL from Step 2 followed by `/api`)*
6. Click **Deploy**.
7. In ~60 seconds, Vercel will provide your live URL (e.g. `https://scoresense-ai.vercel.app`).

---

## 🔄 Step 4: Verify Full-Stack Integration

1. Open your live Vercel URL in your browser.
2. Sign in with the Administrator or Student credentials:
   - **Admin**: `admin@college.edu` / `admin123`
   - **Student**: `student@college.edu` / `student123`
3. Test a DNN prediction on the **Predict** page.
4. Download a PDF report to ensure client generation works seamlessly in production.
