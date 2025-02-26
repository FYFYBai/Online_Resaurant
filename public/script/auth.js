$(document).ready(function () {
    // Create error message containers if they do not already exist.
    if ($('#loginError').length === 0) {
        $('#pills-login form').prepend('<div id="loginError" class="alert alert-danger" style="display:none;"></div>');
    }
    if ($('#registerError').length === 0) {
        $('#pills-register form').prepend('<div id="registerError" class="alert alert-danger" style="display:none;"></div>');
    }

    // Helper function to validate email format.
    function isValidEmail(email) {
        const emailRegex = /^\S+@\S+\.\S+$/;
        return emailRegex.test(email);
    }

    // Helper function to validate password strength.
    // At least 8 characters, one uppercase, one lowercase, one digit, and one special character.
    function isValidPassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    // Login functionality.
    $('#loginButton').on('click', async function () {
        // Clear previous error messages.
        $('#loginError').hide().removeClass('alert-success').addClass('alert-danger').html('');

        const email = $('#loginEmail').val().trim();
        const password = $('#password').val().trim();
        let errors = [];

        if (!email) {
            errors.push("Email is required.");
        } else if (!isValidEmail(email)) {
            errors.push("Invalid email format.");
        }

        if (!password) {
            errors.push("Password is required.");
        }

        if (errors.length > 0) {
            $('#loginError').html(errors.join('<br>')).show();
            return;
        }

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                // Store the auth credentials in session storage.
                sessionStorage.setItem('x-auth-email', email);
                sessionStorage.setItem('x-auth-password', password);
            
                $('#loginError').removeClass('alert-danger').addClass('alert-success')
                    .html("Login successful. Redirecting...").show();
                // redirect after a brief delay.
                setTimeout(() => {
                    window.location.href = "./orders.html";
                }, 1500);
            }
        } catch (error) {
            $('#loginError').html("An error occurred. Please try again.").show();
        }
    });

    // Registration functionality.
    $('#registerButton').on('click', async function () {
        // Clear previous error messages.
        $('#registerError').hide().removeClass('alert-success').addClass('alert-danger').html('');

        // Get form values.
        const email = $('#email').val().trim();
        const first_name = $('#first_name').val().trim();
        const middle_name = $('#middle_name').val().trim();
        const last_name = $('#last_name').val().trim();
        const street = $('#street').val().trim();
        const city = $('#city').val().trim();
        const state = $('#state').val().trim();
        const postal_code = $('#postal_code').val().trim();
        const country = $('#country').val().trim();
        const password1 = $('#newPass1').val().trim();
        const password2 = $('#newPass2').val().trim();

        let errors = [];

        // Validate required fields.
        if (!email) errors.push("Email is required.");
        else if (!isValidEmail(email)) errors.push("Invalid email format.");

        if (!first_name) errors.push("First name is required.");
        if (!last_name) errors.push("Last name is required.");
        if (!street) errors.push("Street address is required.");
        if (!city) errors.push("City is required.");
        if (!state) errors.push("State/Province is required.");
        if (!postal_code) errors.push("Postal code is required.");
        if (!country) errors.push("Country is required.");

        // Validate password fields.
        if (!password1 || !password2) {
            errors.push("Both password fields are required.");
        } else if (password1 !== password2) {
            errors.push("Passwords do not match.");
        } else if (!isValidPassword(password1)) {
            errors.push("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
        }

        if (errors.length > 0) {
            $('#registerError').html(errors.join('<br>')).show();
            return;
        }

        // Prepare data for the registration API.
        const registerData = {
            email,
            first_name,
            middle_name: middle_name || null,
            last_name,
            street,
            city,
            state,
            postal_code,
            country,
            password: password1
        };

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });
            const data = await response.json();
            if (!response.ok) {
                $('#registerError').html(data.message || "Registration failed.").show();
            } else {
                $('#registerError').removeClass('alert-danger').addClass('alert-success')
                    .html("Registration successful. Please login.").show();
                // Optionally switch to the login tab.
                setTimeout(function () {
                    $('#tab-login').click();
                    // Clear registration form fields if desired.
                    $('#pills-register form')[0].reset();
                    $('#registerError').hide();
                }, 1500);
            }
        } catch (error) {
            $('#registerError').html("An error occurred. Please try again.").show();
        }
    });
});
