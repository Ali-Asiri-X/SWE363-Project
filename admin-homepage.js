document.addEventListener('DOMContentLoaded', function () {
    var addUserForm = document.getElementById('addUserForm');
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    var passwordHelp = document.createElement('div');
    passwordHelp.className = 'invalid-feedback';
    passwordInput.parentNode.appendChild(passwordHelp);

    // Real-time validation for username
    usernameInput.addEventListener('input', function () {
        if (usernameInput.value.trim() === '') {
            usernameInput.classList.add('is-invalid');
        } else {
            usernameInput.classList.remove('is-invalid');
            usernameInput.classList.add('is-valid');
        }
    });

    // Real-time validation for password
    passwordInput.addEventListener('input', function () {
        var passwordValid = validatePassword(passwordInput.value.trim());
        if (!passwordValid.isValid) {
            passwordInput.classList.add('is-invalid');
            passwordHelp.innerHTML = passwordValid.message.join('<br>');
        } else {
            passwordInput.classList.remove('is-invalid');
            passwordInput.classList.add('is-valid');
            passwordHelp.innerHTML = '';
        }
    });

    addUserForm.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Validate username
        if (usernameInput.value.trim() === '') {
            usernameInput.classList.add('is-invalid');
        } else {
            usernameInput.classList.remove('is-invalid');
            usernameInput.classList.add('is-valid');
        }

        // Validate password
        var passwordValid = validatePassword(passwordInput.value.trim());
        if (!passwordValid.isValid) {
            passwordInput.classList.add('is-invalid');
            passwordHelp.innerHTML = passwordValid.message.join('<br>');
        } else {
            passwordInput.classList.remove('is-invalid');
            passwordInput.classList.add('is-valid');
        }

        if (addUserForm.checkValidity() === false || !passwordValid.isValid) {
            addUserForm.classList.add('was-validated');
        } else {
            addUser(usernameInput.value.trim());
            // Clear the input fields
            usernameInput.value = '';
            passwordInput.value = '';
            usernameInput.classList.remove('is-valid');
            passwordInput.classList.remove('is-valid');
            addUserForm.classList.remove('was-validated');
        }
    }, false);

    function validatePassword(password) {
        var minLength = 8;
        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasNumbers = /\d/.test(password);
        var hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        var errors = [];
        if (password.length < minLength) {
            errors.push('Password must be at least 8 characters long.');
        }
        if (!hasUpperCase) {
            errors.push('Password must contain an uppercase letter.');
        }
        if (!hasLowerCase) {
            errors.push('Password must contain a lowercase letter.');
        }
        if (!hasNumbers) {
            errors.push('Password must contain a number.');
        }
        if (!hasSpecialChars) {
            errors.push('Password must contain a special character.');
        }

        return {
            isValid: errors.length === 0,
            message: errors
        };
    }

    function addUser(username) {
        var userCardBody = document.querySelector('.user-card .card-body');

        var userItem = document.createElement('div');
        userItem.className = 'user-item';

        var userContent = document.createElement('div');
        userContent.className = 'd-flex align-items-center';

        var userImage = document.createElement('img');
        userImage.src = 'https://via.placeholder.com/40';
        userImage.alt = username;
        userImage.className = 'me-3';

        var userNameSpan = document.createElement('span');
        userNameSpan.textContent = username;

        userContent.appendChild(userImage);
        userContent.appendChild(userNameSpan);

        var deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';

        deleteButton.addEventListener('click', function () {
            userCardBody.removeChild(userItem);
        });

        userItem.appendChild(userContent);
        userItem.appendChild(deleteButton);

        userCardBody.appendChild(userItem);
    }
});
