// student-scripts.js

// Constants
const API_BASE_URL = 'http://localhost:3000';
const STUDENT_ID = '6753aeb9b9bfb1fba734ecd6'; // Temporary hardcoded ID

document.addEventListener('DOMContentLoaded', async function () {
    let hasTeam = false;
    // Fetch initial data
    await Promise.all([
        getStudentProfile(),
        checkTeamStatus()
    ]);

    updateUIState();

    function updateUIState() {
        const noTeamContent = document.getElementById('noTeamContent');
        const teamContent = document.getElementById('teamContent');

        if (hasTeam) {
            noTeamContent.classList.add('d-none');
            teamContent.classList.remove('d-none');
        } else {
            noTeamContent.classList.remove('d-none');
            teamContent.classList.add('d-none');
        }
    }

    // Profile editing functionality
    const editProfileModalElement = document.getElementById('editProfileModal');
    const editProfileModal = new bootstrap.Modal(editProfileModalElement);

    document.getElementById('editProfileBtn').addEventListener('click', function () {
        const userInfo = document.getElementById('userInfo').children;
        const name = userInfo[0].firstChild.textContent;
        const whatsNum = userInfo[1].textContent.replace('WhatsApp: ', '');
        const major = userInfo[2].textContent.replace('Major: ', '');
        const profileDescription = userInfo[3].textContent;

        document.getElementById('profileName').value = name;
        document.getElementById('profileWhatsApp').value = whatsNum;
        document.getElementById('profileMajor').value = major;
        document.getElementById('profileDescription').value = profileDescription;

        editProfileModal.show();
    });

    // Profile picture functionality
    const editProfilePicModalElement = document.getElementById('editProfilePicModal');
    const editProfilePicModal = new bootstrap.Modal(editProfilePicModalElement);
    const editProfilePicForm = document.getElementById('editProfilePicForm');
    const profilePic = document.getElementById('profilePic');
    const newProfileImageInput = document.getElementById('newProfileImage');

    document.getElementById('editProfilePicture').addEventListener('click', function () {
        editProfilePicModal.show();
    });

    // Team management functionality
    if (hasTeam) {
        // Delete member functionality
        document.querySelectorAll('.delete').forEach(function (button) {
            button.addEventListener('click', function () {
                if (confirm('Are you sure you want to delete?')) {
                    this.closest('.d-flex.align-items-center.mb-3').remove();
                }
            });
        });

        // Accept request functionality
        document.querySelectorAll('.accept').forEach(function (button) {
            button.addEventListener('click', function () {
                const memberCard = this.closest('.d-flex.align-items-center.mb-3');
                const memberDetails = memberCard.querySelector('.details').innerHTML;
                addTeamMember(memberDetails);
                memberCard.remove();
            });
        });
    }

    // Create team button handler
    document.querySelector('#createTeamBtn').addEventListener('click', async function () {
        try {
            const response = await fetch(`${API_BASE_URL}/student/team/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamName: "New Team", // Default name
                    description: "Team description",
                    majors: ["Computer Science"], // Default major
                    studentId: STUDENT_ID,
                    members: [STUDENT_ID],
                    pendingRequests: []
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create team');
            }

            const data = await response.json();
            console.log('Team created:', data);

            // Update UI state
            hasTeam = true;
            updateUIState();

            // Redirect to team formation page
            // window.location.href = 'TeamFormationPage.html';

        } catch (error) {
            console.error('Error creating team:', error);
            alert('Failed to create team. Please try again.');
        }
    });

    // Form submissions
    document.getElementById('editProfileForm').addEventListener('submit', handleProfileSubmit);
    document.getElementById('editProfilePicForm').addEventListener('submit', handleProfilePicSubmit);

    async function checkTeamStatus() {
        try {
            const response = await fetch(`${API_BASE_URL}/student/team/${STUDENT_ID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch team status');
            }

            const data = await response.json();
            hasTeam = data.hasTeam;

            if (hasTeam) {
                // Populate team data
                populateTeamData(data.team);
            }

            updateUIState();

        } catch (error) {
            console.error('Error checking team status:', error);
        }
    }

    function populateTeamData(team) {
        // Populate team members
        const teamMembersContainer = document.querySelector('#myTeamMembers .card-body');
        teamMembersContainer.innerHTML = ''; // Clear existing content

        team.members.forEach(member => {
            const memberCard = createMemberCard(member);
            teamMembersContainer.appendChild(memberCard);
        });

        // Populate pending requests
        const pendingRequestsContainer = document.querySelector('#pendingRequests .card-body');
        pendingRequestsContainer.innerHTML = ''; // Clear existing content

        team.pendingRequests.forEach(request => {
            const requestCard = createRequestCard(request);
            pendingRequestsContainer.appendChild(requestCard);
        });
    }

    function createMemberCard(member) {
        const div = document.createElement('div');
        div.className = 'd-flex align-items-center mb-3';
        div.innerHTML = `
            <img src="${'person.svg'}" class="rounded-circle me-3" alt="Member Picture">
            <div class="details">
                <h5 class="mb-1">${member.name}</h5>
                <p class="mb-1">Major: ${member.major}</p>
            </div>
            <div class="ms-auto d-flex flex-wrap gap-2">
                <a href="https://wa.me/${member.whatsappNumber}" target="_blank">
                    <button class="btn btn-outline-success btn-sm btn-md-normal me-2">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                </a>
                <button class="btn btn-outline-danger btn-sm btn-md-normal delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return div;
    }

    function createRequestCard(request) {
        const div = document.createElement('div');
        div.className = 'd-flex align-items-center mb-3';
        div.innerHTML = `
            <img src="${'person.svg'}" class="rounded-circle me-3" alt="Member Picture">
            <div class="details">
                <h5 class="mb-1">${request.name}</h5>
                <p class="mb-1">Major: ${request.major}</p>
            </div>
            <div class="ms-auto d-flex flex-wrap gap-2">
                <button class="btn btn-outline-success btn-sm btn-md-normal me-md-2 accept">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm btn-md-normal delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return div;
    }


    // Helper functions
    function handleProfileSubmit(event) {
        event.preventDefault();
        // Profile update logic
    }

    function handleProfilePicSubmit(event) {
        event.preventDefault();
        // Profile pic update logic
    }

    // function createTeam() {
    //     // Team creation logic
    //     hasTeam = true;
    //     updateUIState();
    // }

    function deleteTeam() {
        if (confirm('Are you sure you want to delete the team?')) {
            hasTeam = false;
            updateUIState();
        }
    }

    function addTeamMember(memberDetails) {
        const teamMembersContainer = document.querySelector('#myTeamMembers .card-body');
        const newMemberCard = document.createElement('div');
        newMemberCard.className = 'd-flex align-items-center mb-3';
        // Add member card HTML
    }

    async function getStudentProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/student/profile/${STUDENT_ID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const profile = await response.json();
            populateProfileData(profile);

        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Failed to load profile data');
        }
    }

    function populateProfileData(profile) {
        // Update profile picture
        const profilePic = document.getElementById('profilePic');
        if (profile.profilePicture) {
            profilePic.src = profile.profilePicture;
        }

        // Update user info
        const userInfo = document.getElementById('userInfo');
        userInfo.querySelector('h2 strong').textContent = profile.name;
        userInfo.querySelector('p:nth-child(2)').textContent = `WhatsApp: ${profile.whatsappNumber}`;
        userInfo.querySelector('p:nth-child(3)').textContent = `Major: ${profile.major}`;
        userInfo.querySelector('p:nth-child(4)').textContent = profile.description;

        // Pre-populate edit form fields
        document.getElementById('profileName').value = profile.name;
        document.getElementById('profileWhatsApp').value = profile.whatsappNumber;
        document.getElementById('profileMajor').value = profile.major;
        document.getElementById('profileDescription').value = profile.description;
    }

    async function exitTeam() {
        try {
            // Get team ID from state
            console.log("reached here");
            const response = await fetch(`${API_BASE_URL}/student/team/${STUDENT_ID}`);
            const data = await response.json();

            if (!data.hasTeam) {
                throw new Error('Not in a team');
            }

            const teamId = data.team._id;

            // Call leave team endpoint
            const leaveResponse = await fetch(
                `${API_BASE_URL}/student/team/${teamId}/leave/${STUDENT_ID}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!leaveResponse.ok) {
                throw new Error('Failed to leave team');
            }

            // Update UI state
            hasTeam = false;
            updateUIState();

            // Show success message
            alert('Successfully left the team');

        } catch (error) {
            console.error('Error leaving team:', error);
            alert('Failed to leave team. Please try again.');
        }
    }

    // Attach exit team handler
    console.log("attaching exit team handler");
    document.getElementById("ExitBtn").addEventListener('click', async() => {
        try {
            // Get team ID from state
            console.log("reached here");
            const response = await fetch(`${API_BASE_URL}/student/team/${STUDENT_ID}`);
            const data = await response.json();

            if (!data.hasTeam) {
                throw new Error('Not in a team');
            }

            const teamId = data.team._id;

            // Call leave team endpoint
            const leaveResponse = await fetch(
                `${API_BASE_URL}/student/team/${teamId}/leave/${STUDENT_ID}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!leaveResponse.ok) {
                throw new Error('Failed to leave team');
            }

            // Update UI state
            hasTeam = false;
            updateUIState();

            // Show success message
            alert('Successfully left the team');

        } catch (error) {
            console.error('Error leaving team:', error);
            alert('Failed to leave team. Please try again.');
        }
    });
});
// Update button onclick handler
