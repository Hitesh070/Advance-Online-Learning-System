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

require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../models/User.php';

// Initialize auth middleware
$authMiddleware = new AuthMiddleware();

// Authenticate request
$currentUser = $authMiddleware->authenticate();

if (!$currentUser) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized'
    ]);
    exit;
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['action']) ? $_GET['action'] : '';

// Initialize user model
$userModel = new User();

// Handle request based on method and path
switch ($method) {
    case 'GET':
        switch ($path) {
            case 'profile':
                // Get user profile
                $user = $userModel->getById($currentUser['id']);
                
                if ($user) {
                    $response = [
                        'success' => true,
                        'user' => [
                            'id' => $user->id,
                            'fullname' => $user->fullname,
                            'email' => $user->email,
                            'role_id' => $user->role_id,
                            'email_verified' => $user->email_verified,
                            'status' => $user->status,
                            'created_at' => $user->created_at
                        ]
                    ];
                } else {
                    http_response_code(404);
                    $response = [
                        'success' => false,
                        'message' => 'User not found'
                    ];
                }
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
        
    case 'PUT':
        // Get JSON request body
        $json = file_get_contents('php://input');
        $data = json_decode($json, true) ?: [];
        
        switch ($path) {
            case 'profile':
                // Update user profile
                $allowedFields = ['fullname'];
                $updateData = array_intersect_key($data, array_flip($allowedFields));
                
                if (empty($updateData)) {
                    $response = [
                        'success' => false,
                        'message' => 'No valid fields to update'
                    ];
                    break;
                }
                
                $updated = $userModel->update($currentUser['id'], $updateData);
                
                if ($updated) {
                    $user = $userModel->getById($currentUser['id']);
                    $response = [
                        'success' => true,
                        'message' => 'Profile updated successfully',
                        'user' => [
                            'id' => $user->id,
                            'fullname' => $user->fullname,
                            'email' => $user->email,
                            'role_id' => $user->role_id
                        ]
                    ];
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'Failed to update profile'
                    ];
                }
                break;
                
            case 'password':
                // Update user password
                $currentPassword = isset($data['current_password']) ? $data['current_password'] : '';
                $newPassword = isset($data['new_password']) ? $data['new_password'] : '';
                
                // Validate input
                $errors = [];
                
                if (empty($currentPassword)) {
                    $errors['current_password'] = 'Current password is required';
                }
                
                if (empty($newPassword)) {
                    $errors['new_password'] = 'New password is required';
                } elseif (strlen($newPassword) < 8) {
                    $errors['new_password'] = 'New password must be at least 8 characters';
                }
                
                if (!empty($errors)) {
                    $response = [
                        'success' => false,
                        'message' => 'Please fix the errors',
                        'errors' => $errors
                    ];
                    break;
                }
                
                // Verify current password
                $user = $userModel->getById($currentUser['id']);
                
                if (!$user->verifyPassword($currentPassword)) {
                    $response = [
                        'success' => false,
                        'message' => 'Current password is incorrect'
                    ];
                    break;
                }
                
                // Update password
                $updated = $userModel->update($currentUser['id'], [
                    'password' => $newPassword
                ]);
                
                if ($updated) {
                    $response = [
                        'success' => true,
                        'message' => 'Password updated successfully'
                    ];
                } else {
                    $response = [
                        'success' => false,
                        'message' => 'Failed to update password'
                    ];
                }
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