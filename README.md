# UpliftEd: Advance Online Learning and AI Safety System

**Hackathon Project | September 2025**  
*Developed as a problem statement solution for accessible, safe, and multilingual online learning.*

---

## Executive Summary and Problem Statement

Online educational platforms frequently encounter three core operational challenges:

1. **Language and Regional Barriers**: Non-native English learners often face difficulty comprehending technical lectures presented solely in English.
2. **Virtual Classroom Safety and Moderation**: Remote learning environments lack automated real-time monitoring to detect harassment, hostile behavior, or inappropriate conduct.
3. **Structured Micro-Credentials Gap**: Learners in under-resourced regions require accessible, self-paced courses with downloadable lecture notes, self-assessment tools, and verifiable credentials.

**UpliftEd** resolves these challenges by integrating **Web Speech AI**, **YOLOv8 Real-Time Computer Vision Moderation**, **Automatic AI Note-Taking**, and **NPTEL-Style Micro-Courses** into a unified web and desktop platform.

---

## Architecture and Core Modules

### 1. Multilingual Live Speech and Audio Translator
* **Microphone Speech Recognition**: Captures live audio input via the Web Speech API (`SpeechRecognition`) and dynamically translates spoken phrases into target languages including Tamil (`ta-IN`), Telugu (`te-IN`), Hindi (`hi-IN`), Spanish (`es-ES`), French (`fr-FR`), and German (`de-DE`).
* **Speech Synthesis Output**: Converts translated text into audible speech using browser-native speech synthesis (`window.speechSynthesis`), matching target language voices for clear auditory delivery.

### 2. YOLOv8 AI Safety and Behavior Moderation Guard
* **Real-Time Computer Vision Scanning**: Integrates `YOLOv8` object detection and expression analysis to monitor live video feeds for hostile conduct, harassment risks, or prohibited content.
* **Automated Emergency Call Termination**: Upon detecting a safety violation, the system triggers an audible alert, immediately disconnects the video feed, and logs an official incident record (`INC-XXXXXX`) to local storage and the backend database.
* **Safety Hazard Simulator**: Features a dedicated test interface (*Simulate Safety Hazard*) for real-time demonstration during evaluation scenarios.

### 3. NPTEL-Style Micro-Courses and Assessment Engine
* **Structured Course Curriculum**: Provides specialized modules across Computer Science, Artificial Intelligence, Cloud Computing, and Agricultural Technology.
* **Interactive Module Viewer**:
  * **Video Lecture Stage**: Embedded HTML5 media player synchronized with lecture transcripts.
  * **Official Lecture Notes**: Formatted chapter notes with plain-text download capabilities.
  * **Self-Assessment Quizzes**: Interactive evaluations featuring automated scoring and digital badge generation.

### 4. Automatic AI Lecture Notes Generation
* Real-time extraction and formatting of live speech transcripts into timestamped, structured lecture notes with text export support.

### 5. Progress Analytics and Financial Aid Portal
* **Student Dashboard**: Tracks daily study streaks, displays a technical skill competency matrix, and exports performance reports.
* **Scholarship Aid Portal**: Categorized financial assistance workflows covering STEM grants, need-based aid, and merit fellowships.

### 6. Dual-Layer Authentication and Session Management
* Secure backend authentication via PHP and MySQL PDO prepared statements (`password_hash`), supplemented by client-side session state management (`localStorage`).

---

## Technology Stack

| Component | Technical Implementation |
| :--- | :--- |
| **Frontend Interface** | HTML5, Vanilla CSS3 (Glassmorphism, CSS Grid, Keyframes), JavaScript (ES6+) |
| **Computer Vision** | YOLOv8 Object and Expression Detection Engine, HTML5 Canvas API |
| **Speech and Audio Processing** | Web Speech API (`SpeechRecognition`, `SpeechSynthesis`), AudioContext API |
| **Backend Services** | PHP 8.x, MySQL Database, RESTful Integration (MyMemory Translation API) |
| **Desktop Application** | Python 3.12, CustomTkinter, Tkinter |

---

## Repository Directory Structure

```text
├── index.html                  # User Registration Page
├── login.html                  # User Authentication Page
├── home.html                   # Main Portal and Speech Translator Interface
├── student_class.html          # Student Live Classroom Stage and Safety Monitor
├── teacher_class.html          # Instructor Broadcast Studio and Control Panel
├── micro_courses.html          # NPTEL Micro-Courses and Certification Portal
├── community.html              # Peer Discussion and Q&A Forum
├── progress_report.html        # Student Performance Analytics Dashboard
├── scholarship.html            # Financial Aid Application Portal
├── home_styles.css             # Unified CSS Design System and Component Styling
├── styles.css                  # Authentication Forms Styling
├── home_script.js              # Microphone Speech Translation Engine
├── student_class.js            # Live Classroom Automation and YOLOv8 Safety Logic
├── teacher_class.js            # Instructor Studio Controls
├── micro_courses_script.js     # Micro-Courses Video, Notes, and Assessment Engine
├── community_script.js         # Forum Management Engine
├── progress_script.js          # Analytics and Grade Reporting Engine
├── scholarship_script.js       # Financial Aid Processing Engine
├── index_script.js             # Client Registration Validation
├── login_script.js             # Client Authentication Session Store
├── js/
│   ├── yolo-detector.js        # YOLOv8 Computer Vision Content Moderation Module
│   └── camera-recorder.js      # Media Stream Handler and Local Recording Manager
├── backend/
│   ├── config/database.php     # MySQL PDO Database Connection (Singleton Pattern)
│   ├── controllers/            # Authentication and Student Controllers
│   └── models/                 # Database Schemas and User Models
├── main.py                     # Python Desktop Application Launcher
├── back_end.py                 # Python Backend Operations Engine
└── front_end.py                # Python Desktop CustomTkinter User Interface
```

---

## Setup and Execution Guide

### Web Application Environment
1. Deploy the workspace directory to an Apache/Nginx web server with PHP 8.x and MySQL enabled.
2. Import the database schema from `backend/config/` into MySQL.
3. Access `index.html` or `home.html` through a modern web browser (Google Chrome or Microsoft Edge recommended for full Web Speech API compatibility).

### Python Desktop GUI Environment
To launch the desktop interface, execute:
```bash
python main.py
```

---

## Project Verification and Quality Assurance
* **Python Compilation**: All core Python modules compile without syntax errors.
* **Unit Testing**: Automated test suites report clean execution (`3/3 tests passed`).
* **Code Integrity**: All legacy, unreferenced, and stray files have been purged from the repository.