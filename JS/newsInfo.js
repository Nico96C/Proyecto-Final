document.addEventListener("DOMContentLoaded", async () => {
const newsContainer = document.getElementById("news-container");
const params = new URLSearchParams(window.location.search);
const newsId = params.get("id");

try {
    const response = await fetch("noticias.json");
    const data = await response.json();

    const newsItem = data.news.find((item) => item.id == newsId);

    if (newsItem) {
    const newsContent = `
                <h1 class="news-title">${newsItem.title}</h1>
                <div class="img-news-container">
                    <img class="news-img" loading="lazy" src="${newsItem.img}" alt="Imagen de la noticia">
                </div>
                ${newsItem.texts
                .map((text) => `<p class="news-paragraph">${text.content}</p>`)
                .join("")}
                <p class="news-date">${newsItem.date}</p>
                <p class="news-author">${newsItem.writter}</p>
            `;
    newsContainer.innerHTML = newsContent;
    } else {
    newsContainer.innerHTML = "<p>Noticia no encontrada.</p>";
    }
} catch (error) {
    console.error("Error cargando el JSON:", error);
    newsContainer.innerHTML = "<p>Hubo un error al cargar la noticia.</p>";
}
});
