// DOM Elements
const loginForm = document.getElementById("login-form")
const signupForm = document.getElementById("signup-form")
const forgotPasswordForm = document.getElementById("forgot-password-form")
const resetPasswordForm = document.getElementById("reset-password-form")
const dashboard = document.getElementById("dashboard")

// Navigation links
document.getElementById("showSignup").addEventListener("click", () => {
  hideAllForms()
  signupForm.classList.remove("hidden")
})

document.getElementById("showLogin").addEventListener("click", () => {
  hideAllForms()
  loginForm.classList.remove("hidden")
})

document.getElementById("showForgotPassword").addEventListener("click", () => {
  hideAllForms()
  forgotPasswordForm.classList.remove("hidden")
})

document.getElementById("backToLogin").addEventListener("click", () => {
  hideAllForms()
  loginForm.classList.remove("hidden")
})

document.getElementById("logoutBtn").addEventListener("click", () => {
  logout()
})

// Form submissions
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault()
  login()
})

document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault()
  signup()
})

document.getElementById("forgotPasswordForm").addEventListener("submit", (e) => {
  e.preventDefault()
  forgotPassword()
})

document.getElementById("resetPasswordForm").addEventListener("submit", (e) => {
  e.preventDefault()
  resetPassword()
})

// Helper functions
function hideAllForms() {
  loginForm.classList.add("hidden")
  signupForm.classList.add("hidden")
  forgotPasswordForm.classList.add("hidden")
  resetPasswordForm.classList.add("hidden")
  dashboard.classList.add("hidden")
}

function showError(formId, message) {
  const errorElement = document.getElementById(formId)
  errorElement.textContent = message
  setTimeout(() => {
    errorElement.textContent = ""
  }, 3000)
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePassword(password) {
  return password.length >= 8
}

// User management functions
function getUsers() {
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}

function findUserByEmail(email) {
  const users = getUsers()
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

// Authentication functions
function signup() {
  const name = document.getElementById("signupName").value.trim()
  const email = document.getElementById("signupEmail").value.trim()
  const password = document.getElementById("signupPassword").value
  const confirmPassword = document.getElementById("signupConfirmPassword").value

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    return showError("signupError", "All fields are required")
  }

  if (!validateEmail(email)) {
    return showError("signupError", "Please enter a valid email address")
  }

  if (!validatePassword(password)) {
    return showError("signupError", "Password must be at least 8 characters long")
  }

  if (password !== confirmPassword) {
    return showError("signupError", "Passwords do not match")
  }

  if (findUserByEmail(email)) {
    return showError("signupError", "Email already registered")
  }

  // Create new user
  const users = getUsers()
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    resetToken: null,
  }

  users.push(newUser)
  saveUsers(users)

  // Clear form
  document.getElementById("signupForm").reset()

  // Show success and redirect to login
  alert("Account created successfully! Please login.")
  hideAllForms()
  loginForm.classList.remove("hidden")
}

function login() {
  const email = document.getElementById("loginEmail").value.trim()
  const password = document.getElementById("loginPassword").value

  if (!email || !password) {
    return showError("loginError", "Email and password are required")
  }

  const user = findUserByEmail(email)

  if (!user || user.password !== password) {
    return showError("loginError", "Invalid email or password")
  }

  // Set current user in session
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
    }),
  )

  // Show dashboard
  document.getElementById("userName").textContent = user.name
  hideAllForms()
  dashboard.classList.remove("hidden")
}

function logout() {
  sessionStorage.removeItem("currentUser")
  hideAllForms()
  loginForm.classList.remove("hidden")
}

function forgotPassword() {
  const email = document.getElementById("resetEmail").value.trim()

  if (!email) {
    return showError("resetError", "Please enter your email address")
  }

  const user = findUserByEmail(email)

  if (!user) {
    return showError("resetError", "No account found with this email")
  }

  // Generate reset token
  const resetToken = Math.random().toString(36).substring(2, 15)

  // Update user with reset token
  const users = getUsers()
  const updatedUsers = users.map((u) => {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      return { ...u, resetToken }
    }
    return u
  })

  saveUsers(updatedUsers)

  // Store email for reset process
  sessionStorage.setItem("resetEmail", email)

  // In a real app, you would send an email with a link
  // For this demo, we'll just proceed to reset form
  alert("Reset link sent! (In a real app, this would be emailed)")
  hideAllForms()
  resetPasswordForm.classList.remove("hidden")
}

function resetPassword() {
  const newPassword = document.getElementById("newPassword").value
  const confirmNewPassword = document.getElementById("confirmNewPassword").value
  const resetEmail = sessionStorage.getItem("resetEmail")

  if (!resetEmail) {
    return showError("newPasswordError", "Reset session expired. Please try again.")
  }

  if (!newPassword || !confirmNewPassword) {
    return showError("newPasswordError", "Please enter your new password")
  }

  if (!validatePassword(newPassword)) {
    return showError("newPasswordError", "Password must be at least 8 characters long")
  }

  if (newPassword !== confirmNewPassword) {
    return showError("newPasswordError", "Passwords do not match")
  }

  // Update user password
  const users = getUsers()
  const updatedUsers = users.map((user) => {
    if (user.email.toLowerCase() === resetEmail.toLowerCase()) {
      return {
        ...user,
        password: newPassword,
        resetToken: null,
      }
    }
    return user
  })

  saveUsers(updatedUsers)
  sessionStorage.removeItem("resetEmail")

  alert("Password updated successfully! Please login with your new password.")
  hideAllForms()
  loginForm.classList.remove("hidden")
}

// Check if user is already logged in
function checkAuthState() {
  const currentUser = sessionStorage.getItem("currentUser")

  if (currentUser) {
    const user = JSON.parse(currentUser)
    document.getElementById("userName").textContent = user.name
    hideAllForms()
    dashboard.classList.remove("hidden")
  }
}

// Initialize
checkAuthState()

