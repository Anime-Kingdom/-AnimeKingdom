<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Anime Kingdom</title>
<style>
:root {
  color-scheme: dark;
  --purple: #b637f3;
  --border: #49235c;
  --muted: #bea9cc;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: #09050e;
  color: #fff;
  font-family: Arial, sans-serif;
}
header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 15px 5%;
  background: #09050ef2;
  border-bottom: 1px solid var(--border);
}
.brand { display: flex; align-items: center; gap: 12px; }
.brand img { width: 60px; height: 60px; object-fit: contain; }
.brand strong { letter-spacing: 3px; }
nav { display: flex; flex-wrap: wrap; gap: 10px; }
button, .button {
  display: inline-block;
  background: var(--purple);
  color: white;
  border: 1px solid transparent;
  border-radius: 7px;
  padding: 12px 18px;
  font: inherit;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}
button:hover, .button:hover { filter: brightness(1.15); }
button:disabled { opacity: .5; cursor: wait; }
.secondary { background: #21102d; border-color: var(--border); }
main { max-width: 1250px; margin: auto; padding: 30px 5%; }
.hero {
  padding: 75px 35px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background:
    radial-gradient(ellipse at right, #802ab955, transparent 65%),
    #100819;
}
.hero h1 { font-size: clamp(42px, 8vw, 90px); margin: 15px 0; }
.hero span, .price { color: #d58bff; }
p { color: var(--muted); line-height: 1.7; }
h2 { margin-top: 30px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.card, .box {
  background: #140b1e;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
}
.art {
  display: grid;
  place-items: center;
  height: 170px;
  font-size: 75px;
  border-radius: 10px;
  background: radial-gradient(circle, #6e229c66, #08040e);
}
.price { font-size: 25px; font-weight: bold; }
.layout { display: grid; grid-template-columns: 1.3fr 1fr; gap: 25px; }
.fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
label { display: block; margin: 12px 0; line-height: 1.6; }
input, textarea {
  display: block;
  width: 100%;
  margin-top: 7px;
  padding: 13px;
  border: 1px solid #634073;
  border-radius: 6px;
  background: #0b0611;
  color: white;
  font: inherit;
}
input[type="radio"] { display: inline; width: auto; accent-color: var(--purple); }
.method { padding: 16px; border: 1px solid var(--border); border-radius: 8px; }
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}
.controls { display: flex; align-items: center; gap: 10px; }
.controls button { padding: 5px 11px; }
#qr {
  width: 240px;
  max-width: 100%;
  background: white;
  padding: 12px;
  border-radius: 10px;
}
#preview { max-width: 100%; max-height: 300px; margin: 15px 0; }
.notice { padding: 14px; background: #291433; border-radius: 8px; font-size: 14px; }
.wide { grid-column: 1 / -1; }
[hidden] { display: none !important; }
footer { text-align: center; padding: 35px; color: var(--muted); }
#message { color: #edc4ff; }
@media(max-width: 800px) {
  header { flex-direction: column; }
  .grid, .layout { grid-template-columns: 1fr; }
  .fields { grid-template-columns: 1fr; }
  .hero { padding: 40px 22px; }
}
</style>
</head>
<body>

<header>
  <div class="brand">
    <img src="AK.jpeg" alt="Anime Kingdom logo">
    <strong>ANIME KINGDOM</strong>
  </div>
  <nav aria-label="Main navigation">
    <button class="secondary" onclick="show('home')">Home</button>
    <button class="secondary" onclick="show('shop')">Shop</button>
    <button class="secondary" onclick="show('orders')">My orders</button>
    <button onclick="show('cart')">Cart (<span id="count">0</span>)</button>
  </nav>
</header>

<main>
  <p id="message" role="status"></p>

  <section id="home">
    <div class="hero">
      <p>WELCOME TO YOUR KINGDOM</p>
      <h1>ANIME<br><span>ACTION FIGURES</span></h1>
      <p>Bring your favourite characters into your collection.</p>
      <button onclick="show('shop')">SHOP COLLECTION →</button>
    </div>
    <h2>Built for collectors</h2>
    <div class="grid">
      <article class="card"><h3>Anime figures</h3><p>Find your next display piece.</p></article>
      <article class="card"><h3>Custom concepts</h3><p>Imagine a figure of your own.</p></article>
      <article class="card"><h3>New arrivals</h3><p>Explore the kingdom’s collection.</p></article>
    </div>
  </section>

  <section id="shop" hidden>
    <h1>SHOP THE KINGDOM</h1>
    <p>Sample catalog. Confirm current prices and availability with the seller.</p>
    <div id="products" class="grid"></div>
  </section>

  <section id="cart" hidden>
    <h1>YOUR CART</h1>
    <div id="cartItems" class="box"></div>
  </section>

  <section id="checkout" hidden>
    <h1>DELIVERY & PAYMENT</h1>
    <form id="checkoutForm" class="layout">
      <div>
        <div class="box">
          <h2>Delivery details</h2>
          <div class="fields">
            <label>Full name
              <input name="name" autocomplete="name" required>
            </label>
            <label>Email
              <input name="email" type="email" autocomplete="email" required>
            </label>
            <label>Mobile number
              <input name="phone" type="tel" pattern="[6-9][0-9]{9}"
                     maxlength="10" autocomplete="tel" required>
            </label>
            <label>PIN code
              <input name="pin" pattern="[1-9][0-9]{5}" maxlength="6"
                     inputmode="numeric" autocomplete="postal-code" required>
            </label>
            <label class="wide">Full address
              <textarea name="address" autocomplete="street-address" required></textarea>
            </label>
            <label>City
              <input name="city" autocomplete="address-level2" required>
            </label>
            <label>State
              <input name="state" autocomplete="address-level1" required>
            </label>
          </div>
        </div>

        <div class="box" style="margin-top:20px">
          <h2>Payment method</h2>
          <label class="method">
            <input type="radio" name="payment" value="cod" checked
                   onchange="paymentMode()">
            Cash on Delivery
          </label>
          <label class="method">
            <input type="radio" name="payment" value="upi"
                   onchange="paymentMode()">
            UPI — QR code or UPI app
          </label>

          <div id="upiFields" hidden>
            <p>UPI ID: <strong>7081201212@fam</strong></p>
            <button class="secondary" type="button" onclick="copyUPI()">COPY UPI ID</button>
            <p>Scan and enter the exact order total:</p>
            <img id="qr" src="anime-kingdom-upi.svg"
                 alt="UPI payment QR for 7081201212@fam">
            <p><a id="upiLink" class="button">OPEN UPI APP</a></p>
            <p>Verify the recipient in your UPI app before approving payment.</p>

            <h3>After payment</h3>
            <label>UTR / transaction number
              <input id="utr" name="utr" inputmode="numeric"
                     pattern="[0-9]{12}" maxlength="12"
                     placeholder="12-digit UTR" disabled>
            </label>
            <label>Payment screenshot
              <input id="screenshot" type="file"
                     accept="image/png,image/jpeg,image/webp" disabled>
            </label>
            <p>PNG, JPG or WebP, maximum 2 MB.</p>
            <img id="preview" alt="Payment screenshot preview" hidden>
            <p>UTR and screenshot require manual verification.</p>
          </div>
        </div>
      </div>

      <aside class="box">
        <h2>Order summary</h2>
        <div id="summary"></div>
        <p class="notice">
          This HTML file saves orders on this device only.
          It does not send orders to the seller or arrange delivery.
          Confirm the order and amount with the seller before paying.
        </p>
        <button id="submitOrder" type="submit">SAVE COD ORDER</button>
      </aside>
    </form>
  </section>

  <section id="orders" hidden>
    <h1>MY ORDERS</h1>
    <p>Saved on this device. Seller confirmation is required.</p>
    <div id="orderList"></div>
  </section>
</main>

<footer>© Anime Kingdom · アニメ王国</footer>

<script>
const UPI = "7081201212@fam";
const KEY = "anime-kingdom-compact-v1";
const products = [
  { id: "gojo", name: "Gojo Satoru Figure", price: 2499, icon: "✦" },
  { id: "naruto", name: "Naruto Figure", price: 1999, icon: "⚡" },
  { id: "luffy", name: "Luffy Figure", price: 2299, icon: "☠" }
];

let state = { cart: {}, orders: [] };
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved && saved.cart && Array.isArray(saved.orders)) state = saved;
} catch {}

const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR"
}).format(value);
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
);

