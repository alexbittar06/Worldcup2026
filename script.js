const flags = {
  Qatar: "🇶🇦",
  Ecuador: "🇪🇨",
  Senegal: "🇸🇳",
  Netherlands: "🇳🇱",
  England: "🏴",
  Panama: "🇵🇦",
  Iran: "🇮🇷",
  USA: "🇺🇸",
  Wales: "🏴",
  Argentina: "🇦🇷",
  "Saudi Arabia": "🇸🇦",
  Mexico: "🇲🇽",
  Poland: "🇵🇱",
  France: "🇫🇷",
  Australia: "🇦🇺",
  Denmark: "🇩🇰",
  Tunisia: "🇹🇳",
  Spain: "🇪🇸",
  "Costa Rica": "🇨🇷",
  Germany: "🇩🇪",
  Japan: "🇯🇵",
  Belgium: "🇧🇪",
  Canada: "🇨🇦",
  Morocco: "🇲🇦",
  Croatia: "🇭🇷",
  Brazil: "🇧🇷",
  Serbia: "🇷🇸",
  Switzerland: "🇨🇭",
  Cameroon: "🇨🇲",
  Portugal: "🇵🇹",
  Ghana: "🇬🇭",
  Uruguay: "🇺🇾",
  "South Korea": "🇰🇷",
  Chile: "🇨🇱",
  Colombia: "🇨🇴",
  Nigeria: "🇳🇬",
  Egypt: "🇪🇬",
  "United States": "🇺🇸",
  "Bosnia and Herzegovina": "🇧🇦",
  "Czechia": "🇨🇿",
  "Curacao": "🇨🇼",
  "Ivory Coast": "🇨🇮",
  Haiti: "🇭🇹",
  "South Africa": "🇿🇦",
  Turkey: "🇹🇷",
  Paraguay: "🇵🇾",
  Scotland: "🏴",
  Sweden: "🇸🇪",
  Norway: "🇳🇴",
  Iraq: "🇮🇶",
  Algeria: "🇩🇿",
  Austria: "🇦🇹",
  Jordan: "🇯🇴",
  "DR Congo": "🇨🇩",
  Uzbekistan: "🇺🇿",
  "Cape Verde": "🇨🇻",
  "New Zealand": "🇳🇿"
};

const groups = {
  A: ["Mexico", "South Africa", "South Korea", "Czechia"],
  B: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["United States", "Paraguay", "Australia", "Turkey"],
  E: ["Germany", "Curacao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"]
};

const bracketTemplate = [
  { id: "r16-1", stage: "Round of 16", teams: ["A1", "B2"] },
  { id: "r16-2", stage: "Round of 16", teams: ["C1", "D2"] },
  { id: "r16-3", stage: "Round of 16", teams: ["E1", "F2"] },
  { id: "r16-4", stage: "Round of 16", teams: ["G1", "H2"] },
  { id: "r16-5", stage: "Round of 16", teams: ["B1", "A2"] },
  { id: "r16-6", stage: "Round of 16", teams: ["D1", "C2"] },
  { id: "r16-7", stage: "Round of 16", teams: ["F1", "E2"] },
  { id: "r16-8", stage: "Round of 16", teams: ["H1", "G2"] },
  { id: "qf-1", stage: "Quarterfinals", source: ["r16-1", "r16-2"] },
  { id: "qf-2", stage: "Quarterfinals", source: ["r16-3", "r16-4"] },
  { id: "qf-3", stage: "Quarterfinals", source: ["r16-5", "r16-6"] },
  { id: "qf-4", stage: "Quarterfinals", source: ["r16-7", "r16-8"] },
  { id: "sf-1", stage: "Semifinals", source: ["qf-1", "qf-2"] },
  { id: "sf-2", stage: "Semifinals", source: ["qf-3", "qf-4"] },
  { id: "f-1", stage: "Final", source: ["sf-1", "sf-2"] }
];

