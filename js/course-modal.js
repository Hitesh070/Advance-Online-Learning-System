// Course data (in a real application, this would come from a backend)
const courseData = {
    'python': {
        title: 'Python Programming',
        image: 'images/courses/python.jpg',
        level: 'Beginner',
        duration: '8 weeks',
        students: '1,234 enrolled',
        description: 'Learn Python programming from scratch. This comprehensive course covers basic to advanced concepts including data structures, algorithms, and object-oriented programming.',
        curriculum: [
            'Introduction to Python',
            'Data Types and Variables',
            'Control Flow and Functions',
            'Object-Oriented Programming',
            'Working with Files and APIs'
        ],
        requirements: [
            'Basic computer knowledge',
            'No prior programming experience required',
            'Computer with internet connection'
        ],
        instructor: {
            name: 'John Doe',
            title: 'Senior Python Developer',
            bio: '10+ years of experience in Python development and teaching'
        }
    },
    'spanish': {
        title: 'Spanish Language',
        image: 'images/courses/spanish.jpg',
        level: 'Intermediate',
        duration: '12 weeks',
        students: '856 enrolled',
        description: 'Master Spanish language with our comprehensive course. Learn grammar, vocabulary, and conversation skills through interactive lessons.',
        curriculum: [
            'Spanish Grammar Basics',
            'Vocabulary Building',
            'Conversation Practice',
            'Reading and Writing Skills',
            'Cultural Understanding'
        ],
        requirements: [
            'Basic Spanish knowledge',
            'Dedication to practice daily',
            'Microphone for speaking exercises'
        ],
        instructor: {
            name: 'Maria Garcia',
            title: 'Native Spanish Teacher',
            bio: '8+ years of experience teaching Spanish to international students'
        }
    },
    'marketing': {
        title: 'Digital Marketing',
        image: 'images/courses/marketing.jpg',
        level: 'Advanced',
        duration: '10 weeks',
        students: '2,145 enrolled',
        description: 'Learn modern digital marketing strategies and tools. Master SEO, social media marketing, content marketing, and paid advertising.',
        curriculum: [
            'Digital Marketing Overview',
            'SEO and Content Strategy',
            'Social Media Marketing',
            'Email Marketing',
            'Analytics and Optimization'
        ],
        requirements: [
            'Basic marketing knowledge',
            'Social media familiarity',
            'Google Analytics account'
        ],
        instructor: {
            name: 'Sarah Johnson',
            title: 'Digital Marketing Strategist',
            bio: '12+ years of experience in digital marketing and brand development'
        }
    },
    'quantum': {
        title: 'Quantum Physics',
        image: 'images/courses/quantum.jpg',
        level: 'Advanced',
        duration: '16 weeks',
        students: '543 enrolled',
        description: 'Explore the fascinating world of quantum physics. Learn about quantum mechanics, wave functions, and quantum computing principles.',
        curriculum: [
            'Quantum Mechanics Fundamentals',
            'Wave Functions and Operators',
            'Quantum Entanglement',
            'Quantum Computing Basics',
            'Applications in Modern Physics'
        ],
        requirements: [
            'Strong mathematics background',
            'Basic physics knowledge',
            'Calculus and linear algebra proficiency'
        ],
        instructor: {
            name: 'Dr. Robert Chen',
            title: 'Quantum Physics Professor',
            bio: 'PhD in Quantum Physics with 15+ years of research and teaching experience'
        }
    }
};

// Modal elements
const modal = document.getElementById('courseDetailModal');
const closeBtn = modal.querySelector('.close');

// Close modal when clicking the close button or outside the modal
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Function to show course details
function showCourseDetails(courseId) {
    const course = courseData[courseId];
    if (!course) return;

    // Update modal content
    document.getElementById('modalCourseImage').src = course.image;
    document.getElementById('modalCourseTitle').textContent = course.title;
    document.getElementById('modalCourseLevel').textContent = course.level;
    document.getElementById('modalCourseDuration').textContent = course.duration;
    document.getElementById('modalCourseStudents').textContent = course.students;
    document.getElementById('modalCourseDescription').textContent = course.description;

    // Update curriculum list
    const curriculumList = document.getElementById('modalCourseCurriculum');
    curriculumList.innerHTML = course.curriculum
        .map(item => `<li>${item}</li>`)
        .join('');

    // Update requirements list
    const requirementsList = document.getElementById('modalCourseRequirements');
    requirementsList.innerHTML = course.requirements
        .map(item => `<li>${item}</li>`)
        .join('');

    // Update instructor info
    const instructorDiv = document.getElementById('modalCourseInstructor');
    instructorDiv.innerHTML = `
        <h4>${course.instructor.name}</h4>
        <p>${course.instructor.title}</p>
        <p>${course.instructor.bio}</p>
    `;

    // Show modal
    modal.style.display = 'block';
}

// Function to enroll in a course
function enrollCourse() {
    alert('Enrollment functionality will be implemented soon!');
    modal.style.display = 'none';
}