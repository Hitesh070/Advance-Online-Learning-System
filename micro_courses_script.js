// UpliftEd - NPTEL-Style Micro-Courses Engine with Video, Notes & Quizzes

document.addEventListener('DOMContentLoaded', () => {
    const nptelCourses = [
        {
            id: "nptel_cs201",
            code: "NPTEL-CS201",
            title: "Data Structures & Algorithms in Python",
            instructor: "Prof. Naveen Garg (IIT Delhi)",
            category: "cs",
            level: "Intermediate",
            duration: "12 Weeks (Micro-Modules)",
            enrolled: 4280,
            badge: "🏆 NPTEL DSA Scholar",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            notes: `===============================================================
NPTEL ONLINE CERTIFICATION: DATA STRUCTURES & ALGORITHMS IN PYTHON
Course Instructor: Prof. Naveen Garg, IIT Delhi
===============================================================

CHAPTER 1: ALGORITHMIC COMPLEXITY & BIG-O NOTATION
---------------------------------------------------------------
1. Definition of Big-O Notation:
   Upper bound on time complexity describing worst-case scenario.
   - O(1): Constant Time (Dictionary lookup, Array access)
   - O(log n): Logarithmic Time (Binary Search)
   - O(n): Linear Time (Single loop traversal)
   - O(n log n): Linearithmic (Merge Sort, Quick Sort)
   - O(n^2): Quadratic Time (Bubble Sort, Nested loops)

CHAPTER 2: BINARY SEARCH TREES (BST)
---------------------------------------------------------------
1. Property of BST:
   For every node X, all elements in left subtree < X and all elements in right subtree > X.
2. In-order Traversal:
   Recursively visit Left Subtree -> Root Node -> Right Subtree.
   Produces sorted sequence of keys in O(n) time.

CHAPTER 3: DYNAMIC PROGRAMMING
---------------------------------------------------------------
1. Memoization (Top-down) vs Tabulation (Bottom-up).
2. Fibonacci Sequence:
   Time Complexity reduced from O(2^n) to O(n) using space complexity O(n).
===============================================================`,
            quiz: [
                { q: "What is the worst-case time complexity of QuickSort?", options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"], answer: 1 },
                { q: "Which data structure operates on a First-In-First-Out (FIFO) basis?", options: ["Stack", "Queue", "Binary Tree", "Heap"], answer: 1 },
                { q: "What does In-Order traversal of a Binary Search Tree produce?", options: ["Reverse sorted list", "Unsorted list", "Sorted list in ascending order", "Random list"], answer: 2 }
            ]
        },
        {
            id: "nptel_ai302",
            code: "NPTEL-AI302",
            title: "Deep Learning & Neural Networks",
            instructor: "Prof. Mitesh Khapra (IIT Madras)",
            category: "ai",
            level: "Advanced",
            duration: "8 Weeks",
            enrolled: 6150,
            badge: "🧠 NPTEL AI Specialist",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            notes: `===============================================================
NPTEL ONLINE CERTIFICATION: DEEP LEARNING & NEURAL NETWORKS
Course Instructor: Prof. Mitesh Khapra, IIT Madras
===============================================================

CHAPTER 1: PERCEPTRONS & MULTI-LAYER PERCEPTRONS (MLP)
---------------------------------------------------------------
1. Biological vs Artificial Neurons:
   Inputs X_i are multiplied by weights W_i, added to bias B, and passed through activation function f(Z).
2. Activation Functions:
   - Sigmoid: f(x) = 1 / (1 + e^-x) -> Range (0, 1)
   - ReLU: f(x) = max(0, x) -> Solves vanishing gradient in deep nets

CHAPTER 2: BACKPROPAGATION & GRADIENT DESCENT
---------------------------------------------------------------
1. Chain Rule of Calculus used to compute partial derivatives of loss L w.r.t weights W.
2. Learning Rate (Alpha): Controls step size during gradient update W = W - alpha * dL/dW.
===============================================================`,
            quiz: [
                { q: "Which activation function outputs values in the range (0, 1)?", options: ["ReLU", "Sigmoid", "Tanh", "LeakyReLU"], answer: 1 },
                { q: "What is the primary purpose of backpropagation?", options: ["Data cleaning", "Calculating weight gradients to minimize loss", "Increasing model parameter count", "Faster image compression"], answer: 1 },
                { q: "What happens if the learning rate is too large?", options: ["The model converges instantly", "Gradient descent may oscillate or diverge", "Weights remain 0", "Overfitting disappears"], answer: 1 }
            ]
        },
        {
            id: "nptel_cs405",
            code: "NPTEL-CS405",
            title: "Cloud Computing & Distributed Systems",
            instructor: "Prof. Soumya Kanti Ghosh (IIT Kharagpur)",
            category: "cs",
            level: "Intermediate",
            duration: "8 Weeks",
            enrolled: 3890,
            badge: "☁️ NPTEL Cloud Architect",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            notes: `===============================================================
NPTEL ONLINE CERTIFICATION: CLOUD COMPUTING ARCHITECTURE
Course Instructor: Prof. Soumya Kanti Ghosh, IIT Kharagpur
===============================================================

CHAPTER 1: SERVICE MODELS
---------------------------------------------------------------
1. IaaS (Infrastructure as a Service): AWS EC2, Google Compute Engine.
2. PaaS (Platform as a Service): Heroku, AWS Elastic Beanstalk.
3. SaaS (Software as a Service): Google Workspace, Office 365.

CHAPTER 2: VIRTUALIZATION & CONTAINERIZATION
---------------------------------------------------------------
1. Type-1 Hypervisor (Bare-metal) vs Type-2 Hypervisor (Hosted).
2. Docker Containers share host OS kernel, providing lightweight isolated runtimes.
===============================================================`,
            quiz: [
                { q: "AWS EC2 is an example of which cloud service model?", options: ["SaaS", "PaaS", "IaaS", "DaaS"], answer: 2 },
                { q: "What is a major advantage of containers over virtual machines?", options: ["Larger memory footprint", "Shared OS kernel & faster startup", "Requires dedicated hypervisor", "No network connectivity"], answer: 1 },
                { q: "What does the CAP theorem state in distributed systems?", options: ["Choose 2 of Consistency, Availability, Partition Tolerance", "Unlimited scalability", "Zero latency network", "Constant bandwidth"], answer: 0 }
            ]
        },
        {
            id: "nptel_ag101",
            code: "NPTEL-AG101",
            title: "Smart Agriculture & Sensor Networks",
            instructor: "Prof. V.K. Tewari (IIT Kharagpur)",
            category: "stem",
            level: "Beginner",
            duration: "6 Weeks",
            enrolled: 2940,
            badge: "🌱 NPTEL Smart Agro Master",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            notes: `===============================================================
NPTEL ONLINE CERTIFICATION: SMART AGRICULTURE & IOT SENSORS
Course Instructor: Prof. V.K. Tewari, IIT Kharagpur
===============================================================

CHAPTER 1: IOT SENSORS IN PRECISION FARMING
---------------------------------------------------------------
1. Soil Moisture Telemetry: Capacitive sensors measure dielectric permittivity of soil.
2. NPK Soil Sensors: Measure Nitrogen, Phosphorus, and Potassium nutrient concentrations.
3. Automated Drip Irrigation: Saves up to 45% water compared to flood irrigation.
===============================================================`,
            quiz: [
                { q: "Which sensor measures soil moisture based on dielectric permittivity?", options: ["Capacitive Soil Moisture Sensor", "Ultrasonic Sensor", "Barometer", "Thermocouple"], answer: 0 },
                { q: "What do NPK sensors measure in precision agriculture?", options: ["Noise, Pressure, Heat", "Nitrogen, Phosphorus, Potassium", "Nickel, Lead, Potassium", "Navigational Coordinates"], answer: 1 },
                { q: "How much water can drip irrigation save compared to flood irrigation?", options: ["5%", "Up to 45%", "0%", "95%"], answer: 1 }
            ]
        }
    ];

    let completedCourses = JSON.parse(localStorage.getItem('completed_courses') || '[]');

    const coursesGrid = document.getElementById('courses-grid');
    const userBadges = document.getElementById('user-badges');
    const searchInput = document.getElementById('course-search');
    const categoryChips = document.querySelectorAll('.category-filter');

    let activeCategory = 'all';

    function renderCourses() {
        if (!coursesGrid) return;
        coursesGrid.innerHTML = '';

        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const filtered = nptelCourses.filter(c => {
            const matchCat = (activeCategory === 'all' || c.category === activeCategory);
            const matchSearch = c.title.toLowerCase().includes(query) || c.instructor.toLowerCase().includes(query) || c.code.toLowerCase().includes(query);
            return matchCat && matchSearch;
        });

        if (filtered.length === 0) {
            coursesGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">No NPTEL micro-courses found.</div>`;
            return;
        }

        filtered.forEach(c => {
            const isCompleted = completedCourses.includes(c.id);
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.padding = '24px';
            card.style.background = 'white';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <span style="font-size: 0.75rem; font-weight: 700; background: #e0f2fe; color: #0284c7; padding: 4px 10px; border-radius: 99px;">${c.code}</span>
                    <span style="font-size: 0.8rem; color: #64748b; font-weight: 600;"><i class="fa-solid fa-users"></i> ${c.enrolled} Enrolled</span>
                </div>
                <h3 style="font-size: 1.15rem; color: #0f172a; margin-bottom: 6px;">${c.title}</h3>
                <div style="font-size: 0.85rem; color: #059669; font-weight: 600; margin-bottom: 16px;"><i class="fa-solid fa-user-graduate"></i> ${c.instructor}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 14px;">
                    <span style="font-size: 0.825rem; color: #64748b; font-weight: 600;"><i class="fa-solid fa-clock"></i> ${c.duration}</span>
                    <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}" onclick="openNptelViewer('${c.id}')" style="padding: 8px 18px; font-size: 0.85rem;">
                        ${isCompleted ? 'Completed ✓' : 'Open Course'}
                    </button>
                </div>
            `;
            coursesGrid.appendChild(card);
        });

        renderBadges();
    }

    function renderBadges() {
        if (!userBadges) return;
        userBadges.innerHTML = '';
        if (completedCourses.length === 0) {
            userBadges.innerHTML = `<span style="font-size: 0.85rem; color: #94a3b8; font-style: italic;">Complete an NPTEL micro-course assessment to earn your official digital badge!</span>`;
            return;
        }

        completedCourses.forEach(id => {
            const course = nptelCourses.find(c => c.id === id);
            if (course) {
                const badge = document.createElement('span');
                badge.className = 'lang-chip active';
                badge.style.background = 'linear-gradient(135deg, #059669 0%, #0284c7 100%)';
                badge.innerText = course.badge;
                userBadges.appendChild(badge);
            }
        });
    }

    if (categoryChips) {
        categoryChips.forEach(chip => {
            chip.addEventListener('click', function() {
                categoryChips.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                activeCategory = this.getAttribute('data-category') || 'all';
                renderCourses();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', renderCourses);
    }

    // NPTEL Course Viewer Modal (Video + Downloadable Notes + Quiz)
    window.openNptelViewer = function(courseId) {
        const course = nptelCourses.find(c => c.id === courseId);
        if (!course) return;

        let modal = document.getElementById('nptel-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'nptel-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.background = 'rgba(15, 23, 42, 0.7)';
            modal.style.backdropFilter = 'blur(8px)';
            modal.style.zIndex = '3000';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.padding = '20px';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div style="background: white; width: 100%; max-width: 780px; border-radius: 24px; padding: 28px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); max-height: 90vh; overflow-y: auto; position: relative;">
                <button onclick="closeNptelViewer()" style="position: absolute; top: 20px; right: 20px; border: none; background: #f1f5f9; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; font-weight: bold; font-size: 1.1rem;">✕</button>
                
                <div style="margin-bottom: 20px;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: #0284c7; text-transform: uppercase;">NPTEL Official Learning Module</span>
                    <h2 style="font-size: 1.4rem; color: #0f172a; margin-top: 4px;">${course.code}: ${course.title}</h2>
                    <div style="font-size: 0.875rem; color: #059669; font-weight: 600;">${course.instructor}</div>
                </div>

                <!-- Tabs: Video, Notes, Assessment -->
                <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">
                    <button class="lang-chip active nptel-tab" onclick="switchNptelTab('video')"><i class="fa-solid fa-circle-play"></i> Lecture Video</button>
                    <button class="lang-chip nptel-tab" onclick="switchNptelTab('notes')"><i class="fa-solid fa-file-lines"></i> Lecture Notes</button>
                    <button class="lang-chip nptel-tab" onclick="switchNptelTab('quiz')"><i class="fa-solid fa-pen-to-square"></i> NPTEL Quiz & Assignment</button>
                </div>

                <!-- Tab 1: Video Player -->
                <div id="nptel-tab-video" class="nptel-tab-content">
                    <div style="background: #0f172a; border-radius: 16px; overflow: hidden; height: 320px; display: flex; align-items: center; justify-content: center; position: relative;">
                        <video controls style="width: 100%; height: 100%; object-fit: cover;">
                            <source src="${course.videoUrl}" type="video/mp4">
                            Your browser does not support HTML5 video.
                        </video>
                    </div>
                </div>

                <!-- Tab 2: Lecture Notes -->
                <div id="nptel-tab-notes" class="nptel-tab-content" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="margin: 0; color: #0f172a;">Official Course Notes</h4>
                        <button onclick="downloadCourseNotes('${course.id}')" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.8rem;"><i class="fa-solid fa-download"></i> Download Notes (.txt)</button>
                    </div>
                    <pre style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; font-family: monospace; font-size: 0.85rem; color: #334155; max-height: 280px; overflow-y: auto; white-space: pre-wrap;">${course.notes}</pre>
                </div>

                <!-- Tab 3: Quiz -->
                <div id="nptel-tab-quiz" class="nptel-tab-content" style="display: none;">
                    <form id="nptel-quiz-form">
                        ${course.quiz.map((q, idx) => `
                            <div style="background: #f8fafc; padding: 14px 18px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 14px;">
                                <p style="font-weight: 700; font-size: 0.925rem; color: #0f172a; margin-bottom: 8px;">Q${idx + 1}: ${q.q}</p>
                                ${q.options.map((opt, optIdx) => `
                                    <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 0.875rem; cursor: pointer;">
                                        <input type="radio" name="q${idx}" value="${optIdx}" required>
                                        <span>${opt}</span>
                                    </label>
                                `).join('')}
                            </div>
                        `).join('')}
                        <div style="text-align: right; margin-top: 16px;">
                            <button type="submit" class="btn btn-primary"><i class="fa-solid fa-paper-plane"></i> Submit NPTEL Assignment</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        modal.style.display = 'flex';

        // Quiz Submission
        document.getElementById('nptel-quiz-form').addEventListener('submit', (e) => {
            e.preventDefault();
            let score = 0;
            course.quiz.forEach((q, idx) => {
                const selected = document.querySelector(`input[name="q${idx}"]:checked`);
                if (selected && parseInt(selected.value) === q.answer) score++;
            });

            if (score >= 2) {
                if (!completedCourses.includes(course.id)) {
                    completedCourses.push(course.id);
                    localStorage.setItem('completed_courses', JSON.stringify(completedCourses));
                }
                if (window.showToast) window.showToast(`Passed NPTEL Assessment (${score}/${course.quiz.length})! Unlocked ${course.badge}!`, 'success');
            } else {
                if (window.showToast) window.showToast(`Score: ${score}/${course.quiz.length}. Try again to pass.`, 'danger');
            }

            closeNptelViewer();
            renderCourses();
        });
    };

    window.switchNptelTab = function(tabName) {
        document.querySelectorAll('.nptel-tab-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.nptel-tab').forEach(el => el.classList.remove('active'));

        const target = document.getElementById(`nptel-tab-${tabName}`);
        if (target) target.style.display = 'block';
    };

    window.closeNptelViewer = function() {
        const modal = document.getElementById('nptel-modal');
        if (modal) modal.style.display = 'none';
    };

    window.downloadCourseNotes = function(courseId) {
        const course = nptelCourses.find(c => c.id === courseId);
        if (!course) return;

        const blob = new Blob([course.notes], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${course.code}_Lecture_Notes.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.showToast) window.showToast('Downloaded NPTEL lecture notes!', 'success');
    };

    renderCourses();
});