const groupsContainer = document.getElementById("groups-container");
const thirdPlaceContainer = document.getElementById("third-place-container");
const bracketSection = document.getElementById("bracket-section");
const bracketContainer = document.getElementById("bracket-container");
const simulateButton = document.getElementById("simulate-bracket");
const randomizeButton = document.getElementById("randomize-standings");
const resetButton = document.getElementById("reset-all");
const winnerDisplay = document.getElementById("winner-display");

const selections = {};
const thirdPlaceSelections = {};
const matchWinners = {};

function getTeamPalette(team) {
  const hash = [...team].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return {
    accent: `hsl(${hue}, 78%, 58%)`,
    soft: `hsl(${(hue + 28) % 360}, 100%, 90%)`,
    border: `hsl(${(hue + 14) % 360}, 82%, 72%)`
  };
}

function buildGroupSelectors() {
  groupsContainer.innerHTML = "";

  Object.entries(groups).forEach(([groupName, teams]) => {
    const card = document.createElement("div");
    card.className = "group-card";

    const title = document.createElement("h3");
    title.textContent = `Group ${groupName}`;
    card.appendChild(title);

    const teamList = document.createElement("div");
    teamList.className = "team-list";

    teams.forEach(team => {
      const palette = getTeamPalette(team);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "team-button";
      button.dataset.group = groupName;
      button.dataset.team = team;
      button.style.setProperty("--team-accent", palette.accent);
      button.style.setProperty("--team-soft", palette.soft);
      button.style.setProperty("--team-border", palette.border);
      button.addEventListener("click", handleTeamButtonClick);

      const flag = document.createElement("span");
      flag.className = "team-flag";
      flag.textContent = flags[team] || "🏁";

      const name = document.createElement("span");
      name.className = "team-name";
      name.textContent = team;

      const rankBadge = document.createElement("span");
      rankBadge.className = "rank-badge";
      rankBadge.textContent = "";

      button.appendChild(flag);
      button.appendChild(name);
      button.appendChild(rankBadge);
      teamList.appendChild(button);
    });

    card.appendChild(teamList);
    groupsContainer.appendChild(card);
  });

  updateTeamRankUI();
}

function getNextAvailableRank(group) {
  const used = new Set(Object.values(selections[group] || {}).filter(Boolean));
  for (let rank = 1; rank <= 4; rank += 1) {
    if (!used.has(String(rank))) {
      return String(rank);
    }
  }
  return "";
}

function handleTeamButtonClick(event) {
  const button = event.currentTarget;
  const group = button.dataset.group;
  const team = button.dataset.team;

  if (!selections[group]) {
    selections[group] = {};
  }

  const currentRank = selections[group][team];

  if (currentRank) {
    delete selections[group][team];
  } else {
    const nextRank = getNextAvailableRank(group);
    if (!nextRank) {
      return;
    }
    selections[group][team] = nextRank;
  }

  const remaining = Object.entries(selections[group])
    .filter(([, rank]) => rank)
    .sort((a, b) => Number(a[1]) - Number(b[1]));

  selections[group] = {};
  remaining.forEach(([selectedTeam, rank], index) => {
    selections[group][selectedTeam] = String(index + 1);
  });

  updateTeamRankUI();
  buildThirdPlaceSelectors();
}

function updateTeamRankUI() {
  Object.entries(groups).forEach(([groupName, teams]) => {
    const groupCard = [...groupsContainer.children].find(card => card.querySelector("h3").textContent === `Group ${groupName}`);
    const isComplete = teams.every(team => selections[groupName] && selections[groupName][team]);
    groupCard.classList.toggle("incomplete", !isComplete);

    teams.forEach(team => {
      const button = groupCard.querySelector(`.team-button[data-team="${CSS.escape(team)}"]`);
      const selectedRank = selections[groupName] ? selections[groupName][team] : "";
      const rankBadge = button.querySelector(".rank-badge");

      button.classList.toggle("selected", Boolean(selectedRank));
      button.classList.toggle("ranked", Boolean(selectedRank));
      rankBadge.textContent = selectedRank ? selectedRank : "";
      button.setAttribute("data-rank", selectedRank || "");
    });
  });
}

