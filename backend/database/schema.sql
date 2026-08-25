-- Database schema for user authentication

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS student_login_db;

-- Use the database
USE student_login_db;

-- Users table (enhanced from existing students table)
CREATE TABLE IF NOT EXISTS users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT(11) NOT NULL DEFAULT 1, -- Default to student role
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(100) NULL,
    reset_token VARCHAR(100) NULL,
    reset_token_expires DATETIME NULL,
    last_login DATETIME NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Role permissions (many-to-many relationship)
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT(11) NOT NULL,
    permission_id INT(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT(11) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INT(11) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('student', 'Regular student with limited permissions'),
('teacher', 'Teacher with class management permissions'),
('admin', 'Administrator with full system access')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
('view_classes', 'Can view available classes'),
('join_classes', 'Can join classes as a participant'),
('create_classes', 'Can create new classes'),
('manage_classes', 'Can manage existing classes'),
('view_users', 'Can view user profiles'),
('manage_users', 'Can manage user accounts'),
('use_camera', 'Can use camera in classes'),
('use_microphone', 'Can use microphone in classes')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Assign permissions to roles
-- Student permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 
    (SELECT id FROM roles WHERE name = 'student'),
    id FROM permissions WHERE name IN ('view_classes', 'join_classes')
ON DUPLICATE KEY UPDATE role_id = role_id;

-- Teacher permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 
    (SELECT id FROM roles WHERE name = 'teacher'),
    id FROM permissions WHERE name IN ('view_classes', 'join_classes', 'create_classes', 'manage_classes', 'use_camera', 'use_microphone')
ON DUPLICATE KEY UPDATE role_id = role_id;

-- Admin permissions (all permissions)
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 
    (SELECT id FROM roles WHERE name = 'admin'),
    id FROM permissions
ON DUPLICATE KEY UPDATE role_id = role_id;

-- Create migration for existing students to users table
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS migrate_students_to_users()
BEGIN
    -- Check if students table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'student_login_db' AND table_name = 'students') THEN
        -- Insert students into users table with student role
        INSERT INTO users (fullname, email, password, role_id, email_verified, status, created_at)
        SELECT 
            s.fullname, 
            s.email, 
            s.password, 
            (SELECT id FROM roles WHERE name = 'student'), 
            TRUE, -- Assume existing accounts are verified
            'active',
            s.created_at
        FROM students s
        LEFT JOIN users u ON s.email = u.email
        WHERE u.id IS NULL; -- Only insert if not already in users table
    END IF;
END //
DELIMITER ;

-- Call the migration procedure
CALL migrate_students_to_users();

-- Drop the procedure after use
DROP PROCEDURE IF EXISTS migrate_students_to_users;