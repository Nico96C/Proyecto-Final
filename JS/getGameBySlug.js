import CONFIG from "../config.js";
import { renderCart } from "./showCart.js";

/* se hace la buscada del ID para el juego al cargar la pagina y traigo info */
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
      console.log(data.developers);

      const developers =
        data.developers && data.developers.length > 0
          ? data.developers.map((dev) => `<p>${dev.name}</p>`).join("")
          : "<p>No disponible</p>";

      const gamePrice = "60";

      const descriptionRaw = data.description_raw;

      const descriptionInSpanish =
        descriptionRaw.split("Español")[1]?.trim() || descriptionRaw;

      const metacriticScore = data.metacritic || "Sin Puntaje";
      let scoreClass = "";

      if (metacriticScore >= 75) {
        scoreClass = "green";
      } else if (metacriticScore >= 50) {
        scoreClass = "yellow";
      } else if (metacriticScore < 50 && metacriticScore >= 0) {
        scoreClass = "red";
      }

      //Se renderiza en el contenedor//
      const gameDetailsContainer = document.getElementById("game-details");
      gameDetailsContainer.innerHTML = `
        <div class="container">
          <h1 class="game-name-2">${data.name}</h1>
          <div class="game-details-side">
            <div class="game-img-container">
              <img src="${data.background_image}" alt="${
        data.name
      }" class="card-img-top">
              <button class="add-item-btn-2" id="add-cart-game"> Agregar al Carrito </button>
            </div>
            <div class="card-body">
              <h1 class="game-name">${data.name}</h1>
              <h2 class="metacritic-media ${scoreClass}"> ${metacriticScore} </h2>
              <p><strong>Fecha de lanzamiento:</strong> ${
                data.released || "No disponible"
              }</p>
              <p><strong>Precio: ${gamePrice} $</strong></p>
              <p><strong>Valoración:</strong> ${
                data.rating + " / " + data.rating_top + " ⭐ " ||
                "No disponible"
              }</p>
              <h2 class="developers-title"> Desarrolladores </h2>
              <div class="developers-names">
                ${developers}
              </div>
            </div>
          </div>
          <div class="description">
            <h2> DESCRIPCIÓN </h2>
            <p class="description-text" id="description-text">
            ${descriptionInSpanish || "No disponible"}</p>
            <button class="toggle-btn" id="toggle-btn">Ver Más ▼</button>
          </div>
          <h2 class="reviews-user"> RESEÑAS DE USUARIOS </h2>
          <div class="section-reviews">
            <div class="rating-bar">
              <strong>${data.ratings[0].title.toUpperCase()}:</strong> ${
        data.ratings[0].percent
      }% (${data.ratings[0].count} votos)
              <div class="progress-bar">
                <div class="progress" style="width: ${
                  data.ratings[0].percent
                }%;"></div>
              </div>
            </div>

            <div class="rating-bar">
              <strong>${data.ratings[1].title.toUpperCase()}:</strong> ${
        data.ratings[1].percent
      }% (${data.ratings[1].count} votos)
              <div class="progress-bar">
                <div class="progress" style="width: ${
                  data.ratings[1].percent
                }%;"></div>
              </div>
            </div>

            <div class="rating-bar">
              <strong>${data.ratings[2].title.toUpperCase()}:</strong> ${
        data.ratings[2].percent
      }% (${data.ratings[2].count} votos)
              <div class="progress-bar">
                <div class="progress" style="width: ${
                  data.ratings[2].percent
                }%;"></div>
              </div>
            </div>

            <div class="rating-bar">
              <strong>${data.ratings[3].title.toUpperCase()}:</strong> ${
        data.ratings[3].percent
      }% (${data.ratings[3].count} votos)
              <div class="progress-bar">
                <div class="progress" style="width: ${
                  data.ratings[3].percent
                }%;"></div>
              </div>
            </div>
          </div>
        </div>
      `;

      const toggleBtn = document.getElementById("toggle-btn");
      const descriptionText = document.getElementById("description-text");

      toggleBtn.addEventListener("click", () => {
        const currentHeight = getComputedStyle(descriptionText).maxHeight;
        const isExpanded = currentHeight !== "70px";
      
        descriptionText.style.maxHeight = isExpanded ? "70px" : "600px";
        toggleBtn.textContent = isExpanded ? "Ver Más ▼" : "Ver Menos ▲";
      
        descriptionText.style.transition = "max-height 0.2s ease-in-out";
      });

      document.addEventListener("click", (event) => {
        if (event.target && event.target.id === "add-cart-game") {
          console.log("Botón clickeado desde delegación de eventos");
          agregarAlCarrito(data);
        }
      });
    });

    /* Funcion de videos y los coloco en el codigo */
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
            <video class="game-video" src="${videoUrl}" controls></video>
          </div>
        `;
        } else {
          gameVideoContainer.innerHTML = `<p class="video-null">No hay videos disponibles para este juego.</p>`;
        }
      })
      .catch((error) => {
        console.error("Error al obtener los videos del juego:", error);
      });
  } else {
    console.log("No se proporcionó un ID de juego en la URL.");
  }

  /* Busco juegos apartir de la ID */
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

  /* Busco los trailers de los juegos */
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

/* Agregar al carrito */
function agregarAlCarrito(game) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existe = cart.find((item) => item.id === game.id);

  if (existe) {
    existe.quantity += 1;
    alert(`La cantidad de "${game.name}" ha sido incrementada a ${existe.quantity}.`);
  } else {
    cart.push({
      id: game.id,
      name: game.name,
      image: game.background_image,
      quantity: 1,
    });
    alert(`${game.name} ha sido agregado al carrito.`);
  }

  // Guardar en localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Renderizar el carrito (si tienes esta función definida)
  renderCart();
}