function randomizeStandings() {
  Object.keys(selections).forEach(key => delete selections[key]);

  Object.entries(groups).forEach(([groupName, teams]) => {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    selections[groupName] = {};

    shuffled.forEach((team, index) => {
      selections[groupName][team] = String(index + 1);
    });
  });

  updateTeamRankUI();
  buildThirdPlaceSelectors();
}

function getThirdPlaceCandidates() {
  return Object.entries(groups).flatMap(([groupName, teams]) =>
    teams
      .filter(team => selections[groupName] && selections[groupName][team] === "3")
      .map(team => ({ group: groupName, team }))
  );
}

function buildThirdPlaceSelectors() {
  thirdPlaceContainer.innerHTML = "";

  const candidates = getThirdPlaceCandidates();
  const grid = document.createElement("div");
  grid.className = "third-place-grid";

  candidates.forEach(({ group, team }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "third-place-button";
    button.dataset.group = group;
    button.dataset.team = team;

    const flag = document.createElement("span");
    flag.className = "team-flag";
    flag.textContent = flags[team] || "🏁";

    const name = document.createElement("span");
    name.className = "team-name";
    name.textContent = team;

    const rankBadge = document.createElement("span");
    rankBadge.className = "rank-badge";
    rankBadge.textContent = thirdPlaceSelections[team] || "";

    button.appendChild(flag);
    button.appendChild(name);
    button.appendChild(rankBadge);
    button.addEventListener("click", handleThirdPlaceClick);
    grid.appendChild(button);
  });

  thirdPlaceContainer.appendChild(grid);
}

function handleThirdPlaceClick(event) {
  const button = event.currentTarget;
  const team = button.dataset.team;

  const currentRank = thirdPlaceSelections[team];
  const usedRanks = new Set(Object.values(thirdPlaceSelections));

  if (currentRank) {
    delete thirdPlaceSelections[team];
  } else {
    for (let rank = 1; rank <= 8; rank += 1) {
      if (!usedRanks.has(String(rank))) {
        thirdPlaceSelections[team] = String(rank);
        break;
      }
    }
  }

  buildThirdPlaceSelectors();
}

function getThirdPlaceSummary() {
  const thirdPlaceTeams = Object.entries(thirdPlaceSelections)
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .map(([team]) => team);
  return thirdPlaceTeams.length ? `Third-place qualifiers: ${thirdPlaceTeams.join(", ")}` : "";
}

function buildBracket() {
  const orderedGroups = {};
  let ready = true;

  Object.keys(groups).forEach(group => {
    const places = Array(4).fill(null);
    const picks = selections[group] || {};

    groups[group].forEach(team => {
      const rank = picks[team];
      const index = Number(rank) - 1;
      if (!rank || index < 0 || index > 3 || places[index]) {
        ready = false;
      } else {
        places[index] = team;
      }
    });

    if (places.some(x => x === null)) {
      ready = false;
    }

    orderedGroups[group] = places;
  });

  if (!ready) {
    alert("Please assign a unique 1-4 rank for every team in each group before simulating the bracket.");
    return;
  }

  const thirdPlaceTeams = Object.entries(thirdPlaceSelections)
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .map(([team]) => team);

  if (thirdPlaceTeams.length < 8) {
    alert("Please choose your top 8 third-place teams before simulating the knockout bracket.");
    return;
  }

  bracketSection.classList.remove("hidden");
  bracketContainer.innerHTML = "";
  winnerDisplay.textContent = "";
  Object.keys(matchWinners).forEach(key => delete matchWinners[key]);

  const rounds = ["Round of 16", "Quarterfinals", "Semifinals", "Final"];
  winnerDisplay.textContent = getThirdPlaceSummary();
  rounds.forEach(roundName => {
    const roundEl = document.createElement("div");
    roundEl.className = "round";
    const title = document.createElement("h3");
    title.textContent = roundName;
    roundEl.appendChild(title);
    bracketContainer.appendChild(roundEl);
  });

  bracketTemplate.forEach(match => {
    const roundIndex = ["Round of 16", "Quarterfinals", "Semifinals", "Final"].indexOf(match.stage);
    const roundEl = bracketContainer.children[roundIndex];

    const matchEl = document.createElement("div");
    matchEl.className = "match";
    matchEl.id = match.id;

    const label = document.createElement("label");
    label.textContent = `${match.id.replace(/-/g, ".")} — ${match.stage}`;
    matchEl.appendChild(label);

    const options = document.createElement("div");
    options.className = "match-options";

    if (match.teams) {
      const [team1Key, team2Key] = match.teams;
      const team1 = orderedGroups[team1Key[0]][Number(team1Key[1]) - 1];
      const team2 = orderedGroups[team2Key[0]][Number(team2Key[1]) - 1];
      options.appendChild(createMatchButton(match.id, team1));
      options.appendChild(createMatchButton(match.id, team2));
    } else {
      const hint = document.createElement("p");
      hint.className = "match-hint";
      hint.textContent = "Waiting for prior winners to appear.";
      options.appendChild(hint);
    }

    matchEl.appendChild(options);
    roundEl.appendChild(matchEl);
  });

  updateKnockoutOptions();
}

