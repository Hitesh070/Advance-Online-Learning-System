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

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    // Create AuthController instance
    $authController = new AuthController();
    
    // Attempt login
    $loginData = [
        'email' => $email,
        'password' => $password
    ];
    
    // Call login method
    $response = $authController->login($loginData);
    
    // The response from AuthController already contains all necessary data
    // including success status, message, token, user info, and redirect URL
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>