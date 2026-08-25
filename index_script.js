// UpliftEd - Realistic Registration & Database User Store

$(document).ready(function() {
    const registerForm = $('#registerForm');

    function validateRegisterForm() {
        let isValid = true;
        const fullname = $('#reg-fullname').val().trim();
        const email = $('#reg-email').val().trim();
        const password = $('#reg-password').val().trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (fullname === '') {
            $('#reg-fullname-error').text('Full name is required');
            isValid = false;
        } else if (fullname.length < 3) {
            $('#reg-fullname-error').text('Full name must be at least 3 characters');
            isValid = false;
        } else {
            $('#reg-fullname-error').text('');
        }

        if (email === '') {
            $('#reg-email-error').text('Email address is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            $('#reg-email-error').text('Please enter a valid email address');
            isValid = false;
        } else {
            $('#reg-email-error').text('');
        }

        if (password === '') {
            $('#reg-password-error').text('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            $('#reg-password-error').text('Password must be at least 6 characters');
            isValid = false;
        } else {
            $('#reg-password-error').text('');
        }

        return isValid;
    }

    registerForm.on('submit', function(e) {
        e.preventDefault();

        if (validateRegisterForm()) {
            const fullname = $('#reg-fullname').val().trim();
            const email = $('#reg-email').val().trim();
            const password = $('#reg-password').val().trim();

            let usersDb = JSON.parse(localStorage.getItem('users_database') || '[]');
            if (usersDb.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                $('#reg-email-error').text('This email is already registered.');
                return;
            }

            usersDb.push({ fullname: fullname, email: email, password: password, registeredAt: new Date().toISOString() });
            localStorage.setItem('users_database', JSON.stringify(usersDb));
            localStorage.setItem('current_user', JSON.stringify({ fullname: fullname, email: email }));

            alert(`Registration successful! Account created for ${fullname}.`);
            window.location.href = 'login.html';
        }
    });
});