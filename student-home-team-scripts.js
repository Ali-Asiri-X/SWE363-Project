document.addEventListener('DOMContentLoaded', function() {
    const modalElement = document.getElementById('infoModal');
    const modal = new bootstrap.Modal(modalElement);

    document.querySelectorAll('.card-body').forEach(function(card) {
        card.addEventListener('click', function() {
        let name = this.children[0].children[1].children[0].textContent;
        modalElement.querySelector('.modal-title').textContent = name
        modal.show();
        });
    });

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
});