document.querySelector('.form').addEventListener('submit', function(event) {
    // Get form inputs
    const name = document.getElementById('new-name').value.trim();
    const email = document.getElementById('new-email').value.trim();
    const whatsappNumber = document.getElementById('whatsapp-number').value.trim();
    const universityMajor = document.getElementById('university-major').value.trim();
    const description = document.getElementById('description').value.trim();
    const batchYear = document.getElementById('batch-year').value.trim();
    const password = document.getElementById('new-password').value.trim();

    // Regular expressions for validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const whatsappPattern = /^[0-9]+$/;
    const batchYearPattern = /^[0-9]{4}$/; // Assuming batch year is a 4-digit number
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{9,}$/; // At least 9 characters, one uppercase, one number

    // Validate inputs
    if (!name) {
        alert('Please enter your name.');
        event.preventDefault();
    } else if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        event.preventDefault();
    } else if (!whatsappPattern.test(whatsappNumber)) {
        alert('Please enter a valid WhatsApp number.');
        event.preventDefault();
    } else if (!universityMajor) {
        alert('Please enter your university major.');
        event.preventDefault();
    } else if (!description) {
        alert('Please enter a description.');
        event.preventDefault();
    } else if (!batchYearPattern.test(batchYear)) {
        alert('Please enter a valid batch year.');
        event.preventDefault();
    } else if (!passwordPattern.test(password)) {
        alert('Password must be at least 9 characters long, include a number and a capital letter.');
        event.preventDefault();
    }
});