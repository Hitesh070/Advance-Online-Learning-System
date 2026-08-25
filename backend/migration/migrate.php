<?php
/**
 * Migration Script for Vaxhakal Authentication System
 * 
 * This script migrates data from the old authentication system to the new one.
 * It creates the new database schema and transfers existing user data.
 */

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session
session_start();

// Include database connection
require_once __DIR__ . '/../../db_connect.php';
require_once __DIR__ . '/../database/Database.php';

// Function to log migration steps
function logMigration($message) {
    echo date('[Y-m-d H:i:s]') . " $message\n";
    
    // Also log to file
    $logFile = __DIR__ . '/migration_log.txt';
    file_put_contents($logFile, date('[Y-m-d H:i:s]') . " $message\n", FILE_APPEND);
}

// Function to execute SQL from file
function executeSQLFile($conn, $filePath) {
    $sql = file_get_contents($filePath);
    
    // Split SQL by semicolon
    $queries = explode(';', $sql);
    
    $success = true;
    $errors = [];
    
    foreach ($queries as $query) {
        $query = trim($query);
        
        if (empty($query)) {
            continue;
        }
        
        try {
            if (!$conn->query($query)) {
                $success = false;
                $errors[] = "Error executing query: {$conn->error}\nQuery: $query";
            }
        } catch (Exception $e) {
            $success = false;
            $errors[] = "Exception: {$e->getMessage()}\nQuery: $query";
        }
    }
    
    return [
        'success' => $success,
        'errors' => $errors
    ];
}

// Main migration function
function migrateDatabase() {
    global $conn;
    
    logMigration("Starting migration process");
    
    // 1. Check if old tables exist
    $result = $conn->query("SHOW TABLES LIKE 'students'");
    $oldTablesExist = $result->num_rows > 0;
    
    if (!$oldTablesExist) {
        logMigration("Error: Old tables not found. Migration aborted.");
        return false;
    }
    
    logMigration("Old tables found. Proceeding with migration.");
    
    // 2. Create new schema
    $schemaFile = __DIR__ . '/../database/schema.sql';
    
    if (!file_exists($schemaFile)) {
        logMigration("Error: Schema file not found at $schemaFile. Migration aborted.");
        return false;
    }
    
    logMigration("Creating new schema...");
    $result = executeSQLFile($conn, $schemaFile);
    
    if (!$result['success']) {
        logMigration("Error creating schema:");
        foreach ($result['errors'] as $error) {
            logMigration("  $error");
        }
        return false;
    }
    
    logMigration("New schema created successfully.");
    
    // 3. Migrate users from students table
    logMigration("Migrating users from students table...");
    
    // Get all students
    $studentsResult = $conn->query("SELECT * FROM students");
    
    if (!$studentsResult) {
        logMigration("Error fetching students: {$conn->error}");
        return false;
    }
    
    $studentCount = $studentsResult->num_rows;
    logMigration("Found $studentCount students to migrate.");
    
    // Get student role ID
    $roleResult = $conn->query("SELECT id FROM roles WHERE name = 'Student'");
    
    if (!$roleResult || $roleResult->num_rows === 0) {
        logMigration("Error: Student role not found.");
        return false;
    }
    
    $roleRow = $roleResult->fetch_assoc();
    $studentRoleId = $roleRow['id'];
    
    // Prepare insert statement
    $stmt = $conn->prepare("INSERT INTO users (email, password, fullname, role_id, created_at) VALUES (?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        logMigration("Error preparing statement: {$conn->error}");
        return false;
    }
    
    $migratedCount = 0;
    $errorCount = 0;
    
    while ($student = $studentsResult->fetch_assoc()) {
        $email = $student['email'];
        $password = $student['password']; // Already hashed in old system
        $fullname = $student['fullname'];
        $createdAt = $student['created_at'];
        
        $stmt->bind_param("sssis", $email, $password, $fullname, $studentRoleId, $createdAt);
        
        if ($stmt->execute()) {
            $migratedCount++;
        } else {
            $errorCount++;
            logMigration("Error migrating student {$student['id']}: {$stmt->error}");
        }
    }
    
    $stmt->close();
    
    logMigration("Migration completed. $migratedCount students migrated successfully. $errorCount errors encountered.");
    
    // 4. Create a backup of old tables
    logMigration("Creating backup of old tables...");
    
    $backupResult = $conn->query("CREATE TABLE students_backup LIKE students");
    if (!$backupResult) {
        logMigration("Error creating backup table: {$conn->error}");
    } else {
        $copyResult = $conn->query("INSERT INTO students_backup SELECT * FROM students");
        
        if (!$copyResult) {
            logMigration("Error copying data to backup table: {$conn->error}");
        } else {
            logMigration("Backup created successfully.");
        }
    }
    
    logMigration("Migration process completed.");
    return true;
}

