<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/JwtUtil.php';

/**
 * Authentication Controller
 * Handles user authentication operations
 */
class AuthController {
    private $user;
    private $jwtUtil;

    public $db;
    
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->user = new User();
        $this->jwtUtil = new JwtUtil();
        $this->db = Database::getInstance();
        
        // Initialize session if not already started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    /**
     * Register a new user
     * @param array $data User registration data
     * @return array Response with status and message
     */
    public function register($data) {
        $response = [
            'success' => false,
            'message' => '',
            'errors' => []
        ];
        
        error_log("AuthController: Starting registration process");
        
        try {
            // Log sanitized data
            $logData = $data;
            if (isset($logData['password'])) {
                $logData['password'] = '***REDACTED***';
            }
            error_log("AuthController: Registration data received: " . json_encode($logData));
            
            // Validate input data
            error_log("AuthController: Validating registration data");
            $errors = $this->validateRegistrationData($data);
            
            if (!empty($errors)) {
                error_log("AuthController: Validation failed: " . json_encode($errors));
                $response['errors'] = $errors;
                $response['message'] = 'Please fix the errors and try again.';
                return $response;
            }
            
            // Sanitize input data
            $data['fullname'] = htmlspecialchars(trim($data['fullname']));
            $data['email'] = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
            
            // Check if email already exists
            error_log("AuthController: Checking if email already exists: {$data['email']}");
            if ($this->user->getByEmail($data['email'])) {
                error_log("AuthController: Email already registered: {$data['email']}");
                $response['errors']['email'] = 'This email is already registered';
                $response['message'] = 'Please fix the errors and try again.';
                return $response;
            }
            
            // Prepare user data
            error_log("AuthController: Preparing user data");
            
            // Hash password in the controller
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            error_log("AuthController: Password hashed. Length: " . strlen($hashedPassword));
            
            $userData = [
                'fullname' => $data['fullname'],
                'email' => $data['email'],
                'password' => $hashedPassword, // Password is now hashed here
                'role_id' => isset($data['role_id']) ? $data['role_id'] : 2,
                'email_verified' => false,
                'verification_token' => bin2hex(random_bytes(32)),
                'status' => 'active', // Set to active by default
                'created_at' => date('Y-m-d H:i:s')
            ];
            
            // Create user
            error_log("AuthController: Creating user");
            $userId = $this->user->create($userData);
            
            if ($userId) {
                error_log("AuthController: User created successfully with ID: {$userId}");
                $response['success'] = true;
                $response['message'] = 'Registration successful! Please check your email to verify your account.';
                $response['user_id'] = $userId;
                $response['redirect'] = 'login.html';
                
                // Send verification email (implementation not shown)
                // $this->sendVerificationEmail($userData['email'], $userData['verification_token']);
                
                error_log("AuthController: Registration successful for: {$userData['email']}");
                return $response;
            } else {
                error_log("AuthController: Failed to create user");
                $response['message'] = 'Registration failed. Please try again.';
                return $response;
            }
        } catch (Exception $e) {
            error_log("AuthController: Registration error: " . $e->getMessage());
            error_log("AuthController: Exception trace: " . $e->getTraceAsString());
            $response['message'] = 'An unexpected error occurred. Please try again later.';
            return $response;
        }
    }
    
