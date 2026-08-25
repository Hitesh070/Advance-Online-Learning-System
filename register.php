<?php
// Include configuration file
require_once __DIR__ . '/backend/config.php';

// Include the AuthController
require_once __DIR__ . '/backend/controllers/AuthController.php';

// Initialize response array
$response = array(
    'success' => false,
    'message' => '',
    'errors' => array()
);

// Log registration attempt
error_log("Registration attempt started: " . date('Y-m-d H:i:s'));

try {
    // Check if form is submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Log POST data (sanitized for security)
        $postData = $_POST;
        if (isset($postData['password'])) $postData['password'] = '***REDACTED***';
        error_log("Registration POST data: " . json_encode($postData));
        
        // Check if data exists
        if (empty($_POST)) {
            error_log("No POST data received");
            $response['message'] = 'No data received';
            throw new Exception('No data received');
        }
        
        // Get form data
        $fullname = isset($_POST['fullname']) ? trim($_POST['fullname']) : '';
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';
        
        // Validate required fields
        if (empty($fullname) || empty($email) || empty($password)) {
            error_log("Missing required fields");
            $response['message'] = 'All fields are required';
            if (empty($fullname)) $response['errors']['fullname'] = 'Full name is required';
            if (empty($email)) $response['errors']['email'] = 'Email is required';
            if (empty($password)) $response['errors']['password'] = 'Password is required';
            throw new Exception('Missing required fields');
        }
        
        // Create AuthController instance
        $authController = new AuthController();
        
        // Prepare registration data
        $registrationData = [
            'fullname' => $fullname,
            'email' => $email,
            'password' => $password,
            'role_id' => 2 // Default to student role
        ];
        
        // Call register method
        $response = $authController->register($registrationData);
        
        // Log the response (remove in production)
        error_log("Registration result: " . json_encode($response));
    }
} catch (Exception $e) {
    // Log any exceptions
    error_log("Registration error: " . $e->getMessage());
    if (empty($response['message'])) {
        $response['message'] = 'An unexpected error occurred. Please try again later.';
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
error_log("Registration response sent: " . json_encode($response));
?>