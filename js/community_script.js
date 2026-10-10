// UpliftEd - Community Forum Engine

document.addEventListener('DOMContentLoaded', () => {
    // Initial Discussion Data
    let posts = [
        {
            id: 1,
            author: "Sarah Jenkins",
            role: "Student",
            time: "2 hours ago",
            title: "How to prepare for Neural Network backpropagation quiz?",
            content: "Hey everyone! I'm reviewing the Micro-Course on Neural Networks. Does anyone have quick visual tips for understanding gradient descent?",
            tag: "Homework Help",
            upvotes: 14,
            comments: [
                { author: "Dr. Alan Grant", text: "Think of gradient descent as walking down a foggy hill looking for the lowest valley!" },
                { author: "Michael Chen", text: "The 3-question quiz on UpliftEd is super helpful to test your math!" }
            ]
        },
        {
            id: 2,
            author: "Prof. David Miller",
            role: "Teacher",
            time: "5 hours ago",
            title: "New AgriTech Micro-Course: IoT Soil Telemetry",
            content: "We just launched a new course on Capacitive Soil Sensors and automated drip irrigation. Check it out under STEM courses!",
            tag: "Announcements",
            upvotes: 29,
            comments: [
                { author: "Priya Sharma", text: "Awesome! Applying this to my final semester agriculture project." }
            ]
        },
        {
            id: 3,
            author: "Carlos Ruiz",
            role: "Student",
            time: "1 day ago",
            title: "Looking for Python Study Group partners for Weekend Coding Sprint",
            content: "Hey guys! We are forming a study group for Python functions and data structures. Anyone wants to join our virtual room?",
            tag: "Study Group",
            upvotes: 8,
            comments: []
        }
    ];

    const postsContainer = document.getElementById('posts-list');
    const newPostBtn = document.getElementById('btn-new-post');
    const filterButtons = document.querySelectorAll('.forum-filter');

    let activeTag = 'all';

    function renderPosts() {
        if (!postsContainer) return;
        postsContainer.innerHTML = '';

        const filtered = posts.filter(p => activeTag === 'all' || p.tag.toLowerCase().includes(activeTag.toLowerCase()));

        if (filtered.length === 0) {
            postsContainer.innerHTML = `<div style="text-align: center; padding: 40px; color: #64748b;">No discussion threads found in this topic.</div>`;
            return;
        }

        filtered.forEach(post => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.padding = '24px';
            card.style.marginBottom = '20px';
            card.style.background = 'white';

            let commentsHtml = post.comments.map(c => `
                <div style="background: #f8fafc; padding: 10px 14px; border-radius: 8px; margin-top: 8px; font-size: 0.875rem;">
                    <strong>${c.author}:</strong> ${c.text}
                </div>
            `).join('');

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #059669 0%, #0284c7 100%); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                            ${post.author.charAt(0)}
                        </div>
                        <div>
                            <div style="font-weight: 700; font-size: 0.95rem; color: #0f172a;">${post.author} <span style="font-size: 0.75rem; font-weight: 600; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 99px; margin-left: 6px;">${post.role}</span></div>
                            <div style="font-size: 0.8rem; color: #94a3b8;">${post.time}</div>
                        </div>
                    </div>
                    <span class="lang-chip" style="font-size: 0.75rem;">${post.tag}</span>
                </div>

                <h3 style="font-size: 1.15rem; color: #0f172a; margin-bottom: 8px;">${post.title}</h3>
                <p style="font-size: 0.925rem; color: #475569; margin-bottom: 18px;">${post.content}</p>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                    <div style="display: flex; gap: 12px;">
                        <button onclick="upvotePost(${post.id})" style="border: 1px solid #e2e8f0; background: white; padding: 6px 14px; border-radius: 99px; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: #059669;">
                            <i class="fas fa-thumbs-up"></i> ${post.upvotes}
                        </button>
                        <button onclick="toggleComments(${post.id})" style="border: 1px solid #e2e8f0; background: white; padding: 6px 14px; border-radius: 99px; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: #0284c7;">
                            <i class="fas fa-comment"></i> ${post.comments.length} Comments
                        </button>
                    </div>
                </div>

                <div id="comments-section-${post.id}" style="margin-top: 15px; display: none;">
                    <div style="margin-bottom: 10px;">${commentsHtml}</div>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="input-comment-${post.id}" placeholder="Write a response..." style="flex: 1; padding: 8px 14px; border-radius: 99px; border: 1px solid #cbd5e1; outline: none; font-size: 0.85rem;">
                        <button onclick="addComment(${post.id})" class="btn btn-primary" style="padding: 6px 16px; font-size: 0.85rem;">Reply</button>
                    </div>
                </div>
            `;
            postsContainer.appendChild(card);
        });
    }

    // Handlers
    window.upvotePost = function(id) {
        const post = posts.find(p => p.id === id);
        if (post) {
            post.upvotes++;
            renderPosts();
            if (window.showToast) window.showToast('Upvoted post!', 'success');
        }
    };

    window.toggleComments = function(id) {
        const sec = document.getElementById(`comments-section-${id}`);
        if (sec) {
            sec.style.display = (sec.style.display === 'none') ? 'block' : 'none';
        }
    };

    window.addComment = function(id) {
        const input = document.getElementById(`input-comment-${id}`);
        if (!input || !input.value.trim()) return;

        const post = posts.find(p => p.id === id);
        if (post) {
            post.comments.push({ author: "You (Student)", text: input.value.trim() });
            renderPosts();
            document.getElementById(`comments-section-${id}`).style.display = 'block';
            if (window.showToast) window.showToast('Response posted!', 'success');
        }
    };

    if (filterButtons) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeTag = this.getAttribute('data-tag') || 'all';
                renderPosts();
            });
        });
    }

    // Modal for New Post
    if (newPostBtn) {
        newPostBtn.addEventListener('click', () => {
            const title = prompt("Enter Discussion Title:");
            if (!title) return;
            const content = prompt("Enter Discussion Details / Question:");
            if (!content) return;

            posts.unshift({
                id: Date.now(),
                author: "You (Learner)",
                role: "Student",
                time: "Just now",
                title: title,
                content: content,
                tag: "General Discussion",
                upvotes: 1,
                comments: []
            });

            renderPosts();
            if (window.showToast) window.showToast('Your thread has been published to the community!', 'success');
        });
    }

    renderPosts();
});