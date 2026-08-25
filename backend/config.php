<?php
// Error logging configuration
ini_set('display_errors', 0); // Don't display errors to users
ini_set('log_errors', 1); // Enable error logging
ini_set('error_log', __DIR__ . '/logs/error.log'); // Set error log file
error_reporting(E_ALL); // Report all errors

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'student_login_db');
define('DB_USER', 'root');
define('DB_PASS', ''); // Empty password for default MySQL installation

// Application settings
define('APP_URL', 'http://localhost:8000');
define('APP_NAME', 'Student Login System');

// Session settings
ini_set('session.cookie_httponly', 1); // Prevent JavaScript access to session cookie
ini_set('session.use_only_cookies', 1); // Force use of cookies for session
ini_set('session.cookie_secure', 0); // Set to 1 in production with HTTPS

// Set timezone
date_default_timezone_set('UTC');
?>