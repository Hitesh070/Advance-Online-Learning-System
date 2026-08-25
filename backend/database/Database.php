<?php
/**
 * Database Connection Class
 * Handles database connections and operations
 */
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;
    private static $instance = null;
    private $error = null;
    
    /**
     * Private constructor to prevent direct instantiation
     */
    private function __construct() {
        // Load configuration if constants are defined
        if (defined('DB_HOST')) {
            $this->host = DB_HOST;
            $this->db_name = DB_NAME;
            $this->username = DB_USER;
            $this->password = DB_PASS;
        } else {
            // Default values if config is not loaded
            $this->host = 'localhost';
            $this->db_name = 'student_login_db';
            $this->username = 'root';
            $this->password = 'root';
        }
        
        try {
    
        
            // First check if database exists, if not create it
            $this->createDatabaseIfNotExists();
            
            // Connect to the database
            try {
                $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4";
                error_log("Database: Attempting to connect to {$dsn} with user {$this->username}");
                
                $this->conn = new PDO(
                    $dsn,
                    $this->username,
                    $this->password,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false
                    ]
                );
                
                error_log("Database: Connection successful");
            } catch (PDOException $e) {
                error_log("Database: Connection failed - " . $e->getMessage());
                throw $e; // Re-throw to be caught by the outer try-catch
            }
        } catch(PDOException $e) {
            $this->error = "Connection Error: " . $e->getMessage();
            error_log($this->error);
            // Don't exit here, allow the application to handle the error
        }
    }
    
    /**
     * Create database if it doesn't exist
     */
    private function createDatabaseIfNotExists() {
        try {
            error_log("Database: Attempting to connect to host {$this->host} to create database");
            $conn = new PDO(
                "mysql:host={$this->host}",
                $this->username,
                $this->password
            );
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Create database if it doesn't exist
            $sql = "CREATE DATABASE IF NOT EXISTS `{$this->db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
            error_log("Database: Executing SQL: {$sql}");
            $conn->exec($sql);
            error_log("Database: Successfully created or confirmed database {$this->db_name}");
            $conn = null; // Close connection
        } catch(PDOException $e) {
            $errorMsg = "Failed to create database: " . $e->getMessage();
            error_log("Database: {$errorMsg}");
            throw new Exception($errorMsg);
        }
    }
    
    /**
     * Get singleton instance
     * @return Database
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Get database connection
     * @return PDO|null
     */
    public function getConnection() {
        return $this->conn;
    }
    
    /**
     * Check if connection is established
     * @return bool
     */
    public function isConnected() {
        return $this->conn !== null;
    }
    
    /**
     * Get last error message
     * @return string|null
     */
    public function getError() {
        return $this->error;
    }
    
    /**
     * Execute a query with parameters
     * @param string $query SQL query
     * @param array $params Parameters for prepared statement
     * @return PDOStatement|false PDOStatement on success, false on failure
     */
    public function query($query, $params = []) {
        if ($this->conn === null) {
            $this->error = "Cannot execute query: Database connection not established";
            error_log($this->error);
            return false;
        }
        
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            return $stmt;
        } catch(PDOException $e) {
            $this->error = "Query Error: " . $e->getMessage();
            error_log($this->error);
            return false;
        }
    }
    
    /**
     * Get a single record
     * @param string $query SQL query
     * @param array $params Parameters for prepared statement
     * @return array|null
     */
    public function getRecord($query, $params = []) {
        $stmt = $this->query($query, $params);
        if ($stmt === false) {
            return null;
        }
        return $stmt->fetch() ?: null;
    }
    
    /**
     * Get multiple records
     * @param string $query SQL query
     * @param array $params Parameters for prepared statement
     * @return array
     */
    public function getRecords($query, $params = []) {
        $stmt = $this->query($query, $params);
        if ($stmt === false) {
            return [];
        }
        return $stmt->fetchAll();
    }
    
    /**
     * Insert a record and return the last insert ID
     * @param string $table Table name
     * @param array $data Associative array of column => value
     * @return int|false Last insert ID on success, false on failure
     */
    public function insert($table, $data) {
        if (empty($data)) {
            $this->error = "Cannot insert: No data provided";
            error_log($this->error);
            return false;
        }
        
        if ($this->conn === null) {
            $this->error = "Cannot insert: Database connection not established";
            error_log($this->error);
            return false;
        }
        
        try {
            $columns = implode(', ', array_keys($data));
            $placeholders = implode(', ', array_fill(0, count($data), '?'));
            
            $query = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
            error_log("Database: Executing query: {$query}");
            
            $stmt = $this->conn->prepare($query);
            $result = $stmt->execute(array_values($data));
            
            if ($result === false) {
                $this->error = "Insert failed: " . implode(', ', $stmt->errorInfo());
                error_log($this->error);
                return false;
            }
            
            $lastId = $this->conn->lastInsertId();
            error_log("Database: Insert successful. Last ID: {$lastId}");
            return $lastId;
        } catch (PDOException $e) {
            $this->error = "Insert Error: " . $e->getMessage();
            error_log($this->error);
            return false;
        }
    }
    
    /**
     * Update records
     * @param string $table Table name
     * @param array $data Associative array of column => value
     * @param string $where Where clause
     * @param array $params Parameters for where clause
     * @return int|false Number of affected rows on success, false on failure
     */
    public function update($table, $data, $where, $params = []) {
        if (empty($data)) {
            $this->error = "Cannot update: No data provided";
            error_log($this->error);
            return false;
        }
        
        $set = [];
        foreach ($data as $column => $value) {
            $set[] = "{$column} = ?";
        }
        
        $query = "UPDATE {$table} SET " . implode(', ', $set) . " WHERE {$where}";
        $stmt = $this->query($query, array_merge(array_values($data), $params));
        
        if ($stmt === false) {
            return false;
        }
        
        return $stmt->rowCount();
    }
    
    /**
     * Delete records
     * @param string $table Table name
     * @param string $where Where clause
     * @param array $params Parameters for where clause
     * @return int|false Number of affected rows on success, false on failure
     */
    public function delete($table, $where, $params = []) {
        if (empty($where)) {
            $this->error = "Cannot delete: No WHERE clause provided (unsafe)";
            error_log($this->error);
            return false;
        }
        
        $query = "DELETE FROM {$table} WHERE {$where}";
        $stmt = $this->query($query, $params);
        
        if ($stmt === false) {
            return false;
        }
        
        return $stmt->rowCount();
    }
}