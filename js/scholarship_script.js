// UpliftEd - Scholarship & Financial Aid Portal Engine

document.addEventListener('DOMContentLoaded', () => {
    const grantsData = [
        {
            id: "grant1",
            title: "Global STEM Education Fund",
            category: "stem",
            amount: "$2,500 / year",
            deadline: "August 30, 2026",
            eligibility: "GPA 3.2+ or Grade 80%+, enrolled in STEM/Tech Micro-Course.",
            description: "Covers tuition, learning hardware, and internet access for high-achieving STEM students."
        },
        {
            id: "grant2",
            title: "Rural Learner Empowerment Aid",
            category: "need",
            amount: "$1,800 / year",
            deadline: "September 15, 2026",
            eligibility: "Rural background or income under threshold.",
            description: "Financial grant designed to assist students from agricultural and underserved regions."
        },
        {
            id: "grant3",
            title: "Women in Technology Fellowship",
            category: "merit",
            amount: "$3,000 / year",
            deadline: "October 1, 2026",
            eligibility: "Female students pursuing Computer Science or AI micro-credentials.",
            description: "Empowering next-generation female engineers and data scientists."
        }
    ];

    let userApplications = JSON.parse(localStorage.getItem('scholarship_applications') || '[]');

    const grantsContainer = document.getElementById('grants-list');
    const appsContainer = document.getElementById('my-applications');
    const filterBtns = document.querySelectorAll('.grant-filter');

    let activeFilter = 'all';

    function renderGrants() {
        if (!grantsContainer) return;
        grantsContainer.innerHTML = '';

        const filtered = grantsData.filter(g => activeFilter === 'all' || g.category === activeFilter);

        filtered.forEach(g => {
            const hasApplied = userApplications.some(app => app.grantId === g.id);

            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.padding = '24px';
            card.style.background = 'white';
            card.style.marginBottom = '20px';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                        <span style="font-size: 0.75rem; font-weight: 700; background: #d1fae5; color: #059669; padding: 4px 10px; border-radius: 99px; text-transform: uppercase;">${g.category}</span>
                        <h3 style="font-size: 1.25rem; color: #0f172a; margin-top: 8px;">${g.title}</h3>
                    </div>
                    <span style="font-size: 1.2rem; font-weight: 800; color: #059669; background: #f0fdf4; padding: 6px 14px; border-radius: 12px; border: 1px solid #bbf7d0;">${g.amount}</span>
                </div>
                <p style="font-size: 0.9rem; color: #475569; margin-bottom: 14px;">${g.description}</p>
                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 18px;">
                    <strong>Eligibility:</strong> ${g.eligibility}<br>
                    <strong>Application Deadline:</strong> ${g.deadline}
                </div>
                <button class="btn ${hasApplied ? 'btn-secondary' : 'btn-primary'}" onclick="openApplyModal('${g.id}')" ${hasApplied ? 'disabled' : ''}>
                    ${hasApplied ? 'Application Submitted ✓' : 'Apply For Aid'}
                </button>
            `;
            grantsContainer.appendChild(card);
        });

        renderApplications();
    }

    function renderApplications() {
        if (!appsContainer) return;
        appsContainer.innerHTML = '';

        if (userApplications.length === 0) {
            appsContainer.innerHTML = `<div style="font-size: 0.85rem; color: #94a3b8; italic">No active applications. Select a grant above to apply!</div>`;
            return;
        }

        userApplications.forEach(app => {
            const item = document.createElement('div');
            item.style.padding = '12px 16px';
            item.style.background = '#f8fafc';
            item.style.borderRadius = '10px';
            item.style.marginBottom = '10px';
            item.style.border = '1px solid #e2e8f0';
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';

            item.innerHTML = `
                <div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: #0f172a;">${app.grantTitle}</div>
                    <div style="font-size: 0.775rem; color: #64748b;">Applied on ${app.date}</div>
                </div>
                <span style="font-size: 0.75rem; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 4px 10px; border-radius: 99px;">${app.status}</span>
            `;
            appsContainer.appendChild(item);
        });
    }

    window.openApplyModal = function(grantId) {
        const grant = grantsData.find(g => g.id === grantId);
        if (!grant) return;

        const studentName = prompt(`Applying for: ${grant.title}\n\nEnter your Full Name:`);
        if (!studentName) return;

        const statement = prompt("Brief Statement of Need / Academic Goal:");
        if (!statement) return;

        userApplications.push({
            grantId: grant.id,
            grantTitle: grant.title,
            studentName: studentName,
            date: new Date().toLocaleDateString(),
            status: "Under Review"
        });

        localStorage.setItem('scholarship_applications', JSON.stringify(userApplications));
        if (window.showToast) window.showToast(`Application for ${grant.title} submitted successfully!`, 'success');
        renderGrants();
    };

    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeFilter = this.getAttribute('data-category') || 'all';
                renderGrants();
            });
        });
    }

    renderGrants();
});