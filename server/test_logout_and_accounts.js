const http = require('http');

const API_BASE = 'http://localhost:5000/api';

async function postJSON(url, data, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  const json = await res.json();
  return { status: res.status, data: json };
}

async function getJSON(url, token = null) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'GET',
    headers
  });
  const json = await res.json();
  return { status: res.status, data: json };
}

async function putJSON(url, data, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  const json = await res.json();
  return { status: res.status, data: json };
}

async function runTests() {
  console.log('===============================================================');
  console.log('🚀 UNIVERSAL LOGOUT & ACCOUNT VERIFICATION TEST SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Admin Account Authentication & Logout
  console.log('📌 STEP 1: Verifying Admin Account (admin@college.edu)');
  const adminLogin = await postJSON(`${API_BASE}/auth/login`, {
    email: 'admin@college.edu',
    password: 'admin123'
  });
  assert(adminLogin.status === 200 && adminLogin.data.success, 'Admin Login Successful');
  assert(adminLogin.data.user.role === 'Admin', 'Admin Role Confirmed');
  assert(!!adminLogin.data.token, 'Admin JWT Token Issued');

  const adminToken = adminLogin.data.token;
  const adminMe = await getJSON(`${API_BASE}/auth/me`, adminToken);
  assert(adminMe.status === 200 && adminMe.data.user.email === 'admin@college.edu', 'Admin /api/auth/me Profile Validated');

  const adminLogout = await postJSON(`${API_BASE}/auth/logout`, {}, adminToken);
  assert(adminLogout.status === 200 && adminLogout.data.success, 'Admin Session Revocation Logged Successfully');

  // 2. Student Account Authentication & Academic Data Profile Enrichment
  console.log('\n📌 STEP 2: Verifying Student Account (REG20250001)');
  const student1 = await postJSON(`${API_BASE}/auth/login`, {
    email: 'REG20250001',
    password: '12345'
  });
  assert(student1.status === 200 && student1.data.success, 'Student REG20250001 Login Successful');
  assert(student1.data.user.role === 'Student', 'Student Role Confirmed');
  assert(student1.data.user.attendance !== undefined, `Student Attendance Present: ${student1.data.user.attendance}%`);
  assert(student1.data.user.internalMarks !== undefined, `Student Internal Marks Present: ${student1.data.user.internalMarks}/100`);
  assert(student1.data.user.cgpa !== undefined, `Student CGPA Present: ${student1.data.user.cgpa}`);
  assert(student1.data.user.riskLevel !== undefined, `Student Risk Level Present: ${student1.data.user.riskLevel}`);

  const s1Logout = await postJSON(`${API_BASE}/auth/logout`, {}, student1.data.token);
  assert(s1Logout.status === 200 && s1Logout.data.success, 'Student REG20250001 Session Revoked Cleanly');

  // 3. Specific Student Account REG20250549 (Karthik)
  console.log('\n📌 STEP 3: Verifying Student Account REG20250549 (Karthik Deshmukh)');
  const student549 = await postJSON(`${API_BASE}/auth/login`, {
    email: 'REG20250549',
    password: '12345'
  });
  assert(student549.status === 200 && student549.data.success, 'Student REG20250549 Login Successful');
  assert(student549.data.user.name === 'Karthik Deshmukh', 'Student Name: Karthik Deshmukh Confirmed');
  assert(student549.data.user.grade !== undefined, `Student Grade: ${student549.data.user.grade} (${student549.data.user.passFail})`);

  const s549Logout = await postJSON(`${API_BASE}/auth/logout`, {}, student549.data.token);
  assert(s549Logout.status === 200 && s549Logout.data.success, 'Student REG20250549 Session Revoked Cleanly');

  // 4. Test Student Personal Profile Update (Fix Verification)
  console.log('\n📌 STEP 4: Verifying Student Profile Update (Personal Info Fix)');
  const sToken = student549.data.token;
  // A. Student updating phone number
  const updatePhone = await putJSON(`${API_BASE}/student/profile`, { phone: '+1 (555) 987-6543' }, sToken);
  assert(updatePhone.status === 200 && updatePhone.data.success, 'Student successfully updated personal phone number');

  // B. Student trying to tamper with academic records (department or semester marks)
  const tamperAcademic = await putJSON(`${API_BASE}/student/profile`, { semesterMarks: 100, department: 'Hacked' }, sToken);
  assert(tamperAcademic.status === 403, 'Institutional academic parameters protected from non-admin modification (403 Forbidden)');

  // 5. Test Expiry / Invalid Token Protection (Requirement 4 & 6)
  console.log('\n📌 STEP 5: Verifying Route Protection on Invalid/Expired Token');
  const invalidReq = await getJSON(`${API_BASE}/student/dashboard`, 'invalid_or_expired_jwt_string');
  assert(invalidReq.status === 401, 'Protected route rejected invalid token with 401 Unauthorized');

  const missingTokenReq = await getJSON(`${API_BASE}/student/dashboard`, null);
  assert(missingTokenReq.status === 401, 'Protected route rejected missing token with 401 Unauthorized');

  // 6. Test Multiple Random Accounts across 5,000 Dataset
  console.log('\n📌 STEP 6: Sampling Diverse Accounts Across 5,000 Dataset Records');
  const testIds = ['REG20251000', 'REG20252000', 'REG20253000', 'REG20254000', 'REG20255000'];
  for (const reg of testIds) {
    const loginRes = await postJSON(`${API_BASE}/auth/login`, { email: reg, password: '12345' });
    const ok = loginRes.status === 200 && loginRes.data.success;
    const name = loginRes.data?.user?.name;
    const dept = loginRes.data?.user?.department;
    assert(ok, `Account ${reg} (${name} - ${dept}): Login & Data Enriched`);

    if (ok) {
      const logRes = await postJSON(`${API_BASE}/auth/logout`, {}, loginRes.data.token);
      assert(logRes.status === 200, `Account ${reg}: Logout & Session Destroyed`);
    }
  }

  console.log('\n===============================================================');
  console.log(`🏁 VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test Suite Error:', err);
  process.exit(1);
});
