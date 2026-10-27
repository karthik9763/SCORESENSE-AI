# 50 Technical Viva Questions and Answers

## Section 1: Deep Learning & Machine Learning (Q1 – Q15)

### Q1: What is a Deep Neural Network (DNN)?
**Answer**: A Deep Neural Network is an artificial neural network containing an input layer, an output layer, and multiple hidden layers. It uses non-linear activation functions to learn complex hierarchical representations from input features.

### Q2: Why did you choose a DNN over traditional machine learning algorithms like Decision Trees or Logistic Regression?
**Answer**: Academic student performance involves non-linear interactions among attendance, study habits, internal marks, and practical scores. DNNs automatically learn complex feature combinations without manual feature engineering, achieving superior accuracy (99.64%).

### Q3: What activation functions are used in your model and why?
**Answer**:
- **ReLU (Rectified Linear Unit)**: Used in hidden layers to introduce non-linearity while mitigating the vanishing gradient problem.
- **Sigmoid**: Used in the output layer to map continuous neural activations into a probability score between 0.0 and 1.0.

### Q4: What is the purpose of Batch Normalization?
**Answer**: Batch Normalization normalizes layer inputs by re-centering and re-scaling across batches. It stabilizes neural network training, accelerates convergence, and allows higher learning rates.

### Q5: Why did you include Dropout layers in your DNN architecture?
**Answer**: Dropout randomly deactivates a fraction of neurons (30% in our model) during each training forward pass. This prevents neurons from co-adapting, acting as a powerful regularization technique to eliminate over-fitting.

### Q6: What loss function is used for binary classification in TensorFlow/Keras?
**Answer**: Binary Cross-Entropy loss:
\[
\mathcal{L}(y, \hat{y}) = -[y \log(\hat{y}) + (1-y) \log(1-\hat{y})]
\]

### Q7: What is Feature Scaling and why is StandardScaler required?
**Answer**: Feature scaling ensures features with larger numerical ranges (e.g., Attendance 40-100%) do not dominate features with smaller ranges (e.g., Study Hours 0.5-16). `StandardScaler` transforms features to have zero mean and unit variance (\( Z = \frac{X - \mu}{\sigma} \)).

### Q8: What optimizer was chosen for training the DNN?
**Answer**: The Adam (Adaptive Moment Estimation) optimizer with a learning rate of 0.001. Adam combines the advantages of AdaGrad and RMSProp for stochastic gradient descent.

### Q9: What is an Early Stopping callback?
**Answer**: Early Stopping monitors validation loss during training and halts training if loss fails to improve for a specified number of consecutive epochs (patience = 10), preventing over-training.

### Q10: How did you handle train-test data splitting?
**Answer**: Using `train_test_split` with an 80/20 ratio and stratified sampling based on target labels to maintain class balance across training and evaluation splits.

### Q11: Explain Precision vs Recall.
**Answer**:
- **Precision**: Proportion of true positive predictions among all positive predictions (\( TP / (TP + FP) \)).
- **Recall**: Proportion of true positive predictions among all actual positive samples (\( TP / (TP + FN) \)).

### Q12: What is an F1-Score?
**Answer**: F1-Score is the harmonic mean of Precision and Recall: \( F1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}} \).

### Q13: What does the Confusion Matrix tell us about your model?
**Answer**: The Confusion Matrix displays True Positives, True Negatives, False Positives, and False Negatives, giving a complete breakdown of classification errors.

### Q14: How does the model convert continuous probability into letter grades?
**Answer**: Probability is converted into a composite academic score (0-100), then mapped to grades: A+ (>=85), A (75-84), B (65-74), C (50-64), D (40-49), F (<40).

### Q15: How were synthetic data correlation parameters determined?
**Answer**: Academic domain weighting rules were applied (Internal 25%, Practical 20%, Assignment 15%, Project 15%, GPA 15%, Attendance 8%, Extra 2%) with Gaussian noise.

---

## Section 2: Web Engineering & React Frontend (Q16 – Q30)

### Q16: What is React.js and why is it used for this project?
**Answer**: React is an open-source JavaScript library for building user interfaces based on components. It utilizes a Virtual DOM for efficient rendering and state updates.

### Q17: What is single-page application (SPA) routing?
**Answer**: SPA routing (via `react-router-dom`) dynamically rewrites the client UI without performing full web browser page reloads, providing a desktop-like user experience.

### Q18: What is React Context API and how is it used here?
**Answer**: Context API manages global application state without prop-drilling. We created `AuthContext` (JWT & user state) and `ThemeContext` (Dark/Light mode state).

### Q19: What is Glassmorphism CSS?
**Answer**: Glassmorphism is a UI design pattern using translucent background colors (`rgba()`) combined with backdrop blurring filters (`backdrop-filter: blur(16px)`) to create frosted glass visual depth.

### Q20: How is Dark/Light mode state persisted across browser sessions?
**Answer**: Via `localStorage.getItem('theme')` combined with `document.documentElement.setAttribute('data-theme', theme)` in `ThemeContext`.

### Q21: What is Axios and why is it preferred over fetch()?
**Answer**: Axios is a promise-based HTTP client that automatically transforms JSON data, supports request/response interceptors, and provides clean error handling.

