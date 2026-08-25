// DOM Elements
const categoryLinks = document.querySelectorAll('.category-list li a');
const filterButtons = document.querySelectorAll('.filter-btn');
const voteButtons = document.querySelectorAll('.vote-btn');
const createPostBtn = document.querySelector('.create-post-btn');
const postsList = document.querySelector('.posts-list');
const searchInput = document.querySelector('.search-bar input');

// Post Data Structure
let posts = [
    {
        id: 1,
        title: 'Best practices for real-time translation in a classroom setting?',
        category: 'Teaching',
        author: 'TeacherJane',
        time: '2 hours ago',
        content: 'I\'m teaching a class with students from multiple language backgrounds. What are some effective strategies for using the translation features?',
        votes: 42,
        comments: 15,
        views: 230,
        tags: ['translation', 'teaching', 'multilingual'],
        userVote: null
    },
    {
        id: 2,
        title: 'How to prepare materials for a multilingual classroom?',
        category: 'Resources',
        author: 'EducatorMike',
        time: '1 day ago',
        content: 'I\'m creating slides and handouts for my class. What\'s the best way to structure these for automatic translation?',
        votes: 28,
        comments: 8,
        views: 175,
        tags: ['resources', 'materials', 'preparation'],
        userVote: null
    },
    {
        id: 3,
        title: 'Technical issues with audio translation - any solutions?',
        category: 'Help & Support',
        author: 'StudentAlex',
        time: '3 days ago',
        content: 'I\'m experiencing some lag with the real-time translation during fast-paced discussions. Has anyone found ways to optimize this?',
        votes: 35,
        comments: 22,
        views: 310,
        tags: ['technical', 'audio', 'troubleshooting'],
        userVote: null,
        solved: true
    }
];

// Category Filter
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // Remove active class from all links
        categoryLinks.forEach(l => l.parentElement.classList.remove('active'));
        // Add active class to clicked link
        link.parentElement.classList.add('active');
        
        const category = link.textContent.trim();
        filterPostsByCategory(category);
    });
});

// Post Filters (Latest, Top, Hot, Unanswered)
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.textContent.toLowerCase();
        filterPosts(filter);
    });
});

// Voting System
function handleVote(postId, direction) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Remove previous vote if exists
    if (post.userVote === direction) {
        post.votes -= direction;
        post.userVote = null;
    } else {
        // Add new vote
        if (post.userVote) {
            post.votes -= post.userVote;
        }
        post.votes += direction;
        post.userVote = direction;
    }

    updatePostVoteDisplay(postId);
}

// Update vote display
function updatePostVoteDisplay(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (!postElement) return;

    const voteCount = postElement.querySelector('.vote-count');
    const upvoteBtn = postElement.querySelector('.vote-btn:first-child');
    const downvoteBtn = postElement.querySelector('.vote-btn:last-child');

    voteCount.textContent = post.votes;
    upvoteBtn.classList.toggle('voted', post.userVote === 1);
    downvoteBtn.classList.toggle('voted', post.userVote === -1);
}

// Initialize vote buttons
function initializeVoteButtons() {
    // Select all vote buttons directly
    document.querySelectorAll('.vote-btn').forEach(button => {
        // Get post ID from the button's data attribute
        const postId = parseInt(button.getAttribute('data-post-id'));
        if (isNaN(postId) || postId === 0) return;
        
        // Get vote direction from the button's data attribute
        const direction = button.getAttribute('data-direction');
        const voteValue = direction === 'up' ? 1 : -1;
        
        // Remove any existing event listeners
        button.removeEventListener('click', () => handleVote(postId, voteValue));
        
        // Add new event listener
        button.addEventListener('click', () => handleVote(postId, voteValue));
    });
}

