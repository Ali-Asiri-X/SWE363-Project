document.addEventListener('DOMContentLoaded', function () {
    var addUserForm = document.getElementById('addUserForm');
    var passwordHelp = document.createElement('small');
    passwordHelp.id = 'passwordHelp';
    passwordHelp.classList.add('form-text', 'text-muted');
    passwordHelp.textContent = 'Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character.';
    addUserForm.querySelector('.form-group.mb-3:nth-child(2)').appendChild(passwordHelp);

    addUserForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        var passwordValid = validatePassword(password);

        if (!passwordValid) {
            passwordHelp.style.color = 'red';
        } else {
            passwordHelp.style.color = 'green';
            addUser(username);
            // Clear the input fields
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }
    });

    function validatePassword(password) {
        var minLength = 8;
        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasNumbers = /\d/.test(password);
        var hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
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