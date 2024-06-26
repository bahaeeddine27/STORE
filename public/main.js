// Cart Open Close
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#close-cart");

// Open Cart
cartIcon.onclick = () => {
    cart.classList.add('active');
};

// Close Cart
closeCart.onclick = () => {
    cart.classList.remove('active');
};

// Add Cart
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    // Clear cart on initial load
    if (!localStorage.getItem("cartItems")) {
        localStorage.setItem("cartItems", JSON.stringify([]));
    }

    // Remove Item From Cart
    const removeCartButtons = document.getElementsByClassName("cart-remove");
    for (let i = 0; i < removeCartButtons.length; i++) {
        const button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }

    // Quantity Change
    const quantityInputs = document.getElementsByClassName("cart-quantity");
    for (let i = 0; i < quantityInputs.length; i++) {
        const input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    // Add to Cart
    const addCartButtons = document.getElementsByClassName("add-cart");
    for (let i = 0; i < addCartButtons.length; i++) {
        const button = addCartButtons[i];
        button.addEventListener("click", addCartClicked);
    }

    // Load cart from localStorage
    loadCartFromLocalStorage();

    // Update total initially in case there are already items in the cart
    updateTotal();
}

function addCartClicked(event) {
    const button = event.target;
    const shopItem = button.parentElement;
    const title = shopItem.getElementsByClassName("product-title")[0].innerText;
    const price = shopItem.getElementsByClassName("price")[0].innerText;
    const imageSrc = shopItem.getElementsByClassName("product-img")[0].src;
    addItemToCart(title, price, imageSrc);
    updateTotal();
    saveCartToLocalStorage();
}

function addItemToCart(title, price, imageSrc) {
    const cartContent = document.querySelector(".cart-content");
    const cartBoxNames = cartContent.getElementsByClassName("cart-product-title");
    for (let i = 0; i < cartBoxNames.length; i++) {
        if (cartBoxNames[i].innerText === title) {
            alert("This item is already added to the cart");
            return;
        }
    }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    const cartBoxContent = `
        <img src="${imageSrc}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class="bx bx-trash-alt cart-remove"></i>
    `;
    cartBox.innerHTML = cartBoxContent;
    cartContent.appendChild(cartBox);

    cartBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
    cartBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);
    saveCartToLocalStorage();
}

// Remove Cart Item
function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartToLocalStorage();
}

// Quantity Change
function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartToLocalStorage();
}

// Update Total
function updateTotal() {
    const cartContent = document.querySelector(".cart-content");
    const cartBoxes = cartContent.getElementsByClassName("cart-box");
    let total = 0;

    for (let i = 0; i < cartBoxes.length; i++) {
        const cartBox = cartBoxes[i];
        const priceElement = cartBox.getElementsByClassName("cart-price")[0];
        const quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        const price = parseFloat(priceElement.innerText.replace("€", ""));
        const quantity = parseInt(quantityElement.value);
        total += price * quantity;
    }

    document.querySelector(".total .total-title:last-child").innerText = total.toFixed(2) + "€";
}

// Save Cart to Local Storage
function saveCartToLocalStorage() {
    const cartContent = document.querySelector(".cart-content");
    const cartBoxes = cartContent.getElementsByClassName("cart-box");
    const cartItems = [];

    for (let i = 0; i < cartBoxes.length; i++) {
        const cartBox = cartBoxes[i];
        const title = cartBox.getElementsByClassName("cart-product-title")[0].innerText;
        const price = cartBox.getElementsByClassName("cart-price")[0].innerText;
        const imageSrc = cartBox.getElementsByClassName("cart-img")[0].src;
        const quantity = cartBox.getElementsByClassName("cart-quantity")[0].value;
        cartItems.push({ title, price, imageSrc, quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Load Cart from Local Storage
function loadCartFromLocalStorage() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    for (const item of cartItems) {
        addItemToCart(item.title, item.price, item.imageSrc);
        const cartContent = document.querySelector(".cart-content");
        const cartBoxes = cartContent.getElementsByClassName("cart-box");
        const lastCartBox = cartBoxes[cartBoxes.length - 1];
        lastCartBox.getElementsByClassName("cart-quantity")[0].value = item.quantity;
    }
}
// Clear Cart Item After Successful Payment
function clearCart() {
    var cartContent = document.getElementsByClassName("cart-content")[0];
    cartContent.innerHTML = "";
    updateTotal();
    localStorage.removeItem("cartItems");
}
