<?php
// Start session
session_start();

// Check if user is logged in
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("location: index.html");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid #ddd;
            margin-bottom: 30px;
        }
        
        .welcome {
            font-size: 24px;
            color: #333;
        }
        
        .logout {
            background: #6e48aa;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        .logout:hover {
            background: #5a3a8a;
        }
        
        .content {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .content h2 {
            color: #6e48aa;
            margin-bottom: 20px;
        }
        
        .content p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <div class="welcome">Welcome, <?php echo htmlspecialchars($_SESSION['fullname']); ?>!</div>
            <a href="logout.php" class="logout">Logout</a>
        </div>
        
        <div class="content">
            <h2>Student Dashboard</h2>
            <p>This is a simple dashboard page after successful login. In a real application, this would contain student-specific information and functionality.</p>
            <p>Your registered email: <?php echo htmlspecialchars($_SESSION['email']); ?></p>
        </div>
    </div>
</body>
</html>