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
      console.log(data.ratings);

      const descriptionRaw = data.description_raw || "Descripción no disponible";

      const descriptionInSpanish = descriptionRaw.split("Español")[1]?.trim() || "Descripción no disponible";

      //Se renderiza en el contenedor//
      const gameDetailsContainer = document.getElementById("game-details");
      gameDetailsContainer.innerHTML = `
        <div class="container">
        <div class="game-details-side">
          <img src="${data.background_image}" alt="${
        data.name
      }" class="card-img-top">
        <button class="add-item-btn"> Agregar al carrito </button>
          <div class="card-body">
            <h1>${data.name}</h1>
            <h2 class="metacritic-media"> ${data.metacritic} </h2>
            <p><strong>Fecha de lanzamiento:</strong> ${
              data.released || "No disponible"
            }</p>
            <p><strong>Rating:</strong> ${
              data.rating + " / " + data.rating_top + " ⭐ " || "No disponible"
            }</p>
          </div>
        </div>
          <div class="description">
            <h2> Descripción </h2>
            <p class="description-text" id="description-text">${
              descriptionInSpanish || "No disponible"
            }</p>
            <button class="toggle-btn" id="toggle-btn">Ver Más ▼</button>
          </div>
          <div>
            <p>
              <span>${data.ratings[0].title}: ${data.ratings[0].percent}% (${
        data.ratings[0].count
      } votos)</span><br>
              <span>${data.ratings[1].title}: ${data.ratings[1].percent}% (${
        data.ratings[1].count
      } votos)</span><br>
              <span>${data.ratings[2].title}: ${data.ratings[2].percent}% (${
        data.ratings[2].count
      } votos)</span><br>
              <span>${data.ratings[3].title}: ${data.ratings[3].percent}% (${
        data.ratings[3].count
      } votos)</span><br>
            </p>
          </div>
        </div>
      `;

      const toggleBtn = document.getElementById("toggle-btn");
      const descriptionText = document.getElementById("description-text");

      toggleBtn.addEventListener("click", () => {
        const isExpanded = descriptionText.style.webkitLineClamp === "unset";
        descriptionText.style.webkitLineClamp = isExpanded ? "3" : "unset";
        toggleBtn.textContent = isExpanded ? "Ver Más ▼" : "Ver Menos ▲";
      });
    });

    getVideoTrailers(gameId)
      .then((data) => {
        console.log("Los Videos del juego:", data);

        const gameVideoContainer = document.getElementById("game-video");

        // Verifica si hay resultados
        if (data.results && data.results.length > 0) {
          const videoData = data.results[0];
          const videoUrl = videoData.data["480"];

          gameVideoContainer.innerHTML = `
          <div>
            <video src="${videoUrl}" controls></video>
          </div>
        `;
        } else {
          gameVideoContainer.innerHTML = `<p>No hay videos disponibles para este juego.</p>`;
        }
      })
      .catch((error) => {
        console.error("Error al obtener los videos del juego:", error);
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
      .catch(() => console.log("Error al obtener el juego"));
  }

  function getVideoTrailers(id) {
    const apiKey = CONFIG.API_KEY;

    return fetch(`https://api.rawg.io/api/games/${id}/movies?key=${apiKey}`)
      .then((response) => {
        if (!response.ok) {
          console.log("Error al obtener los datos de la API");
        }
        return response.json();
      })
      .then((data) => {
        return data; //Datos de Trailers//
      })
      .catch(() => console.log("Error al obtener los trailers"));
  }
});
