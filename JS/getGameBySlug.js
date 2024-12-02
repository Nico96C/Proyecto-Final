import CONFIG from "../config.js";

document.addEventListener("DOMContentLoaded", function () {
  function getGameById(id) {
    const apiKey = CONFIG.API_KEY;

    return fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
        }
        return response.json();
      })
      .then((data) => {
        return data; // Devuelve los datos del juego
      })
      .catch((error) => console.error("Error al obtener el juego:", error));
  }

  // Función para obtener el parámetro `id` de la URL
  function getGameIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // Obtiene el valor de `id` de la URL
  }

  // Obtén el ID del juego desde la URL
  const gameId = getGameIdFromUrl();

  // Asegúrate de que `gameId` no sea nulo o inválido
  if (gameId) {
    // Llama a la API para obtener los datos del juego
    getGameById(gameId).then((data) => {
      console.log("Información del juego:", data);

      // Renderiza los detalles en el contenedor
      const gameDetailsContainer = document.getElementById("game-details");
      gameDetailsContainer.innerHTML = `
        <div>
          <img src="${data.background_image}" alt="${
        data.name
      }" class="card-img-top">
          <div class="card-body">
            <h2>${data.name}</h2>
            <p><strong>Descripción:</strong> ${
              data.description_raw || "No disponible"
            }</p>
            <p><strong>Fecha de lanzamiento:</strong> ${
              data.released || "No disponible"
            }</p>
            <p><strong>Rating:</strong> ${data.rating || "No disponible"}</p>
          </div>
        </div>
      `;
    });
  } else {
  }
});