    /**
     * Login user
     * @param array $data Login credentials
     * @return array Response with status, message, and token
     */
    public function login($data) {
        $response = [
            'success' => false,
            'message' => '',
            'errors' => [],
            'token' => null,
            'user' => null
        ];
        
        try {
            // Validate input data
            $errors = $this->validateLoginData($data);
            
            if (!empty($errors)) {
                $response['errors'] = $errors;
                $response['message'] = 'Please fix the errors in the form.';
                return $response;
            }
            
            // Sanitize input data
            $email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
            $password = $data['password'];
            
            // Get user by email
            $user = $this->user->getByEmail($email);
            
            if (!$user) {
                // Use generic error message for security
                $response['message'] = 'Invalid email or password';
                return $response;
            }
            
            // Verify password using the User model's method
            if (!$user->verifyPassword($password)) {
                error_log("AuthController: Failed login attempt for email: {$email}");
                $response['message'] = 'Invalid email or password';
                return $response;
            }
            
            // Check if account is activated
            if (isset($user->email_verified) && !$user->email_verified) {
                $response['message'] = 'Please verify your email before logging in';
                $response['needs_verification'] = true;
                return $response;
            }
            
            // Check if user is active
            if (isset($user->status) && $user->status !== 'active') {
                $response['message'] = 'Your account is not active. Please contact support.';
                return $response;
            }
            
            // Update last login timestamp
            if (method_exists($user, 'updateLastLogin')) {
                $user->updateLastLogin();
            } else {
                // Manually update last login
                $this->user->update($user->id, ['last_login' => date('Y-m-d H:i:s')]);
            }
            
            // Generate JWT token
            $token = $this->jwtUtil->generateToken([
                'user_id' => $user->id,
                'email' => $user->email,
                'role_id' => $user->role_id
            ]);
            
            // Set session
            $_SESSION['loggedin'] = true;
            $_SESSION['id'] = $user->id;
            $_SESSION['fullname'] = $user->fullname;
            $_SESSION['email'] = $user->email;
            $_SESSION['role_id'] = $user->role_id;
            $_SESSION['logged_in_at'] = time();
            
            $response['success'] = true;
            $response['message'] = 'Login successful!';
            $response['token'] = $token;
            $response['user'] = [
                'id' => $user->id,
                'fullname' => $user->fullname,
                'email' => $user->email,
                'role_id' => $user->role_id
            ];
            $response['redirect'] = 'dashboard.php';
            
            return $response;
        } catch (Exception $e) {
            error_log("AuthController: Login error: " . $e->getMessage());
            $response['message'] = 'An unexpected error occurred. Please try again later.';
            return $response;
        }
    }
    
    /**
     * Logout user
     * @return array Response with status and message
     */
    public function logout() {
        $response = [
            'success' => false,
            'message' => ''
        ];
        
        try {
            // Check if session exists
            if (session_status() === PHP_SESSION_ACTIVE) {
                // Clear all session variables
                $_SESSION = [];
                
                // If a session cookie is used, clear it too
                if (ini_get("session.use_cookies")) {
                    $params = session_get_cookie_params();
                    setcookie(session_name(), '', time() - 42000,
                        $params["path"], $params["domain"],
                        $params["secure"], $params["httponly"]
                    );
                }
                
                // Destroy session
                session_destroy();
            }
            
            $response['success'] = true;
            $response['message'] = 'Logout successful!';
            
            return $response;
        } catch (Exception $e) {
            error_log("AuthController: Logout error: " . $e->getMessage());
            $response['message'] = 'An error occurred during logout.';
            return $response;
        }
    }
    
    /**
     * Verify email
     * @param string $token Verification token
     * @return array Response with status and message
     */
    public function verifyEmail($token) {
        $response = [
            'success' => false,
            'message' => ''
        ];
        
        // Find user by verification token
        $query = "SELECT id FROM users WHERE verification_token = ?";
        $user = $this->db->getRecord($query, [$token]);
        
        if (!$user) {
            $response['message'] = 'Invalid verification token';
            return $response;
        }
        
        // Update user verification status
        $data = [
            'email_verified' => true,
            'verification_token' => null
        ];
        
        $updated = $this->user->update($user['id'], $data);
        
        if ($updated) {
            $response['success'] = true;
            $response['message'] = 'Email verified successfully! You can now login.';
            return $response;
        } else {
            $response['message'] = 'Email verification failed. Please try again.';
            return $response;
        }
    }
    