### Q22: What is a Protected Route component in React?
**Answer**: A higher-order wrapper component that checks user authentication and role permissions before rendering target page elements, redirecting unauthenticated users to `/login`.

### Q23: How are interactive graphs rendered on the React frontend?
**Answer**: Using `Chart.js` and `react-chartjs-2` wrapper components for rendering responsive Line, Bar, and Pie chart canvas elements.

### Q24: How does PDF report export function?
**Answer**: The report component renders structured student metrics inside a modal and triggers browser print rendering via `window.print()`, formatted with clean CSS print styles.

### Q25: What is the purpose of controlled form inputs in React?
**Answer**: Controlled inputs bind HTML input values directly to React state hooks (`useState`), allowing instant validation and dynamic UI updates.

### Q26: What is a Toast notification?
**Answer**: A non-intrusive floating popup alert displaying success, warning, or error messages with auto-dismiss timers.

### Q27: Why use CSS custom variables (`:root`)?
**Answer**: CSS variables enable dynamic design token swapping (backgrounds, borders, text colors) when switching between dark and light themes.

### Q28: How is state lifted in React?
**Answer**: Passing state variables and update functions from parent components to child components via props or global Context providers.

### Q29: What is React `useEffect` hook?
**Answer**: A hook used for handling side effects like data fetching from REST endpoints, DOM manipulation, or event listeners on component mounting.

### Q30: What is component lazy loading?
**Answer**: Deferring component code loading until required by route navigation to optimize initial page load speed.

---

## Section 3: Node.js, Express & Database (Q31 – Q45)

### Q31: What is Node.js?
**Answer**: Node.js is a cross-platform asynchronous event-driven JavaScript runtime built on Chrome's V8 engine for executing server-side JavaScript code.

### Q32: What is Express.js?
**Answer**: Express is a minimal and flexible Node.js web application framework providing robust middleware and routing features for RESTful API creation.

### Q33: What is JWT (JSON Web Token)?
**Answer**: JWT is a compact, URL-safe standard (RFC 7519) for transmitting secure claims between parties using digital signatures (HMAC SHA-256).

### Q34: What is bcrypt and why is it used?
**Answer**: `bcryptjs` is a key-derivation password-hashing algorithm utilizing salt rounds to protect user passwords against rainbow table and brute-force attacks.

### Q35: What is MongoDB and Mongoose?
**Answer**: MongoDB is a NoSQL document database storing data in flexible JSON-like BSON documents. Mongoose is an Object Data Modeling (ODM) library providing schema validation.

### Q36: What is CORS and how is it configured?
**Answer**: Cross-Origin Resource Sharing (CORS) is a HTTP-header based security mechanism. Express enables it via `cors()` middleware to allow React frontend requests.

### Q37: What is Helmet middleware?
**Answer**: Helmet secures Express apps by setting various HTTP headers (X-Frame-Options, X-XSS-Protection, Strict-Transport-Security).

### Q38: What is Express Rate Limiting?
**Answer**: Middleware (`express-rate-limit`) that caps the maximum number of requests allowed from a single IP address within a given time window (e.g., 300 requests / 15 mins).

### Q39: What is Role-Based Access Control (RBAC)?
**Answer**: Restricting resource access based on user roles (`Student` vs `Admin`). Admin routes require `authorize('Admin')` middleware validation.

### Q40: What happens if MongoDB service is unavailable?
**Answer**: The custom `db.js` connector catches connection errors gracefully and switches to an in-memory fallback store so application endpoints remain 100% functional.

### Q41: What HTTP methods are used in REST API routes?
**Answer**: `GET` (retrieve), `POST` (create), `PUT` (update), `DELETE` (remove).

### Q42: What is environment variable management (`dotenv`)?
**Answer**: Storing sensitive parameters (database URIs, JWT secrets, port numbers) outside codebase repository files in a `.env` file.

### Q43: How is Python DNN model integrated with Node.js backend?
**Answer**: Node executes Python inference scripts via `child_process.exec` or calculates scaled weight matrix forward pass natively inside `dnnPredictor.js`.

### Q44: What is a database Index in Mongoose?
**Answer**: A data structure that improves the speed of data retrieval operations on a database collection at the cost of additional storage (e.g., `unique: true` on `email`).

### Q45: What is database seeding?
**Answer**: Programmatically pre-populating a fresh database with initial default data (admin account, demo student, sample predictions).

---

## Section 4: Testing & Deployment (Q46 – Q50)

### Q46: How do you test REST API endpoints?
**Answer**: Using tools like Postman, cURL, or automated integration scripts testing HTTP status codes (200 OK, 201 Created, 401 Unauthorized, 403 Forbidden).

### Q47: How is the React application deployed to Netlify?
**Answer**: Compiling the production bundle (`npm run build`) and uploading the `build/` directory with a `_redirects` file (`/* /index.html 200`) for SPA routing.

### Q48: How is the Node backend deployed to Render?
**Answer**: Configuring a Node web service connected to GitHub, setting build command `npm install` and start command `npm start` with environment variables.

### Q49: What is MongoDB Atlas?
**Answer**: A fully managed cloud database service hosted by MongoDB supporting cluster auto-scaling and connection URIs.

### Q50: How do you maintain dataset security?
**Answer**: Data sanitization, parameterized Mongoose queries preventing SQL/NoSQL injection, and strict authorization middleware enforcement.
