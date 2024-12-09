// Function to create a card
function createCard(team) {
    const card = document.createElement('div');
    card.className = 'col-md-6 mb-4';

    const cardContent = `
        <div class="card shadow ${team.hasRequestPending ? 'border-success' : ''}" id="teamCard-${team._id}">
            <div class="card-body ${team.hasRequestPending ? 'text-success' : ''}">
                <h5 class="card-title">${team.teamName}</h5>
                <p class="card-text">${team.description}</p>
                <div class="d-flex mb-3">
                    ${team.majors.map(major => `
                        <div class="badge bg-outline-success rounded-circle me-2" style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                            ${major}
                        </div>
                    `).join('')}
                </div>
                ${!team.hasRequestPending ? 
                    `<button class="btn btn-success w-100" onclick="requestToJoin('${team._id}', '${team.teamName}')">
                        Request to Join
                    </button>` : 
                    '<div class="text-success text-center">Request Pending</div>'
                }
            </div>
        </div>
    `;

    card.innerHTML = cardContent;
    return card;
}

// Function to render cards
function renderCards(teamsData) {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''; // Clear existing content
    teamsData.forEach(team => {
        cardContainer.appendChild(createCard(team));
    });
}

// Function to fetch teams from the server
function fetchTeams() {
    const studentId = '67576704d7bf6788e678d1bc'; // Replace with actual student ID
    const placeholders = document.querySelectorAll('.placeholder-card');
    placeholders.forEach(card => card.style.display = 'block');
    
    fetch(`http://localhost:3000/team/all/${studentId}`)
        .then(response => response.json())
        .then(data => {
            placeholders.forEach(card => card.style.display = 'none');
            renderCards(data);
        })
        .catch(error => {
            console.error('Error fetching teams:', error);
            const cardContainer = document.getElementById('cardContainer');
            cardContainer.innerHTML = '<div class="alert alert-danger">Error loading teams. Please try again later.</div>';
            placeholders.forEach(card => card.style.display = 'none');
        });
}

// Move requestToJoin to global scope
function requestToJoin(teamId, teamName) {
    fetch(`http://localhost:3000/team/join/${teamId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            studentId: '67576704d7bf6788e678d1bc' // Replace with actual student ID
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Refetch teams to update UI with latest status
            fetchTeams();
            showRequestToast(teamName);
        } else {
            throw new Error(data.message);
        }
    })
    .catch(error => {
        console.error('Error joining team:', error);
        alert('Failed to send join request. Please try again.');
    });
}

// Add showRequestToast function
function showRequestToast(teamName) {
    const toastBody = document.getElementById('toastBody');
    if (!toastBody) {
        console.error('Toast element not found');
        return;
    }
    
    toastBody.textContent = `Request to join ${teamName} has been sent.`;
    const toastElement = document.getElementById('requestToast');
    const toastInstance = bootstrap.Toast.getOrCreateInstance(toastElement);

    // Hide the toast first if it's currently visible
    toastElement.classList.remove('show');
    setTimeout(() => {
        toastInstance.show();
    }, 10); // Small delay to ensure the toast is properly reset
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', fetchTeams);