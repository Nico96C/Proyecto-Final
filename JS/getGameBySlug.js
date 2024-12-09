import CONFIG from "../config.js";

document.addEventListener("DOMContentLoaded", function () {
  //Parametro de la URL 'id'//
  function getGameIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  const gameId = getGameIdFromUrl();

  //Verifica el ID del Juego//
  if (gameId) {
    //Llamado a la API//
    getGameById(gameId).then((data) => {
      console.log("Información del juego:", data);

      //Se renderiza en el contenedor//
      const gameDetailsContainer = document.getElementById("game-details");
      gameDetailsContainer.innerHTML = `
        <div class="container">
        <div class="game-details-side">
          <img src="${data.background_image}" alt="${data.name}" class="card-img-top">
          <div class="card-body">
            <h1>${data.name}</h1>
            <h2 class="metacritic-media"> ${data.metacritic} </h2>
            <p><strong>Fecha de lanzamiento:</strong> ${
              data.released || "No disponible"
            }</p>
            <p><strong>Rating:</strong> ${data.rating || "No disponible"}</p>
          </div>
        </div>
          <p><strong>Descripción:</strong> ${
            data.description_raw || "No disponible"
          }</p>
        </div>
      `;
    });
  } else {
    console.log("No se proporcionó un ID de juego en la URL.");
  }

  function getGameById(id) {
    const apiKey = CONFIG.API_KEY;

    return fetch(`https://api.rawg.io/api/games/${id}?key=${apiKey}`)
      .then((response) => {
        if (!response.ok) {
          console.log("Error al obtener los datos de la API");
        }
        return response.json();
      })
      .then((data) => {
        return data; //Datos Juegos//
      })
      .catch(() => console.log ("Error al obtener el juego"));
  }
});
