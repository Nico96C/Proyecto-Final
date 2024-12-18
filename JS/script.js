import CONFIG from "../config.js";
import { renderCart } from "./showCart.js";

var currentPage = 1;

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("button-addon2");

/* BUSQUEDA JUEGOS AL ENTRAR A PAGINA */

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

  console.log("Juegos obtenidos:");
  console.log(games);

  setTimeout(() => {
    // Limpia los placeholders //
    gameList.innerHTML = "";

    // Inserta las cards originales //
    games.forEach((game) => {
      const newDiv = document.createElement("div");
      newDiv.classList.add("col-md-3", "d-flex", "justify-content-center");

      // Estructura de cada card como anchor //
      newDiv.innerHTML = `
        <a href="/gamesDetails.html?id=${game.id}" class="text-decoration-none" data-id="${game.id}" style="height: 250px !important;">
          <div class="card game-card text-bg-dark" style="height: 250px !important;">
            <img src="${game.background_image}" alt="${game.name}" class="card-img">
            <div class="card-img-overlay d-flex align-items-center justify-content-center">
              <h3 class="card-title text-center">${game.name}</h3>
              <button id="add-item" class="add-item-btn">Añadir al Carrito</button>
            </div>
          </div>
        </a>
      `;

      const botonAgregar = newDiv.querySelector(".add-item-btn");

      botonAgregar.addEventListener("click", () => {
        event.preventDefault();
        event.stopPropagation();
        agregarAlCarrito(game);
      });

      gameList.appendChild(newDiv);
    });
  }, 2250);
}

/* BUSQUEDA JUEGOS POR INPUT */

async function searchGames(query) {
  const apiKey = CONFIG.API_KEY;
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${apiKey}&search=${query}`
    );
    if (!response.ok) {
      console.log("Error al buscar los juegos.");
    }
    const data = await response.json();
    // Filtra elementos null //
    const filteredResults = data.results.filter(
      (game) => game && game.name && game.background_image
    );
    return filteredResults;
  } catch (error) {
    console.log("Error en busqueda");
    return [];
  }
}

searchButton.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (query) {
    const games = await searchGames(query);
    renderGames(games);
  }
});

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  if (query.trim() === "") {
    displayGames(1);
  }

  /*
  // Si hay texto, realiza la búsqueda //
    const games = await searchGames(query);
    renderGames(games);
  */
});

function renderGames(games) {
  const gameList = document.getElementById("game-list");
  gameList.innerHTML = ""; // Limpia los resultados anteriores //
  games.forEach((game) => {
    const div = document.createElement("div");
    div.classList.add("col-md-3", "mb-4", "d-flex", "justify-content-center");
    div.innerHTML = `
      <a href="/gamesDetails.html?id=${game.id}" class="text-decoration-none" data-id="${game.id}" style="height: 250px !important;">
          <div class="card game-card text-bg-dark" style="height: 250px !important;">
            <img src="${game.background_image}" alt="${game.name}" class="card-img">
            <div class="card-img-overlay d-flex align-items-center justify-content-center">
              <h3 class="card-title text-center">${game.name}</h3>
              <button id="add-item" class="add-item-btn">Añadir al Carrito</button>
            </div>
          </div>
        </a>
    `;

    const botonAgregar = div.querySelector(".add-item-btn");

      botonAgregar.addEventListener("click", () => {
        event.preventDefault();
        event.stopPropagation();
        agregarAlCarrito(game);
      });

    gameList.appendChild(div);
  });
}

function agregarAlCarrito(game) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existe = cart.find((item) => item.id === game.id);

  if (existe) {
    alert(`${game.name} ya está en el carrito.`);
  } else {
    // Agregar el juego al carrito //
    cart.push({
      id: game.id,
      name: game.name,
      image: game.background_image,
    });

    // Guardar en localStorage //
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${game.name} ha sido agregado al carrito.`);
    renderCart();
  }
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
    updatePageDisplay();
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
