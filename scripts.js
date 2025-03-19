// Global Variables
let numberOfTeams = 1;
const maxTeams = 12;
const teamSize = 8;
let teams = Array.from({ length: numberOfTeams }, (_, i) => ({
  id: i + 1,
  name: `Team ${i + 1}`,
  members: Array.from({ length: teamSize }, (_, j) => ({
    id: j + 1,
    name: `Member ${j + 1}`,
  })),
}));

// Update Number of Teams
function updateTeams() {
  const input = document.getElementById("numberOfTeams");
  numberOfTeams = Math.min(maxTeams, Math.max(1, parseInt(input.value) || 1));

  // Adjust teams array dynamically
  teams = Array.from({ length: numberOfTeams }, (_, i) => ({
    id: i + 1,
    name: teams[i]?.name || `Team ${i + 1}`,
    members: teams[i]?.members || Array.from({ length: teamSize }, (_, j) => ({
      id: j + 1,
      name: `Member ${j + 1}`,
    })),
  }));

  renderTeams();
}

// Render Teams
function renderTeams() {
  const container = document.getElementById("teamsContainer");
  container.innerHTML = teams
    .map(team => `
      <div class="team-card">
        <h3>
          <input type="text" value="${team.name}" 
                 oninput="updateTeamName(${team.id - 1}, this.value)" 
                 placeholder="Team Name">
        </h3>
        <div class="team-members">
          ${team.members
            .map(
              member => `
                <div class="player-card">
                  <label for="team${team.id}member${member.id}">Member ${member.id}:</label>
                  <input type="text" id="team${team.id}member${member.id}" 
                         value="${member.name}" 
                         oninput="updateMemberName(${team.id - 1}, ${member.id - 1}, this.value)" 
                         placeholder="Member Name">
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    `)
    .join("");

  renderSummary(); // Update the Draft Summary whenever teams change
}

// Update Team Name
function updateTeamName(teamIndex, name) {
  teams[teamIndex].name = name || `Team ${teamIndex + 1}`;
  renderSummary();
}

// Update Member Name
function updateMemberName(teamIndex, memberIndex, name) {
  teams[teamIndex].members[memberIndex].name = name || `Member ${memberIndex + 1}`;
  renderSummary();
}

// Render Draft Summary
function renderSummary() {
  const summaryBoard = document.getElementById("summaryBoard");
  summaryBoard.innerHTML = teams
    .map(
      team => `
        <div class="summary-card">
          <h3>${team.name}</h3>
          <ul>
            ${team.members.map(member => `<li>${member.name}</li>`).join("")}
          </ul>
        </div>
      `
    )
    .join("");
}

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  renderTeams();
});

let characterPool = [];
let currentCharacter = null;
let removedCharacter = null;

// Load Character Pool from a Separate File
function loadCharacterPool() {
  fetch('characters.txt') // Assumes 'characters.txt' is in the same directory
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load character pool.");
      }
      return response.text();
    })
    .then(data => {
      // Process characters from the file into an array
      characterPool = data.split('\n').map(name => name.trim()).filter(Boolean);
      alert("Character pool loaded successfully!");

      // Enable the roll button once the pool is loaded
      document.getElementById("rollButton").disabled = false;
    })
    .catch(error => {
      console.error("Error loading character pool:", error);
      alert("Failed to load character pool. Please check the file.");
    });
}

// Roll for Character
function rollCharacter() {
  if (characterPool.length === 0) {
    alert("Character pool is empty!");
    return;
  }

  const randomIndex = Math.floor(Math.random() * characterPool.length);
  currentCharacter = characterPool[randomIndex];
  
  document.getElementById("characterDisplay").textContent = currentCharacter;
  document.getElementById("removeButton").disabled = false; // Enable Remove Button
}

// Remove Character from Pool
function removeCharacter() {
  if (currentCharacter) {
    characterPool = characterPool.filter(char => char !== currentCharacter);
    removedCharacter = currentCharacter;
    currentCharacter = null;
    
    document.getElementById("characterDisplay").textContent = "Character Removed";
    document.getElementById("removeButton").disabled = true;
    document.getElementById("addButton").disabled = false; // Enable Add Button
  }
}

// Add Character Back to Pool
function addCharacterBack() {
  if (removedCharacter) {
    characterPool.push(removedCharacter);
    removedCharacter = null;
    
    document.getElementById("characterDisplay").textContent = "Character Added Back";
    document.getElementById("addButton").disabled = true;
  }
}

function exportTeams() {
  // Example global 'teams' array. Replace with your actual data structure
  const fixedTeams = teams.map(team => ({
    name: team.name, // Retain the team name
    members: team.members.map(member => member.name) // Extract just the character names
  }));

  // Generate the JSON file
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ teams: fixedTeams }, null, 2));
  const downloadAnchor = document.createElement("a");

  // Set up the download link
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "teams.json");

  // Trigger the download
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);

  alert("Teams exported successfully!");
}
