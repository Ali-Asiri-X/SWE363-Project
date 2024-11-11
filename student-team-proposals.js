document.addEventListener('DOMContentLoaded', function () {
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
        }
        ,
        {
            name: "Team Beta",
            description: "A team focused on beta projects",
            majors: ["CS", "BA", "PH", "CH", "BI"]
        }
        ,
        {
            name: "Team Beta",
            description: "A team focused on beta projects",
            majors: ["CS", "BA", "PH", "CH", "BI"]
        }
        ,
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

    function createCard(team, index) {
        const card = document.createElement('div');
        card.className = 'col-md-6 mb-4';

        const cardContent = `
            <div class="card shadow-sm" id="teamCard-${index}">
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
                    <button class="btn btn-success w-100" onclick="requestToJoin(${index})">Request to Join</button>
                </div>
            </div>
        `;

        card.innerHTML = cardContent;
        return card;
    }

    function renderCards(teams) {
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = ''; // Clear existing content
        teams.forEach((team, index) => {
            cardContainer.appendChild(createCard(team, index));
        });
    }

    function showRequestToast(teamName) {
        const toastBody = document.getElementById('toastBody');
        toastBody.textContent = `Request to join ${teamName} has been sent.`;
        const toastElement = document.getElementById('requestToast');
        const toastInstance = bootstrap.Toast.getOrCreateInstance(toastElement);

        // Hide the toast first if it's currently visible
        toastElement.classList.remove('show');
        setTimeout(() => {
            toastInstance.show();
        }, 10); // Small delay to ensure the toast is properly reset
    }

    window.requestToJoin = function (index) {
        const card = document.getElementById(`teamCard-${index}`);
        card.classList.add('border-success');
        const cardBody = card.querySelector('.card-body');
        cardBody.classList.add('text-success');

        const joinButton = card.querySelector('.btn');
        if (joinButton) {
            joinButton.remove();
        }

        const teamName = teams[index].name;
        showRequestToast(teamName);
    };

    renderCards(teams);
});
