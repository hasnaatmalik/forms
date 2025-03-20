// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const dashboard = document.getElementById('dashboard');
const alertExamples = document.getElementById('alert-examples');

// Form Elements
const loginFormElement = document.getElementById('login-form-element');
const signupFormElement = document.getElementById('signup-form-element');
const forgotPasswordEmailForm = document.getElementById('forgot-password-email-form');
const securityQuestionForm = document.getElementById('security-question-form');
const resetPasswordForm = document.getElementById('reset-password-form');

// Navigation Elements
const signupLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const backToLoginBtn = document.getElementById('back-to-login');
const logoutBtn = document.getElementById('logout-btn');
const toggleAlertsBtn = document.getElementById('toggle-alerts');
const backToAuthBtn = document.getElementById('back-to-auth');

// Error/Success Elements
const errorMessage = document.getElementById('error-message');
const signupError = document.getElementById('signup-error');
const forgotPasswordError = document.getElementById('forgot-password-error');
const forgotPasswordSuccess = document.getElementById('forgot-password-success');

// User data elements
const welcomeMessage = document.getElementById('welcome-message');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const forgotPasswordSubtitle = document.getElementById('forgot-password-subtitle');

// Initialize localStorage if empty
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// Navigation Functions
function showLogin() {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    forgotPasswordForm.classList.add('hidden');
    dashboard.classList.add('hidden');
    alertExamples.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

function showSignup() {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    forgotPasswordForm.classList.add('hidden');
    dashboard.classList.add('hidden');
    alertExamples.classList.add('hidden');
    signupError.classList.add('hidden');
}

function showForgotPassword() {
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    forgotPasswordForm.classList.remove('hidden');
    dashboard.classList.add('hidden');
    alertExamples.classList.add('hidden');
    forgotPasswordError.classList.add('hidden');
    forgotPasswordSuccess.classList.add('hidden');
    
    // Reset to first step
    forgotPasswordEmailForm.classList.remove('hidden');
    securityQuestionForm.classList.add('hidden');
    resetPasswordForm.classList.add('hidden');
    forgotPasswordSubtitle.textContent = 'Enter your email to reset your password';
}

function showDashboard(user) {
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    forgotPasswordForm.classList.add('hidden');
    dashboard.classList.remove('hidden');
    alertExamples.classList.add('hidden');
    
    // Update user info
    welcomeMessage.textContent = `Welcome, ${user.name}`;
    userName.textContent = user.name;
    userEmail.textContent = user.email;
}

function toggleAlertExamples() {
    if (alertExamples.classList.contains('hidden')) {
        loginForm.classList.add('hidden');
        signupForm.classList.add('hidden');
        forgotPasswordForm.classList.add('hidden');
        dashboard.classList.add('hidden');
        alertExamples.classList.remove('hidden');
        toggleAlertsBtn.textContent = 'Back to Authentication';
    } else {
        alertExamples.classList.add('hidden');
        toggleAlertsBtn.textContent = 'View Alert Examples';
        
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            showDashboard(currentUser);
        } else {
            showLogin();
        }
    }
}

// Event Listeners for Navigation
signupLink.addEventListener('click', showSignup);
loginLink.addEventListener('click', showLogin);
forgotPasswordLink.addEventListener('click', showForgotPassword);
backToLoginBtn.addEventListener('click', showLogin);
toggleAlertsBtn.addEventListener('click', toggleAlertExamples);
backToAuthBtn.addEventListener('click', toggleAlertExamples);

// Login Form Submission
loginFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Find user
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        // Store current user (without password)
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        // Show dashboard
        showDashboard(userWithoutPassword);
    } else {
        // Show error
        errorMessage.classList.remove('hidden');
    }
});

// Signup Form Submission
signupFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Validate form
    if (!name || !email || !password || !confirmPassword) {
        signupError.querySelector('.alert-message').textContent = 'All fields are required';
        signupError.classList.remove('hidden');
        return;
    }
    
    if (password !== confirmPassword) {
        signupError.querySelector('.alert-message').textContent = 'Passwords do not match';
        signupError.classList.remove('hidden');
        return;
    }
    
    if (password.length < 6) {
        signupError.querySelector('.alert-message').textContent = 'Password must be at least 6 characters';
        signupError.classList.remove('hidden');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
        signupError.querySelector('.alert-message').textContent = 'User with this email already exists';
        signupError.classList.remove('hidden');
        return;
    }
    
    // Add new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Reset form
    signupFormElement.reset();
    
    // Show login form
    showLogin();
});

// Forgot Password - Email Form
forgotPasswordEmailForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgot-email').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Find user
    const user = users.find(user => user.email === email);
    
    if (!user) {
        forgotPasswordError.querySelector('.alert-message').textContent = 'No account found with this email';
        forgotPasswordError.classList.remove('hidden');
        return;
    }
    
    // Store email for later steps
    localStorage.setItem('resetEmail', email);
    
    // Show security question form
    forgotPasswordEmailForm.classList.add('hidden');
    securityQuestionForm.classList.remove('hidden');
    forgotPasswordSubtitle.textContent = 'Answer the security question';
});

// Forgot Password - Security Question Form
securityQuestionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const securityAnswer = document.getElementById('security-answer').value;
    
    if (!securityAnswer) {
        forgotPasswordError.querySelector('.alert-message').textContent = 'Security answer is required';
        forgotPasswordError.classList.remove('hidden');
        return;
    }
    
    // In a real app, you would verify the security answer
    // For this demo, we'll accept any answer
    
    // Show reset password form
    securityQuestionForm.classList.add('hidden');
    resetPasswordForm.classList.remove('hidden');
    forgotPasswordSubtitle.textContent = 'Create a new password';
});

// Forgot Password - Reset Password Form
resetPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    
    if (!newPassword || !confirmNewPassword) {
        forgotPasswordError.querySelector('.alert-message').textContent = 'All fields are required';
        forgotPasswordError.classList.remove('hidden');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        forgotPasswordError.querySelector('.alert-message').textContent = 'Passwords do not match';
        forgotPasswordError.classList.remove('hidden');
        return;
    }
    
    if (newPassword.length < 6) {
        forgotPasswordError.querySelector('.alert-message').textContent = 'Password must be at least 6 characters';
        forgotPasswordError.classList.remove('hidden');
        return;
    }
    
    // Get reset email
    const resetEmail = localStorage.getItem('resetEmail');
    
    // Update user's password
    const users = JSON.parse(localStorage.getItem('users'));
    const updatedUsers = users.map(user => {
        if (user.email === resetEmail) {
            return { ...user, password: newPassword };
        }
        return user;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Show success message
    resetPasswordForm.classList.add('hidden');
    forgotPasswordSubtitle.textContent = '';
    forgotPasswordSuccess.classList.remove('hidden');
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
        showLogin();
    }, 2000);
});

// Logout
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    showLogin();
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        showDashboard(currentUser);
    } else {
        showLogin();
    }
});
