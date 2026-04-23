let fruits = [];
let cart = {};
const deliveryCharge = 20;
const whatsappNumber = "917798933902";

async function loadFruits() {
  const res = await fetch("fruits.json");
  fruits = await res.json();
  renderFruits();
}

function renderFruits() {
  const grid = document.getElementById("fruitGrid");
  grid.innerHTML = "";

  fruits.forEach((fruit, index) => {
    if (!fruit.available) return;

    grid.innerHTML += `
      <div class="fruit-card">
        <h3>${fruit.emoji} ${fruit.name}</h3>
        <p>₹${fruit.price} / ${fruit.unit}</p>
        <button onclick="addToCart(${index})">Add</button>
      </div>
    `;
  });
}

function addToCart(index) {
  const fruit = fruits[index];

  if (!cart[fruit.name]) {
    cart[fruit.name] = { ...fruit, qty: 1 };
  } else {
    cart[fruit.name].qty += 1;
  }

  renderCart();
}

function increaseQty(name) {
  cart[name].qty += 1;
  renderCart();
}

function decreaseQty(name) {
  cart[name].qty -= 1;
  if (cart[name].qty <= 0) {
    delete cart[name];
  }
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  let subtotal = 0;

  Object.keys(cart).forEach(name => {
    const item = cart[name];
    subtotal += item.price * item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <span>${item.emoji} ${item.name}</span>
          <p>₹${item.price} x ${item.qty} = ₹${item.price * item.qty}</p>
        </div>
        <div>
          <button class="qty-btn qty-minus" onclick="decreaseQty('${name}')">-</button>
          <button class="qty-btn qty-plus" onclick="increaseQty('${name}')">+</button>
        </div>
      </div>
    `;
  });

  document.getElementById("subtotal").innerText = subtotal;
  document.getElementById("delivery").innerText = subtotal > 0 ? deliveryCharge : 0;
  document.getElementById("total").innerText = subtotal > 0 ? subtotal + deliveryCharge : 0;
}

function placeOrder() {
  const name = document.getElementById("custName").value.trim();
  const mobile = document.getElementById("custMobile").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const payment = document.getElementById("paymentMode").value;

  if (!name || !mobile || !address) {
    alert("Please fill Name, Mobile, and Address.");
    return;
  }

  if (Object.keys(cart).length === 0) {
    alert("Cart is empty!");
    return;
  }

  let message = `🍎 *Fruit Basket Order* %0A%0A`;
  message += `👤 Name: ${name}%0A`;
  message += `📞 Mobile: ${mobile}%0A`;
  message += `🏠 Address: ${address}%0A%0A`;

  message += `🛒 *Order Items:* %0A`;

  let subtotal = 0;

  Object.keys(cart).forEach(name => {
    const item = cart[name];
    subtotal += item.price * item.qty;
    message += `➡ ${item.name} (${item.qty} ${item.unit}) - ₹${item.price * item.qty}%0A`;
  });

  let total = subtotal + deliveryCharge;

  message += `%0A💰 Subtotal: ₹${subtotal}%0A`;
  message += `🚚 Delivery Charge: ₹${deliveryCharge}%0A`;
  message += `✅ Total: ₹${total}%0A%0A`;
  message += `💳 Payment Mode: ${payment}%0A%0A`;
  message += `🙏 Please confirm my order.`;

  const url = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(url, "_blank");
}

loadFruits();

document.getElementById("paymentMode").addEventListener("change", function () {
  const upiBox = document.getElementById("upiBox");

  if (this.value === "UPI") {
    upiBox.style.display = "block";
  } else {
    upiBox.style.display = "none";
  }
});
