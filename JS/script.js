import CONFIG from "../config.js";

let currentPage = 1;

async function obtainGames(page = 1, pageSize = 20) {
  const apiKey = CONFIG.API_KEY;
  const url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=${pageSize}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error al obtener los juegos:", error);
    return [];
  }
}

async function displayGames(page = 1) {
  const games = await obtainGames(page, 20);
  const gameList = document.getElementById("game-list");

  games.forEach((game) => {
    const div = document.createElement("div");
    div.classList.add("game");
    div.innerHTML = `
        <h3>${game.name}</h3>
        <img src="${game.background_image}" alt="${game.name}">
        <p>Plataformas: ${game.platforms
          .map((platform) => platform.platform.name)
          .join(", ")}</p>
      `;
    gameList.appendChild(div);
  });
}

displayGames(currentPage); //Muestra juegos de cantidad de paginas actuales//

const loadMoreButton = document.getElementById("load-more"); //Traigo el elemento boton de cargar mas//

loadMoreButton.addEventListener("click", () => {
  currentPage += 1;
  displayGames(currentPage);
});
//Agrega un evento, aumenta la paginación y llama nuevamente la función//
