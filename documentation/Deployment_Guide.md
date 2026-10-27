# Full-Stack Deployment Guide

This guide outlines step-by-step instructions to deploy the **EduTrack AI** application:
- **Frontend**: Netlify
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 1. Database Deployment: MongoDB Atlas

1. Log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free M0 Shared Cluster.
3. Under **Database Access**, create a user `dbAdmin` with a strong password.
4. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** -> **Drivers** and copy your connection URI string:
   ```env
   mongodb+srv://dbAdmin:<password>@cluster0.mongodb.net/student_performance_db?retryWrites=true&w=majority
   ```

---

## 2. Backend Deployment: Render.com

1. Push your project repository to GitHub.
2. Log into [Render.com](https://render.com) and click **New +** -> **Web Service**.
3. Select your GitHub repository and set Root Directory to `server`.
4. Configure Build and Start Settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGO_URI`: `<Your MongoDB Atlas Connection URI>`
   - `JWT_SECRET`: `<Your Random 64-char Secret Key>`
   - `NODE_ENV`: `production`
6. Click **Create Web Service**. Copy your deployed URL (e.g. `https://student-performance-api.onrender.com`).

---

## 3. Frontend Deployment: Netlify

1. Update `client/src/context/AuthContext.js` and page API endpoints to point to your Render backend URL.
2. Build the React production bundle locally:
   ```bash
   cd client
   npm run build
   ```
3. Create a `_redirects` file inside `client/public/`:
   ```text
   /* /index.html 200
   ```
4. Log into [Netlify](https://www.netlify.com).
5. Drag and drop the `client/build/` directory into Netlify Sites dashboard or connect your GitHub repository.
6. Set Build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
7. Click **Deploy Site**.
