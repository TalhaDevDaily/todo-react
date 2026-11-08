/**
 * ==============================================================================
 * CENTRAL API SERVICE (src/services/api.js)
 * ==============================================================================
 * This module acts as the single source of truth for all HTTP requests to your
 * upcoming Node.js + Express backend server.
 * 
 * ------------------------------------------------------------------------------
 * 🎓 FOR THE JUNIOR DEVELOPER / BACKEND LEARNER:
 * ------------------------------------------------------------------------------
 * Right now, our React frontend is fully functional using localStorage as a mock
 * database. When you finish building your Express server (usually on http://localhost:5000),
 * you simply set API_BASE_URL to your server's URL and switch the functions below
 * from mock storage to actual fetch() calls!
 * ==============================================================================
 */

// [BACKEND SPOT] Change this URL when your Express server is running (e.g., http://localhost:5000/api)
export const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to retrieve stored auth token from localStorage
 * In production Node.js apps, this is either a JWT token stored here
 * or managed via HTTP-Only Cookies (credentials: 'include').
 */
export const getAuthToken = () => {
  return localStorage.getItem('todo_auth_token') || null;
};

/**
 * Standard fetch wrapper that automatically attaches JSON headers
 * and the JWT Authorization Bearer token if the user is logged in.
 */
export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  // [BACKEND SPOT]
  // In Express:
  // - Make sure you have `app.use(cors({ origin: 'http://localhost:5173', credentials: true }))`
  // - Make sure you have `app.use(express.json())` to parse incoming JSON bodies
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

// ==============================================================================
// AUTHENTICATION API METHODS
// ==============================================================================

/**
 * [BACKEND SPOT]: User Registration
 * ------------------------------------------------------------------------------
 * HTTP Method : POST
 * Endpoint    : /api/auth/register
 * Request Body: { name, email, password }
 * 
 * What happens on your Node.js backend:
 * 1. Validate fields using express-validator, Joi, or Zod.
 * 2. Check if user already exists: `const existingUser = await User.findOne({ email });`
 * 3. Hash the raw password using bcrypt:
 *      const salt = await bcrypt.genSalt(10);
 *      const hashedPassword = await bcrypt.hash(password, salt);
 * 4. Save new user into MongoDB/PostgreSQL: `await User.create({ name, email, password: hashedPassword });`
 * 5. Return HTTP 201 Created with `{ success: true, message: 'User registered' }`.
 */
export async function registerUser({ name, email, password }) {
  // --- REAL BACKEND CALL (Uncomment when Express is ready) ---
  // return request('/auth/register', {
  //   method: 'POST',
  //   body: JSON.stringify({ name, email, password }),
  // });

  // --- LOCAL MOCK (For frontend preview before backend is built) ---
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('todo_mock_users') || '[]');
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return reject(new Error('A user with this email already exists!'));
      }
      const newUser = { id: Date.now().toString(), name, email, password };
      users.push(newUser);
      localStorage.setItem('todo_mock_users', JSON.stringify(users));
      resolve({ success: true, message: 'Account registered successfully!' });
    }, 400);
  });
}

/**
 * [BACKEND SPOT]: User Login
 * ------------------------------------------------------------------------------
 * HTTP Method : POST
 * Endpoint    : /api/auth/login
 * Request Body: { email, password }
 * 
 * What happens on your Node.js backend:
 * 1. Find user by email: `const user = await User.findOne({ email });`
 * 2. If not found, return 401 Unauthorized: "Invalid credentials".
 * 3. Compare passwords using bcrypt:
 *      const isMatch = await bcrypt.compare(password, user.password);
 * 4. If matching, sign a JSON Web Token (JWT):
 *      const token = jwt.sign(
 *        { id: user._id, email: user.email, name: user.name },
 *        process.env.JWT_SECRET,
 *        { expiresIn: '7d' }
 *      );
 * 5. Return HTTP 200 OK with `{ token, user: { id: user._id, name: user.name, email: user.email } }`.
 */
export async function loginUser({ email, password }) {
  // --- REAL BACKEND CALL (Uncomment when Express is ready) ---
  // return request('/auth/login', {
  //   method: 'POST',
  //   body: JSON.stringify({ email, password }),
  // });

  // --- LOCAL MOCK (For frontend preview before backend is built) ---
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('todo_mock_users') || '[]');
      // Accept demo login or registered users
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && user.password === password) {
        const mockToken = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('todo_auth_token', mockToken);
        localStorage.setItem('todo_current_user', JSON.stringify({ name: user.name, email: user.email }));
        return resolve({ token: mockToken, user: { name: user.name, email: user.email } });
      } else if (email === 'student@creativeit.com' && password === 'creative123') {
        const mockToken = 'mock_jwt_token_demo';
        localStorage.setItem('todo_auth_token', mockToken);
        localStorage.setItem('todo_current_user', JSON.stringify({ name: 'Node Explorer', email }));
        return resolve({ token: mockToken, user: { name: 'Node Explorer', email } });
      }
      return reject(new Error('Invalid email or password. (Hint: test with student@creativeit.com / creative123 or register)'));
    }, 400);
  });
}

