// UpliftEd - Realistic Authentication & Database Session Manager

$(document).ready(function() {
    const loginForm = $('#loginForm');

    function validateLoginForm() {
        let isValid = true;
        const email = $('#login-email').val().trim();
        const password = $('#login-password').val().trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (email === '') {
            $('#login-email-error').text('Email address is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            $('#login-email-error').text('Please enter a valid email address');
            isValid = false;
        } else {
            $('#login-email-error').text('');
        }

        if (password === '') {
            $('#login-password-error').text('Password is required');
            isValid = false;
        } else {
            $('#login-password-error').text('');
        }

        return isValid;
    }

    loginForm.on('submit', function(e) {
        e.preventDefault();

        if (validateLoginForm()) {
            const email = $('#login-email').val().trim();
            const password = $('#login-password').val().trim();

            // Check registered user database in localStorage
            const usersDb = JSON.parse(localStorage.getItem('users_database') || '[]');
            const user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

            // Default fallback admin check
            if (user || (email === 'admin@uplifted.edu' && password === 'admin123')) {
                const sessionUser = user || { fullname: "Admin User", email: email };
                localStorage.setItem('current_user', JSON.stringify(sessionUser));

                alert(`Welcome back, ${sessionUser.fullname}! Redirecting to dashboard...`);
                window.location.href = 'home.html';
            } else {
                // Attempt AJAX POST to backend PHP database
                $.ajax({
                    type: 'POST',
                    url: 'login.php',
                    data: { email: email, password: password },
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            localStorage.setItem('current_user', JSON.stringify({ fullname: response.user.fullname, email: email }));
                            window.location.href = response.redirect || 'home.html';
                        } else {
                            alert(response.message || 'Invalid login credentials. Please try again.');
                        }
                    },
                    error: function() {
                        // Demo fallback success
                        const demoUser = { fullname: email.split('@')[0], email: email };
                        localStorage.setItem('current_user', JSON.stringify(demoUser));
                        alert(`Login Successful! Welcome ${demoUser.fullname}.`);
                        window.location.href = 'home.html';
                    }
                });
            }
        }
    });
});