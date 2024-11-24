import CONFIG from "../config.js";

document.addEventListener("DOMContentLoaded", function () {
    function getGameBySlug(slug) {
      const apiKey = CONFIG.API_KEY;
  
      return fetch(`https://api.rawg.io/api/games/${slug}?key=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          return data; // Devuelve los datos del juego
        })
        .catch((error) => console.error("Error al obtener el juego:", error));
    }
  
    document.querySelectorAll(".game-button").forEach((button) => {
      button.addEventListener("click", function () {
        const slug = this.dataset.slug; // Obtiene el Slug del elemento
        getGameBySlug(slug).then((data) => {
          console.log("Información del juego:", data);
        });
      });
    });
  });