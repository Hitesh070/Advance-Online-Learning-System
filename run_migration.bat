@echo off
echo Running database migration...

REM Check if PHP is installed
where php >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo PHP is not installed or not in your PATH.
    echo Please install PHP or add it to your PATH.
    echo You can download PHP from https://windows.php.net/download/
    pause
    exit /b 1
)

REM Run the migration script
php backend/migration/migrate.php

if %ERRORLEVEL% NEQ 0 (
    echo Migration failed.
    pause
    exit /b 1
) else (
    echo Migration completed successfully.
    pause
)