// Create Post Modal
function createPostModal() {
    const modal = document.createElement('div');
    modal.className = 'create-post-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Create New Post</h2>
                <button class="modal-close">&times;</button>
            </div>
            <form class="post-form">
                <div class="form-group">
                    <label for="post-title">Title</label>
                    <input type="text" id="post-title" required>
                </div>
                <div class="form-group">
                    <label for="post-category">Category</label>
                    <select id="post-category" required>
                        <option value="Teaching">Teaching</option>
                        <option value="Learning">Learning</option>
                        <option value="Translation">Translation</option>
                        <option value="Technology">Technology</option>
                        <option value="Resources">Resources</option>
                        <option value="Help & Support">Help & Support</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="post-content">Content</label>
                    <textarea id="post-content" required></textarea>
                </div>
                <div class="form-group">
                    <label for="post-tags">Tags (comma separated)</label>
                    <input type="text" id="post-tags" placeholder="e.g. translation, teaching, tips">
                </div>
                <button type="submit" class="btn btn-primary">Create Post</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
}

// Initialize modal and its controls
function initializeModal() {
    const modal = createPostModal();
    
    // Open modal
    createPostBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal with X button
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle post creation
    modal.querySelector('.post-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value;
        const tags = document.getElementById('post-tags').value
            .split(',').map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const newPost = {
            id: posts.length + 1,
            title,
            category,
            author: 'CurrentUser', // Replace with actual user data
            time: 'Just now',
            content,
            votes: 0,
            comments: 0,
            views: 0,
            tags,
            userVote: null
        };

        posts.unshift(newPost);
        renderPosts();
        modal.style.display = 'none';
        e.target.reset();
    });
}

// Search functionality
function initializeSearch() {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            filterPostsBySearch(searchTerm);
        }, 300);
    });
}

// Filter functions
function filterPostsByCategory(category) {
    const filteredPosts = category === 'All Topics' 
        ? posts 
        : posts.filter(post => post.category === category);
    renderPosts(filteredPosts);
}

function filterPosts(filter) {
    let filteredPosts = [...posts];
    switch(filter) {
        case 'top':
            filteredPosts.sort((a, b) => b.votes - a.votes);
            break;
        case 'hot':
            filteredPosts.sort((a, b) => (b.comments + b.views) - (a.comments + a.views));
            break;
        case 'unanswered':
            filteredPosts = filteredPosts.filter(post => post.comments === 0);
            break;
        // 'latest' is default, posts are already sorted by time
    }
    renderPosts(filteredPosts);
}

function filterPostsBySearch(searchTerm) {
    if (!searchTerm) {
        renderPosts(posts);
        return;
    }
    
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    renderPosts(filteredPosts);
}

// Render posts
function renderPosts(postsToRender = posts) {
    postsList.innerHTML = postsToRender.map(post => `
        <div class="post-item" data-post-id="${post.id}">
            <div class="post-votes">
                <button class="vote-btn ${post.userVote === 1 ? 'voted' : ''}" data-direction="up" data-post-id="${post.id}"><i class="fas fa-chevron-up"></i></button>
                <span class="vote-count">${post.votes}</span>
                <button class="vote-btn ${post.userVote === -1 ? 'voted' : ''}" data-direction="down" data-post-id="${post.id}"><i class="fas fa-chevron-down"></i></button>
            </div>
            <div class="post-content">
                <h3 class="post-title"><a href="#">${post.title}</a></h3>
                <div class="post-meta">
                    <span class="post-category">${post.category}</span>
                    <span class="post-time">${post.time}</span>
                    <span class="post-author">by <a href="#">${post.author}</a></span>
                </div>
                <p class="post-excerpt">${post.content}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<a href="#" class="tag">#${tag}</a>`).join('')}
                </div>
                <div class="post-stats">
                    <span><i class="fas fa-comment"></i> ${post.comments} comments</span>
                    ${post.solved ? '<span><i class="fas fa-check-circle solved"></i> Solved</span>' : ''}
                    <span><i class="fas fa-eye"></i> ${post.views} views</span>
                </div>
            </div>
        </div>
        </div>
    `).join('');

    initializeVoteButtons();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Wait a short time to ensure community_script.js has initialized
    setTimeout(() => {
        // Remove existing event listeners from community_script.js
        $('.vote-btn').off('click');
        $('.filter-btn').off('click');
        $('.category-list li a').off('click');
        $('.create-post-btn').off('click');
        $('.search-bar button').off('click');
        $('.search-bar input').off('keypress');
        $('.page-link').off('click');
        $('.btn-block').off('click');
        
        // Initialize our functionality
        renderPosts();
        initializeModal();
        initializeSearch();
    }, 100);
});