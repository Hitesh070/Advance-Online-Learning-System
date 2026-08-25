<?php
require_once __DIR__ . '/../utils/JwtUtil.php';
require_once __DIR__ . '/../models/User.php';

/**
 * Authentication Middleware
 * Handles authentication and authorization for protected routes
 */
class AuthMiddleware {
    private $jwtUtil;
    private $user;
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->jwtUtil = new JwtUtil();
        $this->user = new User();
    }
    
    /**
     * Authenticate request using JWT token
     * @return array|null User data if authenticated, null otherwise
     */
    public function authenticate() {
        // Get authorization header
        $authHeader = $this->getAuthorizationHeader();
        
        if (!$authHeader) {
            return null;
        }
        
        // Extract token from header
        $token = $this->getBearerToken($authHeader);
        
        if (!$token) {
            return null;
        }
        
        try {
            // Verify token
            $payload = $this->jwtUtil->verifyToken($token);
            
            // Get user by ID
            $user = $this->user->getById($payload['user_id']);
            
            if (!$user) {
                return null;
            }
            
            return [
                'id' => $user->id,
                'fullname' => $user->fullname,
                'email' => $user->email,
                'role_id' => $user->role_id
            ];
        } catch (Exception $e) {
            return null;
        }
    }
    
    /**
     * Check if user has required permission
     * @param int $userId User ID
     * @param string $permission Required permission
     * @return bool Has permission
     */
    public function hasPermission($userId, $permission) {
        $user = $this->user->getById($userId);
        
        if (!$user) {
            return false;
        }
        
        return $user->hasPermission($permission);
    }
    
    /**
     * Get authorization header
     * @return string|null Authorization header
     */
    private function getAuthorizationHeader() {
        $headers = null;
        
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER['Authorization']);
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(
                array_map('ucwords', array_keys($requestHeaders)),
                array_values($requestHeaders)
            );
            
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        
        return $headers;
    }
    
    /**
     * Get bearer token from authorization header
     * @param string $authHeader Authorization header
     * @return string|null Bearer token
     */
    private function getBearerToken($authHeader) {
        if (!empty($authHeader)) {
            if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
}