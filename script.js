let fruits = [];
let cart = {};

const deliveryCharge = 45;
const whatsappNumber = "917798933902";

// -------------------------
// Load Fruits JSON
// -------------------------
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

// -------------------------
// Cart Functions
// -------------------------
function addToCart(index) {
  const fruit = fruits[index];

  if (!cart[fruit.name]) {
    cart[fruit.name] = { ...fruit, qty: fruit.step };
  } else {
    cart[fruit.name].qty += fruit.step;
  }

  renderCart();
}

function increaseQty(name) {
  cart[name].qty += cart[name].step;
  renderCart();
}

function decreaseQty(name) {
  cart[name].qty -= cart[name].step;

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
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <span>${item.emoji} ${item.name}</span>
          <p>₹${item.price} x ${item.qty} ${item.unit} = ₹${itemTotal.toFixed(0)}</p>
        </div>
        <div>
          <button class="qty-btn qty-minus" onclick="decreaseQty('${name}')">-</button>
          <button class="qty-btn qty-plus" onclick="increaseQty('${name}')">+</button>
        </div>
      </div>
    `;
  });

  document.getElementById("subtotal").innerText = subtotal.toFixed(0);
  document.getElementById("delivery").innerText = subtotal > 0 ? deliveryCharge : 0;
  document.getElementById("total").innerText =
    subtotal > 0 ? (subtotal + deliveryCharge).toFixed(0) : 0;
}

// -------------------------
// Order History Functions
// -------------------------
function saveOrderHistory(orderDetails) {
  let history = JSON.parse(localStorage.getItem("fruitOrders")) || [];
  history.unshift(orderDetails);

  localStorage.setItem("fruitOrders", JSON.stringify(history));
  loadOrderHistory();
}

function loadOrderHistory() {
  const div = document.getElementById("orderHistory");
  if (!div) return;

  let history = JSON.parse(localStorage.getItem("fruitOrders")) || [];

  if (history.length === 0) {
    div.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  div.innerHTML = "";

  history.forEach(h => {
    div.innerHTML += `
      <div class="history-item">
        <p><b>${h.date}</b></p>
        <p><b>Customer:</b> ${h.name}</p>
        <p><b>Total (Approx):</b> ₹${h.total}</p>
      </div>
    `;
  });
}

function clearOrderHistory() {
  localStorage.removeItem("fruitOrders");
  loadOrderHistory();
}

// -------------------------
// Place Order
// -------------------------
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

  let subtotal = 0;

  let message = `🍎 *Fruit Basket Order* %0A%0A`;
  message += `👤 Name: ${name}%0A`;
  message += `📞 Mobile: ${mobile}%0A`;
  message += `🏠 Address: ${address}%0A%0A`;

  message += `🛒 *Order Items:* %0A`;

  Object.keys(cart).forEach(itemName => {
    const item = cart[itemName];
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    message += `➡ ${item.name} - ${item.qty} ${item.unit} (₹${itemTotal.toFixed(0)})%0A`;
  });

  let total = subtotal + deliveryCharge;

  message += `%0A💰 Subtotal (Approx): ₹${subtotal.toFixed(0)}%0A`;
  message += `🚚 Delivery Charge: ₹${deliveryCharge}%0A`;
  message += `✅ Total (Approx): ₹${total.toFixed(0)}%0A%0A`;

  message += `⚠ *Note:* फळांचे वजन exact नसल्यामुळे अंतिम बिल कमी/जास्त होऊ शकते.%0A%0A`;

  message += `💳 Payment Mode: ${payment}%0A%0A`;
  message += `🙏 Please confirm my order.`;

  // Save order in history
  saveOrderHistory({
    date: new Date().toLocaleString(),
    name: name,
    total: total.toFixed(0)
  });

  // Open WhatsApp
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(url, "_blank");

  // Clear cart after placing order
  cart = {};
  renderCart();
}

// -------------------------
// Init
// -------------------------
loadFruits();
loadOrderHistory();
function initUPIListener() {
  const paymentDropdown = document.getElementById("paymentMode");
  const upiBox = document.getElementById("upiBox");

  if (!paymentDropdown || !upiBox) return;

  paymentDropdown.addEventListener("change", function () {
    if (this.value === "UPI") {
      upiBox.style.display = "block";
    } else {
      upiBox.style.display = "none";
    }
  });
}

window.addEventListener("load", initUPIListener);
