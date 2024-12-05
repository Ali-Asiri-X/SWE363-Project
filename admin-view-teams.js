let currentTeamIndex = null;
let currentTeamId = null;
let teams = [];

// Function to create a card
function createCard(team, index) {
    const card = document.createElement('div');
    card.className = 'col-md-6 mb-4';

    const cardContent = `
        <div class="card shadow">
            <div class="card-body">
                <h5 class="card-title">${team.teamName}</h5>
                <p class="card-text">${team.description}</p>
                <div class="d-flex mb-3">
                    ${team.majors.map(major => `
                        <div class="badge bg-outline-success rounded-circle me-2" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                            ${major}
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-danger w-100" onclick="showDeleteToast(${index}, '${team._id}')">Delete</button>
            </div>
        </div>
    `;
    
    card.innerHTML = cardContent;
    return card;
}

// Function to render all cards
function renderCards(teamsData) {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; // Clear existing content
    teams = teamsData; // Update the global teams array
    teams.forEach((team, index) => {
        cardContainer.appendChild(createCard(team, index));
    });
}

// Function to show the delete confirmation Toast
function showDeleteToast(index, id) {
    currentTeamIndex = index;
    currentTeamId = id;
    const toast = new bootstrap.Toast(document.getElementById('deleteToast'));
    toast.show();
}

// Function to delete the team
function deleteTeam() {
    if (currentTeamIndex !== null && currentTeamId !== null) {
        fetch(`http://localhost:3000/team/delete/${currentTeamId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Team deleted successfully") {
                teams.splice(currentTeamIndex, 1);
                renderCards(teams);
                currentTeamIndex = null;
                currentTeamId = null;
                const toast = bootstrap.Toast.getInstance(document.getElementById('deleteToast'));
                toast.hide();
            } else {
                console.error('Error deleting team:', data.message);
            }
        })
        .catch(error => console.error('Error deleting team:', error));
    }
}

// Function to fetch teams from the server
function fetchTeams() {
    // Show placeholder cards while loading
    const placeholders = document.querySelectorAll('.placeholder-card');
    placeholders.forEach(card => card.style.display = 'block');
    
    fetch('http://localhost:3000/team/all')
        .then(response => response.json())
        .then(data => {
            // Hide placeholder cards after data is loaded
            placeholders.forEach(card => card.style.display = 'none');
            renderCards(data);
        })
        .catch(error => console.error('Error fetching teams:', error));
}

// Add event listener to the confirm delete button
document.getElementById('confirmDeleteBtn').addEventListener('click', deleteTeam);

// Fetch and render cards on page load
document.addEventListener('DOMContentLoaded', fetchTeams);