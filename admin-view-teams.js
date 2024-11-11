// Placeholder data for teams
const teams = [
    {
        name: "Team Alpha",
        description: "A team focused on alpha projects",
        majors: ["CS", "EE", "ME", "CE", "BA"]
    },
    {
        name: "Team Beta",
        description: "A team focused on beta projects",
        majors: ["CS", "BA", "PH", "CH", "BI"]
    },
    {
        name: "Team Beta",
        description: "A team focused on beta projects",
        majors: ["CS", "BA", "PH", "CH", "BI"]
    },
    {
        name: "Team Beta",
        description: "A team focused on beta projects",
        majors: ["CS", "BA", "PH", "CH", "BI"]
    },
    {
        name: "Team Beta",
        description: "A team focused on beta projects",
        majors: ["CS", "BA", "PH", "CH", "BI"]
    },
    {
        name: "Team Beta",
        description: "A team focused on beta projects",
        majors: ["CS", "BA", "PH", "CH", "BI"]
    },
    {
        name: "Team Beta",
        description: "A team focused on beta projects",
        majors: ["CS", "BA", "PH", "CH", "BI"]
    },
    {
        name: "Team Beta",
        description: "A team focused on beta projects",
        majors: ["CS", "BA", "PH", "CH", "BI"]
    }
    // Add more teams as needed
];

let currentTeamIndex = null;

// Function to create a card
function createCard(team, index) {
    const card = document.createElement('div');
    card.className = 'col-md-6 mb-4';

    const cardContent = `
        <div class="card shadow-sm">
            <div class="card-body">
                <h5 class="card-title">${team.name}</h5>
                <p class="card-text">${team.description}</p>
                <div class="d-flex mb-3">
                    ${team.majors.map(major => `
                        <div class="badge bg-outline-success rounded-circle me-2" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                            ${major}
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-danger w-100" onclick="showDeleteToast(${index})">Delete</button>
            </div>
        </div>
    `;
    
    card.innerHTML = cardContent;
    return card;
}

// Function to render all cards
function renderCards(teams) {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; // Clear existing content
    teams.forEach((team, index) => {
        cardContainer.appendChild(createCard(team, index));
    });
}

// Function to show the delete confirmation Toast
function showDeleteToast(index) {
    currentTeamIndex = index;
    const toast = new bootstrap.Toast(document.getElementById('deleteToast'));
    toast.show();
}

// Function to delete the team
function deleteTeam() {
    if (currentTeamIndex !== null) {
        teams.splice(currentTeamIndex, 1);
        renderCards(teams);
        currentTeamIndex = null;
        const toast = bootstrap.Toast.getInstance(document.getElementById('deleteToast'));
        toast.hide();
    }
}

// Add event listener to the confirm delete button
document.getElementById('confirmDeleteBtn').addEventListener('click', deleteTeam);

// Render cards on page load
document.addEventListener('DOMContentLoaded', () => renderCards(teams));