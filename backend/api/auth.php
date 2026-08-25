<?php
header('Content-Type: application/json');

// Allow CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/AuthController.php';

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['action']) ? $_GET['action'] : '';

// Initialize auth controller
$authController = new AuthController();

// Handle request based on method and path
switch ($method) {
    case 'POST':
        // Get JSON request body
        $json = file_get_contents('php://input');
        $data = json_decode($json, true) ?: [];
        
        // Merge with POST data
        $data = array_merge($_POST, $data);
        
        switch ($path) {
            case 'register':
                $response = $authController->register($data);
                break;
                
            case 'login':
                $response = $authController->login($data);
                break;
                
            case 'logout':
                $response = $authController->logout();
                break;
                
            case 'verify':
                $token = isset($data['token']) ? $data['token'] : '';
                $response = $authController->verifyEmail($token);
                break;
                
            case 'reset-password-request':
                $email = isset($data['email']) ? $data['email'] : '';
                $response = $authController->requestPasswordReset($email);
                break;
                
            case 'reset-password':
                $token = isset($data['token']) ? $data['token'] : '';
                $password = isset($data['password']) ? $data['password'] : '';
                $response = $authController->resetPassword($token, $password);
                break;
                
            case 'refresh-token':
                $token = isset($data['token']) ? $data['token'] : '';
                $response = $authController->refreshToken($token);
                break;
                
            default:
                http_response_code(404);
                $response = [
                    'success' => false,
                    'message' => 'Endpoint not found'
                ];
                break;
        }
        break;
        
    case 'GET':
        switch ($path) {
            case 'verify':
                $token = isset($_GET['token']) ? $_GET['token'] : '';
                $response = $authController->verifyEmail($token);
                break;
                
            default:
                http_response_code(404);
                $response = [
                    'success' => false,
                    'message' => 'Endpoint not found'
                ];
                break;
        }
        break;
        
    default:
        http_response_code(405);
        $response = [
            'success' => false,
            'message' => 'Method not allowed'
        ];
        break;
}

// Return JSON response
echo json_encode($response);