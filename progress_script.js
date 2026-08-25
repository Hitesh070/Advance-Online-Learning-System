// UpliftEd - Progress & Performance Analytics Engine

document.addEventListener('DOMContentLoaded', () => {
    const reportData = {
        studentName: "Alex Mercer",
        rollNo: "STU-2026-088",
        streakDays: 7,
        coursesCompleted: 12,
        hoursSpent: 87,
        certificates: 5,
        grades: [
            { course: "Python for Beginners", score: 95.0, status: "Passed", date: "2026-07-28" },
            { course: "Introduction to Neural Networks", score: 88.0, status: "Passed", date: "2026-07-25" },
            { course: "Data Visualization with Pandas", score: 92.5, status: "Passed", date: "2026-07-20" },
            { course: "Smart Irrigation & Soil Tech", score: 84.0, status: "Passed", date: "2026-07-15" }
        ]
    };

    const tableBody = document.getElementById('report-table-body');
    const downloadBtn = document.getElementById('btn-download-report');

    function renderReport() {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        reportData.grades.forEach(g => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #f1f5f9';
            tr.innerHTML = `
                <td style="padding: 14px; font-weight: 600; color: #0f172a;">${g.course}</td>
                <td style="padding: 14px; color: #64748b;">${g.date}</td>
                <td style="padding: 14px; text-align: center;">
                    <span style="font-weight: 700; color: #059669; background: #d1fae5; padding: 4px 12px; border-radius: 99px; font-size: 0.85rem;">${g.score}%</span>
                </td>
                <td style="padding: 14px; text-align: center;">
                    <span style="color: #10b981; font-weight: 600; font-size: 0.85rem;"><i class="fas fa-check-circle"></i> ${g.status}</span>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const reportText = `
=================================================
UPLIFTED ONLINE LEARNING SYSTEM - PROGRESS REPORT
=================================================
Student Name: ${reportData.studentName}
Roll Number: ${reportData.rollNo}
Current Streak: ${reportData.streakDays} Days 🔥
Total Courses Completed: ${reportData.coursesCompleted}
Total Learning Hours: ${reportData.hoursSpent} Hours
Certificates Earned: ${reportData.certificates}

GRADE BREAKDOWN:
-------------------------------------------------
${reportData.grades.map(g => `- ${g.course}: ${g.score}% (${g.status}) on ${g.date}`).join('\n')}

Report Generated On: ${new Date().toLocaleDateString()}
=================================================
            `;

            const blob = new Blob([reportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Progress_Report_${reportData.rollNo}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (window.showToast) window.showToast('Progress report downloaded successfully!', 'success');
        });
    }

    renderReport();
});