    /**
     * Request password reset
     * @param string $email User email
     * @return array Response with status and message
     */
    public function requestPasswordReset($email) {
        $response = [
            'success' => false,
            'message' => ''
        ];
        
        // Get user by email
        $user = $this->user->getByEmail($email);
        
        if (!$user) {
            // Don't reveal that email doesn't exist for security
            $response['success'] = true;
            $response['message'] = 'If your email is registered, you will receive a password reset link.';
            return $response;
        }
        
        // Generate reset token
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
        
        // Update user with reset token
        $data = [
            'reset_token' => $token,
            'reset_token_expires' => $expires
        ];
        
        $updated = $this->user->update($user->id, $data);
        
        if ($updated) {
            // Send reset email (implementation not shown)
            // $this->sendPasswordResetEmail($email, $token);
            
            $response['success'] = true;
            $response['message'] = 'If your email is registered, you will receive a password reset link.';
            return $response;
        } else {
            $response['message'] = 'Password reset request failed. Please try again.';
            return $response;
        }
    }
    
    /**
     * Reset password
     * @param string $token Reset token
     * @param string $password New password
     * @return array Response with status and message
     */
    public function resetPassword($token, $password) {
        $response = [
            'success' => false,
            'message' => ''
        ];
        
        // Find user by reset token
        $query = "SELECT id, reset_token_expires FROM users WHERE reset_token = ?";
        $user = $this->db->getRecord($query, [$token]);
        
        if (!$user) {
            $response['message'] = 'Invalid reset token';
            return $response;
        }
        
        // Check if token is expired
        if (strtotime($user['reset_token_expires']) < time()) {
            $response['message'] = 'Reset token has expired. Please request a new one.';
            return $response;
        }
        
        // Validate password
        if (strlen($password) < 8) {
            $response['message'] = 'Password must be at least 8 characters';
            return $response;
        }
        
        // Update user password
        $data = [
            'password' => $password,
            'reset_token' => null,
            'reset_token_expires' => null
        ];
        
        $updated = $this->user->update($user['id'], $data);
        
        if ($updated) {
            $response['success'] = true;
            $response['message'] = 'Password reset successful! You can now login with your new password.';
            return $response;
        } else {
            $response['message'] = 'Password reset failed. Please try again.';
            return $response;
        }
    }
    
    /**
     * Refresh JWT token
     * @param string $token Current token
     * @return array Response with status, message, and new token
     */
    public function refreshToken($token) {
        $response = [
            'success' => false,
            'message' => ''
        ];
        
        try {
            // Verify current token
            $payload = $this->jwtUtil->verifyToken($token);
            
            // Generate new token
            $newToken = $this->jwtUtil->generateToken([
                'user_id' => $payload['user_id'],
                'email' => $payload['email'],
                'role_id' => $payload['role_id']
            ]);
            
            $response['success'] = true;
            $response['token'] = $newToken;
            return $response;
        } catch (Exception $e) {
            $response['message'] = 'Invalid token. Please login again.';
            return $response;
        }
    }
    
    /**
     * Validate registration data
     * @param array $data Registration data
     * @return array Validation errors
     */
    private function validateRegistrationData($data) {
        $errors = [];
        
        // Validate fullname
        if (empty($data['fullname'])) {
            $errors['fullname'] = 'Full name is required';
        } elseif (strlen($data['fullname']) < 3) {
            $errors['fullname'] = 'Full name must be at least 3 characters';
        }
        
        // Validate email
        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Please enter a valid email address';
        }
        
        // Validate password
        if (empty($data['password'])) {
            $errors['password'] = 'Password is required';
        } elseif (strlen($data['password']) < 8) {
            $errors['password'] = 'Password must be at least 8 characters';
        }
        
        return $errors;
    }
    
    /**
     * Validate login data
     * @param array $data Login data
     * @return array Validation errors
     */
    private function validateLoginData($data) {
        $errors = [];
        
        // Validate email
        if (empty($data['email'])) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Please enter a valid email address';
        }
        
        // Validate password
        if (empty($data['password'])) {
            $errors['password'] = 'Password is required';
        }
        
        return $errors;
    }
}