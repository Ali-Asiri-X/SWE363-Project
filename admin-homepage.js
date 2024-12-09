document.addEventListener('DOMContentLoaded', async function () {
    // Get form elements
    var addUserForm = document.getElementById('addUserForm');
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    var profilePic = document.getElementById('profilePic');
    var editProfileForm = document.getElementById('editProfileForm');

    // Remove duplicate declaration of addUserForm
    // Remove references to removed elements (profileImageInput, profileImagePreview)

    var passwordHelp = document.createElement('div');
    passwordHelp.className = 'invalid-feedback';
    passwordInput.parentNode.appendChild(passwordHelp);

    var currentDeleteItem = null; // Track the current item to be deleted

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

    // Check if elements exist before adding event listeners
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!editProfileForm.checkValidity()) {
                e.stopPropagation();
            } else {
                const file = newProfileImageInput.files[0];
                if (file && profilePic) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        profilePic.src = e.target.result;
                        profilePic.style.width = '100px';
                        profilePic.style.height = '100px';
                    };
                    reader.readAsDataURL(file);
                }
                // Hide the modal
                const editProfileModal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
                if (editProfileModal) {
                    editProfileModal.hide();
                }
            }
            editProfileForm.classList.add('was-validated');
        });
    }

    addUserForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Validate username
        if (usernameInput.value.trim() === '') {
            usernameInput.classList.add('is-invalid');
            return;
        }

        // Validate password
        const passwordValid = validatePassword(passwordInput.value.trim());
        if (!passwordValid.isValid) {
            passwordInput.classList.add('is-invalid');
            passwordHelp.innerHTML = passwordValid.message.join('<br>');
            return;
        }

        if (addUserForm.checkValidity() && passwordValid.isValid) {
            try {
                const moderatorData = {
                    username: usernameInput.value.trim(),
                    password: passwordInput.value.trim()
                };

                const response = await fetch('http://localhost:3000/auth/create-moderator', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(moderatorData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Add user to UI
                    addUser(moderatorData.username);
                    
                    // Reset form
                    usernameInput.value = '';
                    passwordInput.value = '';
                    
                    // Reset validation states
                    usernameInput.classList.remove('is-valid');
                    passwordInput.classList.remove('is-valid');
                    addUserForm.classList.remove('was-validated');

                    // Show success message
                    alert('Moderator created successfully');
                } else {
                    throw new Error(data.message || 'Failed to create moderator');
                }

            } catch (error) {
                console.error('Error:', error);
                alert(error.message);
            }
        }
        addUserForm.classList.add('was-validated');
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

    function showDeleteToast(item) {
        currentDeleteItem = item;
        const toast = new bootstrap.Toast(document.getElementById('deleteToast'));
        toast.show();
    }

    function deleteUser() {
        if (currentDeleteItem) {
            currentDeleteItem.parentNode.removeChild(currentDeleteItem);
            const toast = bootstrap.Toast.getInstance(document.getElementById('deleteToast'));
            toast.hide();
            currentDeleteItem = null;
        }
    }

    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteUser);

    async function fetchModerators() {
        try {
            // Show loading placeholder
            showLoadingPlaceholder();
            
            const response = await fetch('http://localhost:3000/auth/moderators');
            if (!response.ok) {
                throw new Error('Failed to fetch moderators');
            }
            const moderators = await response.json();
            
            // Clear existing moderators
            const userCardBody = document.querySelector('.user-card .card-body');
            userCardBody.innerHTML = '';
            
            // Add each moderator to the UI
            moderators.forEach(moderator => {
                addUser(moderator.username);
            });

            // If no moderators, show message
            if (moderators.length === 0) {
                userCardBody.innerHTML = '<p class="text-muted text-center mt-3">No moderators found</p>';
            }
        } catch (error) {
            console.error('Error fetching moderators:', error);
            const userCardBody = document.querySelector('.user-card .card-body');
            userCardBody.innerHTML = '<p class="text-danger text-center mt-3">Failed to load moderators</p>';
        }
    }

    // Call fetchModerators when page loads
    fetchModerators();

    function addUser(username) {
        var userCardBody = document.querySelector('.user-card .card-body');

        var userItem = document.createElement('div');
        userItem.className = 'user-item';

        var userContent = document.createElement('div');
        userContent.className = 'd-flex align-items-center';

        var userImage = document.createElement('img');
        userImage.src = 'person.svg'; // Use person.svg for all moderators
        userImage.alt = username;
        userImage.className = 'rounded-circle me-3';
        userImage.style.width = '40px';
        userImage.style.height = '40px';

        var userNameSpan = document.createElement('span');
        userNameSpan.textContent = username;

        userContent.appendChild(userImage);
        userContent.appendChild(userNameSpan);

        var deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';

        deleteButton.addEventListener('click', function () {
            showDeleteToast(userItem);
        });

        userItem.appendChild(userContent);
        userItem.appendChild(deleteButton);

        userCardBody.appendChild(userItem);
    }
});

// Add this function at the top level
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Add this function to admin-homepage.js
function showLoadingPlaceholder() {
    const userCardBody = document.querySelector('.user-card .card-body');
    userCardBody.innerHTML = `
        <div class="placeholder-glow">
            ${Array(5).fill(`
                <div class="user-item">
                    <div class="d-flex align-items-center" style="width: 100%;">
                        <div class="placeholder rounded-circle me-3" style="width: 40px; height: 40px;"></div>
                        <div class="placeholder col-4"></div>
                    </div>
                    <div class="placeholder col-2"></div>
                </div>
            `).join('')}
        </div>
    `;
}