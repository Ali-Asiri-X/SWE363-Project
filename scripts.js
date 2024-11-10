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
});