function createMatchButton(matchId, team) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "match-button";
  button.textContent = team;
  button.dataset.matchId = matchId;
  button.dataset.team = team;
  button.addEventListener("click", handleMatchWinner);
  return button;
}

function handleMatchWinner(event) {
  const button = event.currentTarget;
  matchWinners[button.dataset.matchId] = button.dataset.team;
  updateKnockoutOptions();
}

function updateKnockoutOptions() {
  const sourceMatches = bracketTemplate.filter(match => match.source);

  sourceMatches.forEach(match => {
    const matchEl = document.getElementById(match.id);
    const options = matchEl.querySelector(".match-options");
    const [sourceA, sourceB] = match.source;
    const winnerA = matchWinners[sourceA] || "";
    const winnerB = matchWinners[sourceB] || "";
    options.innerHTML = "";

    if (winnerA && winnerB) {
      options.appendChild(createMatchButton(match.id, winnerA));
      options.appendChild(createMatchButton(match.id, winnerB));
      if (matchWinners[match.id] && ![winnerA, winnerB].includes(matchWinners[match.id])) {
        delete matchWinners[match.id];
      }
    } else {
      const hint = document.createElement("p");
      hint.className = "match-hint";
      hint.textContent = "Waiting for prior winners to appear.";
      options.appendChild(hint);
      delete matchWinners[match.id];
    }
  });

  document.querySelectorAll(".match-button").forEach(button => {
    const matchId = button.dataset.matchId;
    button.classList.toggle("active", matchWinners[matchId] === button.dataset.team);
  });

  const finalMatch = bracketTemplate.find(match => match.id === "f-1");
  if (finalMatch) {
    const winner = matchWinners[finalMatch.id] || "";
    const summary = getThirdPlaceSummary();
    winnerDisplay.textContent = winner
      ? `${summary ? summary + "\n" : ""}Ultimate winner: ${winner}`
      : summary;
  }
}

function resetAll() {
  Object.keys(selections).forEach(key => delete selections[key]);
  Object.keys(thirdPlaceSelections).forEach(key => delete thirdPlaceSelections[key]);
  Object.keys(matchWinners).forEach(key => delete matchWinners[key]);
  buildGroupSelectors();
  buildThirdPlaceSelectors();
  bracketSection.classList.add("hidden");
  bracketContainer.innerHTML = "";
  winnerDisplay.textContent = "";
}

simulateButton.addEventListener("click", buildBracket);
randomizeButton.addEventListener("click", randomizeStandings);
resetButton.addEventListener("click", resetAll);

buildGroupSelectors();
buildThirdPlaceSelectors();
