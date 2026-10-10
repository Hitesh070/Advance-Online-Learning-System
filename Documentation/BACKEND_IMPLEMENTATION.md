# Authentication System Implementation Guide

## Overview

This document provides step-by-step instructions for implementing the new authentication system in the Vaxhakal application. The new system offers improved security, role-based access control, and a more maintainable codebase.

## Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Existing Vaxhakal application codebase

## Implementation Steps

### 1. Database Setup

#### Option A: Fresh Installation

1. Create the database schema by importing the SQL file:
   ```bash
   mysql -u username -p vaxhakal_db < backend/database/schema.sql
   ```

2. Verify that the tables have been created:
   - users
   - roles
   - permissions
   - role_permissions
   - sessions

#### Option B: Migration from Existing System

1. Navigate to the migration tool in your browser:
   ```
   http://your-domain.com/backend/migration/migrate.php
   ```

2. Follow the on-screen instructions to migrate data from the old system.

3. The migration tool will:
   - Create the new schema
   - Transfer existing users
   - Create a backup of old tables

### 2. Configuration

1. Update the database connection settings in `backend/database/Database.php` if necessary.

2. Configure the JWT secret key in `backend/utils/JwtUtil.php`:
   ```php
   private static $secretKey = 'your-secure-secret-key';
   ```
   
   > **Important**: Generate a strong random key and keep it secure. Do not use the default value.

### 3. API Integration

1. The authentication API endpoints are available at:
   ```
   /backend/api/auth.php
   ```

2. Available endpoints:
   - `auth.php?action=register` - Register a new user
   - `auth.php?action=login` - Login a user
   - `auth.php?action=logout` - Logout a user
   - `auth.php?action=verify` - Verify email address
   - `auth.php?action=reset-password-request` - Request password reset
   - `auth.php?action=reset-password` - Reset password with token
   - `auth.php?action=refresh-token` - Refresh authentication token

3. User profile API endpoints are available at:
   ```
   /backend/api/users.php
   ```

### 4. Frontend Integration

1. Include the authentication service in your frontend pages:
   ```html
   <script src="/backend/examples/auth.js"></script>
   ```

2. Use the authentication service to handle user authentication:
   ```javascript
   // Check if user is authenticated
   if (!authService.isAuthenticated()) {
     window.location.href = 'login.html';
   }
   
   // Get current user
   const user = authService.getCurrentUser();
   
   // Login a user
   authService.login({
     email: 'user@example.com',
     password: 'password'
   }).then(response => {
     if (response.success) {
       window.location.href = 'dashboard.php';
     }
   });
   
   // Logout a user
   authService.logout().then(() => {
     window.location.href = 'login.html';
   });
   ```

3. Example pages are provided in the `backend/examples` directory:
   - `login.html` - Login and registration page
   - `profile.html` - User profile management

### 5. Protecting Routes

1. To protect a PHP page, include the authentication middleware:
   ```php
   <?php
   require_once __DIR__ . '/backend/middleware/AuthMiddleware.php';
   
   // Create middleware instance
   $auth = new AuthMiddleware();
   
   // Verify authentication
   $user = $auth->authenticate();
   
   // If not authenticated, redirect to login
   if (!$user) {
     header('Location: login.html');
     exit;
   }
   
   // Check for specific permission (optional)
   if (!$auth->hasPermission($user, 'view_dashboard')) {
     header('Location: unauthorized.html');
     exit;
   }
   
   // Continue with page logic...
   ?>
   ```

2. For JavaScript-based protection, use the authentication service:
   ```javascript
   // Check authentication
   if (!authService.isAuthenticated()) {
     window.location.href = 'login.html';
     return;
   }
   
   // Check role
   if (!authService.hasRole('Teacher')) {
     window.location.href = 'unauthorized.html';
     return;
   }
   
   // Check permission
   if (!authService.hasPermission('create_course')) {
     // Hide or disable specific UI elements
     document.getElementById('create-course-btn').style.display = 'none';
   }
   ```

### 6. Updating Existing Pages

1. Replace the old login form with the new one:
   - Copy `backend/examples/login.html` to replace your existing login page
   - Or integrate the authentication logic into your existing login page

2. Update dashboard and other protected pages to use the new authentication system:
   ```php
   <?php
   // Old authentication check
   // session_start();
   // if (!isset($_SESSION['student_id'])) {
   //   header('Location: login.html');
   //   exit;
   // }
   
   // New authentication check
   require_once __DIR__ . '/backend/middleware/AuthMiddleware.php';
   $auth = new AuthMiddleware();
   $user = $auth->authenticate();
   
   if (!$user) {
     header('Location: login.html');
     exit;
   }
   ?>
   ```

## Testing

1. Test user registration:
   - Create a new account
   - Verify that the user is added to the database
   - Check that the password is properly hashed

2. Test user login:
   - Login with valid credentials
   - Verify that a JWT token is generated
   - Check that the user is redirected to the dashboard

3. Test authentication protection:
   - Try accessing a protected page without authentication
   - Verify that the user is redirected to the login page

4. Test role-based access:
   - Login as different user roles (Student, Teacher, Admin)
   - Verify that appropriate permissions are enforced

## Troubleshooting

### Common Issues

1. **JWT token not working**
   - Check that the secret key is properly configured
   - Verify that the token is being sent in the Authorization header
   - Check for token expiration

2. **Database connection errors**
   - Verify database credentials in `Database.php`
   - Check that the database server is running
   - Ensure the required tables exist

3. **Permission issues**
   - Check that roles and permissions are properly assigned in the database
   - Verify that the user has the required role
   - Check the permission checking logic in your code

### Debugging

1. Enable error reporting in PHP:
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. Check the browser console for JavaScript errors

3. Use the browser's network inspector to check API responses

## Security Considerations

1. **JWT Secret Key**
   - Use a strong, random secret key
   - Keep the secret key secure and do not commit it to version control
   - Consider using environment variables for the secret key

2. **Password Security**
   - Passwords are hashed using bcrypt
   - Enforce strong password requirements
   - Implement account lockout after multiple failed login attempts

3. **HTTPS**
   - Always use HTTPS in production
   - Secure cookies with the 'secure' and 'httpOnly' flags
   - Set appropriate CORS headers

## Next Steps

1. **Email Verification**
   - Implement email verification for new accounts
   - Configure email sending in `AuthController.php`

2. **Two-Factor Authentication**
   - Add support for two-factor authentication
   - Integrate with a TOTP library

3. **OAuth Integration**
   - Add support for social login (Google, Facebook, etc.)
   - Implement OAuth 2.0 client