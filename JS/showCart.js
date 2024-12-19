const carritoButton = document.getElementById("cart-show");

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const cartItemsContainer = document.getElementById("cart-items");
const finalPrice = document.getElementById("price-total");


/* Carrito en su primer render */
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
          <p>Cantidad Producto : ${item.quantity}</p>
          <button class="more-less" id="more-items-${index}"> + </button>
          <button class="more-less" id="less-items-${index}"> - </button>
          <p>Precio : ${item.quantity * 60} $ </p>
          <button class="remove-item-btn" data-index="${index}">🗑</button>
        </div>
        `;
        cartItemsContainer.appendChild(itemDiv);

        document
          .getElementById(`more-items-${index}`)
          .addEventListener("click", () => {
            updateQuantity(index, 1);
          });

        document
          .getElementById(`less-items-${index}`)
          .addEventListener("click", () => {
            updateQuantity(index, -1);
          });
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

/* Carrito con un re-renderizado */
export function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart"> NO HAY PRODUCTOS </p>`;
    finalPrice.textContent = "Precio Final: 0 $";
    document.getElementById("items-quantity").textContent =
      "Cantidad de items: 0";
  } else {
    cartItemsContainer.innerHTML = "";
    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      const totalPrice = calcularPrecioTotal();
      const itemQuantity = document.getElementById("items-quantity");
      itemQuantity.textContent = `Cantidad de items: ${cart.length}`;
      finalPrice.textContent = `Precio Final: ${totalPrice} $`;

      itemDiv.innerHTML = `
        <div class="cart-container-view">
          <img class="cart-img" src="${item.image}" alt="${item.name}">
          <span>${item.name}</span>
        </div>
        <div class="options-cart">
          <p>Cantidad Producto : ${item.quantity}</p>
          <button class="more-less" id="more-items-${index}"> + </button>
          <button class="more-less" id="less-items-${index}"> - </button>
          <p>Precio : ${item.quantity * 60} $ </p>
          <button class="remove-item-btn" data-index="${index}">🗑</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemDiv);

      document.getElementById('pay-items').addEventListener('click', () => {
        localStorage.removeItem('cart');
        renderCart();
        
        Swal.fire({
            title: 'Pago realizado',
            text: '¡El carrito ha sido pagado con éxito!',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'swal2-confirm'
          }
        });
    });

      document
        .getElementById(`more-items-${index}`)
        .addEventListener("click", () => {
          updateQuantity(index, 1);
        });

      document
        .getElementById(`less-items-${index}`)
        .addEventListener("click", () => {
          updateQuantity(index, -1);
        });
    });

    document.querySelectorAll(".remove-item-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const indexToRemove = event.target.getAttribute("data-index");
        removeItemFromCart(indexToRemove);
      });
    });
  }
}

/* Eliminar item del carrito */
function removeItemFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* Calcula precio final */
function calcularPrecioTotal() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const totalPrice = cart.reduce((total, item) => {
    return total + 60 * item.quantity;
  }, 0);

  return totalPrice;
}

/* Actualiza la cantidad de un item */
function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = cart[index];

  if (product.quantity === 1 && change === -1) {
    alert("Usa el botón de eliminar para quitar el producto del carrito.");
    return;
  }

  if (product.quantity === 9 && change === 1) {
    alert("Has alcanzado la cantidad máxima permitida para este producto.");
    return;
  }

  product.quantity = Math.min(9, Math.max(1, product.quantity + change));

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
}

/* Cerrar sidebar */
const closeSidebarButton = document.getElementById("close-sidebar");
if (closeSidebarButton) {
  closeSidebarButton.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    sidebar.classList.remove("show");
    overlay.classList.remove("active");
  });
}
