<?php
// Include the Database class
require_once __DIR__ . '/backend/database/Database.php';

// Get database instance
$db = Database::getInstance();

// Get the connection
$conn = $db->getConnection();

// Check if connection is established
if (!$db->isConnected()) {
    die("Connection failed: " . $db->getError());
}

// Return the connection
return $conn;
?>