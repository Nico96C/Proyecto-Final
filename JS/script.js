import CONFIG from "../config.js";

var currentPage = 1;

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

  setTimeout(() => {
    // Limpia los placeholders //
    gameList.innerHTML = "";
  
    // Inserta las cards originales //
    games.forEach((game) => {
      const div = document.createElement("div");
      div.classList.add("col-md-3", "mb-4", "d-flex", "justify-content-center");

      // Estructura de cada card como anchor //
      div.innerHTML = `
        <a href="/gamesDetails.html?id=${game.id}" class="text-decoration-none" data-id="${game.id}">
          <div class="card game-card text-bg-dark">
            <img src="${game.background_image}" alt="${game.name}" class="card-img">
            <div class="card-img-overlay d-flex align-items-center justify-content-center">
              <h3 class="card-title text-center">${game.name}</h3>
            </div>
          </div>
        </a>
      `;
      gameList.appendChild(div);
    });
  }, 2000);
}

displayGames(currentPage); //Muestra juegos de cantidad de paginas actuales//

const loadMoreButton = document.getElementById("load-more"); //Traigo el elemento boton de cargar mas//

const loadLessButton = document.getElementById("load-less"); //Traigo el elemento boton de cargar mas//

loadMoreButton.addEventListener("click", () => {
  currentPage += 1;
  displayGames(currentPage);
  updatePageDisplay();
  updateButtonState();
});

loadLessButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    displayGames(currentPage);
    updatePageDisplay()
    updateButtonState(); // Actualiza el estado del botón //
  } else {
    loadLessButton.disabled = true;
    loadLessButton.classList.add("disabled");
  }
});
//Agrega un evento, aumenta la paginación y llama nuevamente la función//

var actualPage = document.getElementById("page");

actualPage.textContent = currentPage;

function updatePageDisplay() {
  actualPage.textContent = currentPage;
}

function updateButtonState() {
  // Si la página actual es la primera, deshabilitamos el botón "cargar menos"
  if (currentPage <= 1) {
    loadLessButton.disabled = true;
    loadLessButton.classList.add("disabled");
  } else {
    loadLessButton.disabled = false;
    loadLessButton.classList.remove("disabled"); // Remueve la clase
  }
}
