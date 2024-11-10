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