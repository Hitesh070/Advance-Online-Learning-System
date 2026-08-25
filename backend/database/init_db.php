<?php
// Database initialization script

// Include configuration file
require_once __DIR__ . '/../../backend/config.php';

// Check if PDO extension is loaded
if (!extension_loaded('pdo')) {
    error_log("PDO extension is not loaded. Please enable it in your PHP configuration.");
    die("PDO extension is not loaded. Please enable it in your PHP configuration.\n");
}

try {
    error_log("Initializing database: " . DB_NAME);
    
    // Connect to MySQL server without selecting a database
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    error_log("Database '" . DB_NAME . "' created or already exists.");
    
    // Connect to the database
    $pdo->exec("USE `" . DB_NAME . "`");
    
    // Check if schema.sql file exists
    $schemaFile = __DIR__ . '/schema.sql';
    if (!file_exists($schemaFile)) {
        error_log("Schema file not found: $schemaFile");
        die("Schema file not found: $schemaFile\n");
    }
    
    // Read and execute schema.sql
    $sql = file_get_contents($schemaFile);
    
    // Split SQL by semicolons to execute each statement separately
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                error_log("Error executing SQL statement: " . $e->getMessage());
                error_log("Statement: " . $statement);
                // Continue with next statement instead of dying
            }
        }
    }
    
    error_log("Database schema initialized successfully.");
    echo "Database schema initialized successfully.\n";
    
} catch (PDOException $e) {
    error_log("Database initialization failed: " . $e->getMessage());
    die("Database initialization failed: " . $e->getMessage() . "\n");
}
?>