/**
 * [BACKEND SPOT]: Forgot Password / Password Reset Link
 * ------------------------------------------------------------------------------
 * HTTP Method : POST
 * Endpoint    : /api/auth/forgot-password
 * Request Body: { email }
 * 
 * What happens on your Node.js backend:
 * 1. Find user: `const user = await User.findOne({ email });`
 * 2. Generate secure random token:
 *      const resetToken = crypto.randomBytes(32).toString('hex');
 *      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
 *      user.passwordResetToken = hashedToken;
 *      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
 *      await user.save();
 * 3. Send email via Nodemailer (or SendGrid/Resend):
 *      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
 *      await transporter.sendMail({ to: user.email, subject: 'Password Reset', text: resetUrl });
 * 4. Return HTTP 200 with `{ message: 'Reset token sent to email' }`.
 */
export async function forgotPassword({ email }) {
  // --- REAL BACKEND CALL (Uncomment when Express is ready) ---
  // return request('/auth/forgot-password', {
  //   method: 'POST',
  //   body: JSON.stringify({ email }),
  // });

  // --- LOCAL MOCK (For frontend preview before backend is built) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: `Reset instructions sent to ${email}` });
    }, 500);
  });
}

// ==============================================================================
// TO-DO REST API METHODS
// ==============================================================================

/**
 * [BACKEND SPOT]: Fetch All To-Dos
 * ------------------------------------------------------------------------------
 * HTTP Method : GET
 * Endpoint    : /api/todos
 * Headers     : Authorization: Bearer <token>
 * 
 * What happens on your Node.js backend:
 * 1. Express auth middleware verifies the JWT:
 *      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => req.userId = decoded.id);
 * 2. Query database for todos created by this user:
 *      const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });
 * 3. Return HTTP 200 with `{ todos }`.
 */
export async function getTodos() {
  // --- REAL BACKEND CALL (Uncomment when Express is ready) ---
  // return request('/todos', { method: 'GET' });

  // --- LOCAL MOCK ---
  return new Promise((resolve) => {
    const raw = localStorage.getItem('todo_items_list');
    const todos = raw ? JSON.parse(raw) : null;
    resolve(todos);
  });
}

/**
 * [BACKEND SPOT]: Create a New To-Do
 * ------------------------------------------------------------------------------
 * HTTP Method : POST
 * Endpoint    : /api/todos
 * Headers     : Authorization: Bearer <token>
 * Request Body: { title: string, tag: string }
 * 
 * What happens on your Node.js backend:
 * 1. Express auth middleware verifies token and sets req.userId.
 * 2. Validate input: `if (!req.body.title) return res.status(400).json({ message: 'Title required' })`
 * 3. Save new item:
 *      const todo = await Todo.create({
 *        title: req.body.title,
 *        tag: req.body.tag || 'Study',
 *        completed: false,
 *        user: req.userId
 *      });
 * 4. Return HTTP 201 Created with `{ todo }`.
 */
export async function createTodo({ title, tag }) {
  // --- REAL BACKEND CALL (Uncomment when Express is ready) ---
  // return request('/todos', {
  //   method: 'POST',
  //   body: JSON.stringify({ title, tag }),
  // });

  // --- LOCAL MOCK ---
  return new Promise((resolve) => {
    const newTodo = {
      id: Date.now().toString(),
      title,
      tag: tag || 'Study',
      completed: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    resolve(newTodo);
  });
}

/**
 * [BACKEND SPOT]: Update an Existing To-Do
 * ------------------------------------------------------------------------------
 * HTTP Method : PATCH (or PUT)
 * Endpoint    : /api/todos/:id
 * Headers     : Authorization: Bearer <token>
 * Request Body: Partial fields e.g. { completed: true } or { title: '...', tag: '...' }
 * 
 * What happens on your Node.js backend:
 * 1. Express extract `:id` from `req.params.id`.
 * 2. Ensure the item belongs to `req.userId` for security.
 * 3. Update in database:
 *      const updated = await Todo.findOneAndUpdate(
 *        { _id: req.params.id, user: req.userId },
 *        { $set: req.body },
 *        { new: true }
 *      );
 * 4. Return HTTP 200 with `{ todo: updated }`.
 */
export async function updateTodo(id, updates) {
  // --- REAL BACKEND CALL (Uncomment when Express is ready) ---
  // return request(`/todos/${id}`, {
  //   method: 'PATCH',
  //   body: JSON.stringify(updates),
  // });

  // --- LOCAL MOCK ---
  return new Promise((resolve) => {
    resolve({ id, ...updates });
  });
}

/**
 * [BACKEND SPOT]: Delete a To-Do
 * ------------------------------------------------------------------------------
 * HTTP Method : DELETE
 * Endpoint    : /api/todos/:id
 * Headers     : Authorization: Bearer <token>
 * 
 * What happens on your Node.js backend:
 * 1. Express extract `:id` from `req.params.id`.
 * 2. Verify ownership and delete:
 *      await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
 * 3. Return HTTP 200 or 204 with `{ message: 'Todo deleted successfully' }`.
 */
export async function deleteTodo(id) {
  // --- REAL BACKEND CALL (Uncomment when Express is ready) ---
  // return request(`/todos/${id}`, {
  //   method: 'DELETE',
  // });

  // --- LOCAL MOCK ---
  return new Promise((resolve) => {
    resolve({ success: true, id });
  });
}

export default {
  API_BASE_URL,
  getAuthToken,
  registerUser,
  loginUser,
  forgotPassword,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
