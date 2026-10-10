# Database Setup Instructions

## Configuration

The database connection has been configured with the following settings:

- **Host**: localhost
- **Database Name**: student_login_db
- **Username**: root
- **Password**: root

## Setup Options

### Option 1: Automatic Setup (Recommended)

1. Make sure MySQL server is installed and running
2. Ensure PHP is installed and in your system PATH
3. Run the migration script by double-clicking `run_migration.bat`

This will:
- Create the database if it doesn't exist
- Create all required tables
- Set up initial data (roles, permissions)

### Option 2: Manual Setup

1. Log in to your MySQL server:
   ```
   mysql -u root -p
   ```
   When prompted, enter the password: `root`

2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS student_login_db;
   ```

3. Import the schema:
   ```
   mysql -u root -p student_login_db < backend/database/schema.sql
   ```

## Verifying Connection

If you have PHP installed, you can verify the database connection by accessing:
- http://localhost:8000/test_db_connection.php (if using the Python server)

## Troubleshooting

If you encounter connection issues:

1. Verify MySQL server is running
2. Check that the username and password are correct
3. Ensure the host is correct (usually 'localhost' for local development)
4. Confirm you have permissions to create databases
5. Check PHP error logs for specific error messages

## Database Structure

The database includes the following tables:
- users: Stores user account information
- roles: Defines user roles (student, teacher, admin)
- permissions: Lists available system permissions
- role_permissions: Maps permissions to roles
- sessions: Tracks active user sessions