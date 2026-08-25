<?php
require_once __DIR__ . '/../database/Database.php';

/**
 * User Model
 * Handles user-related database operations
 */
class User {
    private $db;
    private $table = 'users';
    
    // User properties
    public $id;
    public $fullname;
    public $email;
    public $role_id;
    public $email_verified;
    public $status;
    public $created_at;
    public $updated_at;
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->db = Database::getInstance();
        
        // Check if database connection is established
        if (!$this->db->isConnected()) {
            error_log("User model: Database connection failed: " . $this->db->getError());
        }
    }
    
    /**
     * Get user by ID
     * @param int $id User ID
     * @return User|null
     */
    public function getById($id) {
        if (!$id) {
            error_log("User model: Cannot get user by ID - No ID provided");
            return null;
        }
        
        try {
            $query = "SELECT * FROM {$this->table} WHERE id = ?";
            $user = $this->db->getRecord($query, [$id]);
            
            if ($user) {
                $this->mapProperties($user);
                return $this;
            }
        } catch (Exception $e) {
            error_log("User model: Error getting user by ID: " . $e->getMessage());
        }
        
        return null;
    }
    
    /**
     * Get user by email
     * @param string $email User email
     * @return User|null
     */
    public function getByEmail($email) {
        if (!$email) {
            error_log("User model: Cannot get user by email - No email provided");
            return null;
        }
        
        try {
            $query = "SELECT * FROM {$this->table} WHERE email = ?";
            $user = $this->db->getRecord($query, [$email]);
            
            if ($user) {
                $this->mapProperties($user);
                return $this;
            }
        } catch (Exception $e) {
            error_log("User model: Error getting user by email: " . $e->getMessage());
        }
        
        return null;
    }
    
    /**
     * Create new user
     * @param array $data User data
     * @return int|bool User ID on success, false on failure
     */
    public function create($data) {
        error_log("User model: Starting user creation");
        
        if (empty($data)) {
            error_log("User model: Cannot create user - No data provided");
            return false;
        }
        
        // Log the data being processed (without password)
        $logData = $data;
        if (isset($logData['password'])) {
            $logData['password'] = '***REDACTED***';
        }
        error_log("User model: Creating user with data: " . json_encode($logData));
        
        // Validate required fields
        $requiredFields = ['email', 'password', 'fullname'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                error_log("User model: Cannot create user - Missing required field: {$field}");
                return false;
            }
        }
        
        // Password should already be hashed in AuthController
        // Do not hash again to avoid double-hashing
        if (isset($data['password'])) {
            error_log("User model: Password length: " . strlen($data['password']));
            // Only hash if it's clearly not a bcrypt hash (for safety)
            if (strlen($data['password']) < 20) { // Definitely not a bcrypt hash
                error_log("User model: Hashing password (not already hashed)");
                $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            }
        }
        
        // Set default values if not provided
        if (!isset($data['role_id'])) {
            $data['role_id'] = 2; // Default to student role (2)
            error_log("User model: Setting default role_id to 2");
        }
        
        if (!isset($data['status'])) {
            $data['status'] = 'active';
            error_log("User model: Setting default status to 'active'");
        }
        
        // Add timestamps if not provided
        if (!isset($data['created_at'])) {
            $data['created_at'] = date('Y-m-d H:i:s');
        }
        
        try {
            // Check database connection
            if (!$this->db->isConnected()) {
                error_log("User model: Database connection failed before insert");
                return false;
            }
            
            // Log the SQL query that will be executed (without actual values)
            $columns = implode(', ', array_keys($data));
            $placeholders = implode(', ', array_fill(0, count($data), '?'));
            error_log("User model: Preparing to execute: INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})");
            
            $userId = $this->db->insert($this->table, $data);
            
            if ($userId) {
                error_log("User model: User created successfully with ID: {$userId}");
                return $userId;
            } else {
                error_log("User model: Insert failed, no user ID returned");
                error_log("User model: Database error: " . $this->db->getError());
                return false;
            }
        } catch (Exception $e) {
            error_log("User model: Exception creating user: " . $e->getMessage());
            error_log("User model: Exception trace: " . $e->getTraceAsString());
            return false;
        }
    }
    
    /**
     * Update user
     * @param int $id User ID
     * @param array $data User data
     * @return bool Success status
     */
    public function update($id, $data) {
        if (!$id) {
            error_log("User model: Cannot update user - No ID provided");
            return false;
        }
        
        if (empty($data)) {
            error_log("User model: Cannot update user - No data provided");
            return false;
        }
        
        // Hash password if provided
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        } else if (isset($data['password']) && empty($data['password'])) {
            // Remove empty password from update data
            unset($data['password']);
        }
        
        try {
            $result = $this->db->update($this->table, $data, 'id = ?', [$id]);
            return $result > 0;
        } catch (Exception $e) {
            error_log("User model: Error updating user: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Delete user
     * @param int $id User ID
     * @return bool Success status
     */
    public function delete($id) {
        if (!$id) {
            error_log("User model: Cannot delete user - No ID provided");
            return false;
        }
        
        try {
            $result = $this->db->delete($this->table, 'id = ?', [$id]);
            return $result > 0;
        } catch (Exception $e) {
            error_log("User model: Error deleting user: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Verify user password
     * @param string $password Plain text password
     * @return bool Password verification result
     */
    public function verifyPassword($password) {
        if (!$this->id) {
            error_log("User model: Cannot verify password - No user ID set");
            return false;
        }
        
        if (empty($password)) {
            error_log("User model: Cannot verify password - No password provided");
            return false;
        }
        
        try {
            $query = "SELECT password FROM {$this->table} WHERE id = ?";
            $user = $this->db->getRecord($query, [$this->id]);
            
            if ($user && isset($user['password'])) {
                return password_verify($password, $user['password']);
            }
        } catch (Exception $e) {
            error_log("User model: Error verifying password: " . $e->getMessage());
        }
        
        return false;
    }
    
    /**
     * Get user permissions
     * @return array Permissions
     */
    public function getPermissions() {
        if (!$this->role_id) {
            error_log("User model: Cannot get permissions - No role ID set");
            return [];
        }
        
        try {
            $query = "SELECT p.name FROM permissions p 
                     JOIN role_permissions rp ON p.id = rp.permission_id 
                     WHERE rp.role_id = ?";
            
            $permissions = $this->db->getRecords($query, [$this->role_id]);
            return array_column($permissions, 'name');
        } catch (Exception $e) {
            error_log("User model: Error getting permissions: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Check if user has specific permission
     * @param string $permission Permission name
     * @return bool Has permission
     */
    public function hasPermission($permission) {
        if (empty($permission)) {
            error_log("User model: Cannot check permission - No permission name provided");
            return false;
        }
        
        $permissions = $this->getPermissions();
        return in_array($permission, $permissions);
    }
    
    /**
     * Update last login timestamp
     * @return bool Success status
     */
    public function updateLastLogin() {
        if (!$this->id) {
            error_log("User model: Cannot update last login - No user ID set");
            return false;
        }
        
        $data = ['last_login' => date('Y-m-d H:i:s')];
        return $this->update($this->id, $data);
    }
    
    /**
     * Map database record to object properties
     * @param array $user User data from database
     */
    private function mapProperties($user) {
        if (!is_array($user) || empty($user)) {
            error_log("User model: Cannot map properties - Invalid user data");
            return;
        }
        
        // Map required properties
        $this->id = isset($user['id']) ? $user['id'] : null;
        $this->fullname = isset($user['fullname']) ? $user['fullname'] : null;
        $this->email = isset($user['email']) ? $user['email'] : null;
        $this->role_id = isset($user['role_id']) ? $user['role_id'] : null;
        
        // Map optional properties with defaults
        $this->email_verified = isset($user['email_verified']) ? (bool)$user['email_verified'] : false;
        $this->status = isset($user['status']) ? $user['status'] : 'inactive';
        $this->created_at = isset($user['created_at']) ? $user['created_at'] : null;
        $this->updated_at = isset($user['updated_at']) ? $user['updated_at'] : null;
    }
}