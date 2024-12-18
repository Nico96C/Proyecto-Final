const carritoButton = document.getElementById("cart-show");

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const cartItemsContainer = document.getElementById("cart-items");
const finalPrice = document.getElementById("price-total");

if (carritoButton) {
  carritoButton.addEventListener("click", () => {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="empty-cart"> NO HAY PRODUCTOS </p>`;
      finalPrice.textContent = "Precio Final: 0 $";
      document.getElementById("items-quantity").textContent =
        "Cantidad de items: 0";
    } else {
      cartItemsContainer.innerHTML = "";

      cart.forEach((item, index) => {
        var totalPrice = cart.length * 60;
        const itemDiv = document.createElement("div");
        const itemQuantity = document.getElementById("items-quantity");
        itemQuantity.textContent = `Cantidad de items: ${cart.length}`;
        finalPrice.textContent = `Precio Final: ${totalPrice} $`;

        itemDiv.innerHTML = `
          <div class="cart-container-view">
            <img class="cart-img" src="${item.image}" alt="${item.name}">
            <span>${item.name}</span>
          </div>
          <div class="options-cart">
            <p>Cantidad Producto : 1</p>
            <p>Precio : 60 $ </p>
            <button class="remove-item-btn" data-index="${index}">🗑</button>
          </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
      });

      document.querySelectorAll(".remove-item-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const indexToRemove = event.target.getAttribute("data-index");
          removeItemFromCart(indexToRemove);
        });
      });
    }

    sidebar.classList.add("show");
    overlay.classList.add("active");
    renderCart();
  });
}

function removeItemFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

export function renderCart() {

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart"> NO HAY PRODUCTOS </p>`;
    finalPrice.textContent = "Precio Final: 0 $";
    document.getElementById("items-quantity").textContent =
      "Cantidad de items: 0";
  } else {
    console.log("se esta renderizando..")
    cartItemsContainer.innerHTML = "";
    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      var totalPrice = cart.length * 60;
      const itemQuantity = document.getElementById("items-quantity");
      itemQuantity.textContent = `Cantidad de items: ${cart.length}`;
      finalPrice.textContent = `Precio Final: ${totalPrice} $`;

      itemDiv.innerHTML = `
        <div class="cart-container-view">
          <img class="cart-img" src="${item.image}" alt="${item.name}">
          <span>${item.name}</span>
        </div>
        <div class="options-cart">
          <p>Cantidad Producto : 1</p>
          <p>Precio : 60 $ </p>
          <button class="remove-item-btn" data-index="${index}">🗑</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemDiv);
    });

    document.querySelectorAll(".remove-item-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const indexToRemove = event.target.getAttribute("data-index");
        removeItemFromCart(indexToRemove);
      });
    });
  }
}

const closeSidebarButton = document.getElementById("close-sidebar");
if (closeSidebarButton) {
  closeSidebarButton.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    sidebar.classList.remove("show");
    overlay.classList.remove("active");
  });
}
