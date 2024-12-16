const carritoButton = document.getElementById("cart-show");


if (carritoButton) {
  carritoButton.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const cartItemsContainer = document.getElementById("cart-items");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
      cart.forEach((item) => {
        const itemDiv = document.createElement("div");
        const itemQuantity = document.getElementById("items-quantity");
        itemQuantity.textContent = `Cantidad de items: ${cart.length}`;

        itemDiv.innerHTML = `
            <div class="cart-container-view">
              <img class="cart-img" src="${item.image}" alt="${item.name}">
              <span>${item.name}</span>
            </div>
            <div class="options-cart">
                <p>Cantidad Producto : 1</p>
                <button id="remove-item-btn" class="remove-item-btn">🗑</button>
            </div>
          `;
        cartItemsContainer.appendChild(itemDiv);
      });
    }

    sidebar.classList.add("show");
    overlay.classList.add("active")
  });
}

const closeSidebarButton = document.getElementById("close-sidebar");
if (closeSidebarButton) {
  closeSidebarButton.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay")
    sidebar.classList.remove("show");
    overlay.classList.remove("active");
  });
}