// Check if this is a POST request to run the migration
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['run_migration'])) {
    $success = migrateDatabase();
    
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Migration completed successfully. See log for details.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Migration failed. See log for details.'
        ]);
    }
    
    exit;
}

// HTML interface for migration
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vaxhakal - Authentication Migration</title>
    <link rel="stylesheet" href="../../styles.css">
    <style>
        .container {
            max-width: 800px;
            margin: 50px auto;
            padding: 30px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .alert-warning {
            background-color: #fff3cd;
            color: #856404;
        }
        .alert-success {
            background-color: #d4edda;
            color: #155724;
        }
        .alert-danger {
            background-color: #f8d7da;
            color: #721c24;
        }
        button {
            padding: 10px 20px;
            background-color: #4a6cf7;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
        }
        button.danger {
            background-color: #dc3545;
        }
        button:hover {
            opacity: 0.9;
        }
        #migration-log {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            max-height: 300px;
            overflow-y: auto;
            font-family: monospace;
            margin-top: 20px;
        }
        .steps {
            margin-bottom: 20px;
        }
        .steps ol {
            padding-left: 20px;
        }
        .steps li {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Authentication System Migration</h1>
        
        <div class="alert alert-warning">
            <strong>Warning!</strong> This process will migrate data from the old authentication system to the new one.
            Please make sure you have a backup of your database before proceeding.
        </div>
        
        <div class="steps">
            <h3>Migration Steps:</h3>
            <ol>
                <li>Create new database schema (roles, permissions, users tables)</li>
                <li>Migrate existing students to the new users table</li>
                <li>Create a backup of the old tables</li>
                <li>Set up new authentication system</li>
            </ol>
        </div>
        
        <div id="result-message" style="display: none;"></div>
        
        <button id="run-migration" type="button">Run Migration</button>
        <button id="view-log" type="button" style="margin-left: 10px;">View Log</button>
        
        <div id="migration-log" style="display: none;"></div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const runMigrationBtn = document.getElementById('run-migration');
            const viewLogBtn = document.getElementById('view-log');
            const resultMessage = document.getElementById('result-message');
            const migrationLog = document.getElementById('migration-log');
            
            runMigrationBtn.addEventListener('click', async function() {
                if (!confirm('Are you sure you want to run the migration? This process cannot be undone.')) {
                    return;
                }
                
                runMigrationBtn.disabled = true;
                runMigrationBtn.textContent = 'Running Migration...';
                
                try {
                    const response = await fetch('', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: 'run_migration=1'
                    });
                    
                    const data = await response.json();
                    
                    resultMessage.className = data.success ? 'alert alert-success' : 'alert alert-danger';
                    resultMessage.textContent = data.message;
                    resultMessage.style.display = 'block';
                    
                    // Load log file
                    loadLogFile();
                } catch (error) {
                    resultMessage.className = 'alert alert-danger';
                    resultMessage.textContent = 'An error occurred: ' + error.message;
                    resultMessage.style.display = 'block';
                } finally {
                    runMigrationBtn.disabled = false;
                    runMigrationBtn.textContent = 'Run Migration';
                }
            });
            
            viewLogBtn.addEventListener('click', function() {
                if (migrationLog.style.display === 'none') {
                    loadLogFile();
                    migrationLog.style.display = 'block';
                    viewLogBtn.textContent = 'Hide Log';
                } else {
                    migrationLog.style.display = 'none';
                    viewLogBtn.textContent = 'View Log';
                }
            });
            
            async function loadLogFile() {
                try {
                    const response = await fetch('migration_log.txt');
                    
                    if (response.ok) {
                        const text = await response.text();
                        migrationLog.innerHTML = text.replace(/\n/g, '<br>');
                    } else {
                        migrationLog.innerHTML = 'No log file found or error reading log.';
                    }
                } catch (error) {
                    migrationLog.innerHTML = 'Error loading log file: ' + error.message;
                }
            }
        });
    </script>
</body>
</html>