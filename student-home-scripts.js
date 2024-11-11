document.addEventListener('DOMContentLoaded', function() {
    const editProfileModalElement = document.getElementById('editProfileModal');
    const editProfileModal = new bootstrap.Modal(editProfileModalElement);

    document.getElementById('editProfileBtn').addEventListener('click', function() {
        editProfileModal.show();
    });

    document.getElementById('editProfileForm').addEventListener('submit', function(event) {
        event.preventDefault();
        let name = document.getElementById('profileName').value;
        let whatsNum = document.getElementById('profileWhatsApp').value;
        let major = document.getElementById('profileMajor').value;
        let profileDescription = document.getElementById('profileDescription').value;
        let userInfo = document.getElementById('userInfo').children;
        userInfo[0].firstChild.textContent = name;
        userInfo[1].textContent = whatsNum;
        userInfo[2].textContent = major;
        userInfo[3].textContent = profileDescription;
        editProfileModal.hide();
    });

    const editProfilePicModalElement = document.getElementById('editProfilePicModal');
    const editProfilePicModal = new bootstrap.Modal(editProfilePicModalElement);
    const editProfilePicForm = document.getElementById('editProfilePicForm');
    const profilePic = document.getElementById('profilePic');
    const newProfileImageInput = document.getElementById('newProfileImage');

    document.getElementById('editProfilePicture').addEventListener('click', function() {
        editProfilePicModal.show();
    });

    editProfilePicForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!editProfilePicForm.checkValidity()) {
            event.stopPropagation();
        } else {
            const file = newProfileImageInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePic.src = e.target.result;
                    profilePic.style.width = '100px';
                    profilePic.style.height = '100px';
                };
                reader.readAsDataURL(file);
            }
            editProfilePicModal.hide();
        }
        editProfilePicForm.classList.add('was-validated');
    });
});