function notify(text) { $("message").textContent = text; }
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
function items() {
  return products.filter(p => state.cart[p.id] > 0)
    .map(p => ({ ...p, qty: state.cart[p.id] }));
}
function total() { return items().reduce((sum, p) => sum + p.price * p.qty, 0); }
function badge() {
  $("count").textContent = items().reduce((sum, p) => sum + p.qty, 0);
}
function show(page) {
  if (page === "checkout" && !items().length) page = "cart";
  document.querySelectorAll("main > section").forEach(section => {
    section.hidden = section.id !== page;
  });
  if (page === "cart") renderCart();
  if (page === "checkout") renderCheckout();
  if (page === "orders") renderOrders();
  window.scrollTo(0, 0);
}
function add(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  try { save(); } catch { notify("Browser storage is full."); }
  badge();
  notify("Added to cart.");
}
function change(id, amount) {
  state.cart[id] = Math.max(0, (state.cart[id] || 0) + amount);
  if (!state.cart[id]) delete state.cart[id];
  try { save(); } catch { notify("Browser storage is full."); }
  badge();
  renderCart();
}
function renderCart() {
  $("cartItems").innerHTML = items().length
    ? items().map(p => `
      <div class="row">
        <div><strong>${p.name}</strong><p>${money(p.price)}</p></div>
        <div class="controls">
          <button aria-label="Decrease quantity" onclick="change('${p.id}',-1)">−</button>
          <span>${p.qty}</span>
          <button aria-label="Increase quantity" onclick="change('${p.id}',1)">+</button>
        </div>
      </div>`).join("") +
      `<h2>Total: ${money(total())}</h2>
       <button onclick="show('checkout')">CHECKOUT →</button>`
    : '<p>Your cart is empty.</p><button onclick="show(\'shop\')">SHOP NOW</button>';
}
function renderCheckout() {
  $("summary").innerHTML = items().map(p => `
    <div class="row">
      <span>${p.name} × ${p.qty}</span>
      <strong>${money(p.price * p.qty)}</strong>
    </div>`).join("") +
    `<h2>Total: ${money(total())}</h2>
     <p>Delivery charges and availability require seller confirmation.</p>`;
  const query = new URLSearchParams({
    pa: UPI, pn: "Anime Kingdom", am: total().toFixed(2), cu: "INR"
  });
  $("upiLink").href = "upi://pay?" + query.toString();
}
function paymentMode() {
  const upi = document.querySelector('input[name="payment"]:checked').value === "upi";
  $("upiFields").hidden = !upi;
  ["utr", "screenshot"].forEach(id => {
    $(id).disabled = !upi;
    $(id).required = upi;
  });
  $("submitOrder").textContent = upi
    ? "SAVE ORDER · VERIFICATION PENDING" : "SAVE COD ORDER";
}
async function copyUPI() {
  try {
    await navigator.clipboard.writeText(UPI);
    notify("UPI ID copied.");
  } catch {
    notify("Copy this UPI ID: " + UPI);
  }
}
async function readScreenshot(file) {
  if (!file || !file.size) throw Error("Upload a payment screenshot.");
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 2 * 1024 * 1024) {
    throw Error("Choose a PNG, JPG or WebP image no larger than 2 MB.");
  }
  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(Error("Could not read screenshot."));
    reader.readAsDataURL(file);
  });
  await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = () => reject(Error("Invalid screenshot image."));
    image.src = data;
  });
  return data;
}
$("screenshot").addEventListener("change", async event => {
  const file = event.target.files[0];
  $("preview").hidden = true;
  if (!file) return;
  try {
    const data = await readScreenshot(file);
    if (event.target.files[0] !== file) return;
    $("preview").src = data;
    $("preview").hidden = false;
  } catch (error) {
    event.target.value = "";
    notify(error.message);
  }
});
$("checkoutForm").addEventListener("submit", async event => {
  event.preventDefault();
  if (!items().length || $("submitOrder").disabled) return;
  const form = event.target;
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  const orderItems = items();
  const amount = total();
  $("submitOrder").disabled = true;
  try {
    const screenshot = data.payment === "upi"
      ? await readScreenshot($("screenshot").files[0]) : "";
    const order = {
      id: "AK-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
      date: new Date().toLocaleString(),
      customer: {
        name: data.name, email: data.email, phone: data.phone,
        address: data.address, city: data.city, state: data.state, pin: data.pin
      },
      items: orderItems,
      total: amount,
      method: data.payment,
      utr: data.payment === "upi" ? data.utr : "",
      screenshot,
      status: data.payment === "upi"
        ? "Awaiting manual payment verification"
        : "Cash on Delivery — payment due"
    };
    const next = { cart: {}, orders: [order, ...state.orders] };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      throw Error("Storage is full. Try a smaller screenshot. Order was not saved.");
    }
    state = next;
    form.reset();
    $("preview").hidden = true;
    paymentMode();
    badge();
    show("orders");
    notify("Order saved on this device. Contact the seller to confirm.");
  } catch (error) {
    notify(error.message);
  } finally {
    $("submitOrder").disabled = false;
  }
});
function renderOrders() {
  $("orderList").innerHTML = state.orders.length
    ? state.orders.map(order => `
      <article class="box" style="margin-bottom:20px">
        <h2>${escapeHTML(order.id)}</h2>
        <p>${escapeHTML(order.date)}</p>
        <p>${escapeHTML(order.status)}</p>
        ${order.items.map(p => `
          <div class="row">
            <span>${escapeHTML(p.name)} × ${p.qty}</span>
            <strong>${money(p.price * p.qty)}</strong>
          </div>`).join("")}
        <h3>Total: ${money(order.total)}</h3>
        ${order.utr ? `<p>UTR: ${escapeHTML(order.utr)} — unverified</p>` : ""}
        ${/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(order.screenshot || "")
          ? `<details><summary>View payment screenshot</summary>
             <img src="${order.screenshot}" alt="Payment screenshot"
                  style="max-width:100%;max-height:350px;margin-top:15px">
             </details>` : ""}
      </article>`).join("")
    : "<p>No saved orders yet.</p>";
}
$("products").innerHTML = products.map(p => `
  <article class="card">
    <div class="art" aria-hidden="true">${p.icon}</div>
    <h2>${p.name}</h2>
    <p>Sample collectible listing</p>
    <p class="price">${money(p.price)}</p>
    <button onclick="add('${p.id}')">ADD TO CART</button>
  </article>`).join("");
badge();
</script>
</body>
</html>