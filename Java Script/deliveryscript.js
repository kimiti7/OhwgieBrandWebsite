/* ==========================================================================
   OFFREEK SOCIETY - GLOBAL & CHECKOUT JAVASCRIPT
   ========================================================================== */

// Global Cart State (Stored in Browser LocalStorage so items persist across pages)
let cartState = JSON.parse(localStorage.getItem('offreek_cart')) || [];
let currentDeliveryFee = 0;
let currentFulfillment = "delivery";

document.addEventListener("DOMContentLoaded", function () {
    updateGlobalCartCount();
    
    // Auto-update footer copyright year
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Attach click events to "Add to Cart" buttons across Menu, Gear, and Merch pages
    initAddToCartButtons();

    // Render cart if on cart.html
    if (document.getElementById("cartTableBody")) {
        renderCart();
    }
});

/* =========================================
   1. GLOBAL CART MANAGEMENT
   ========================================= */

function initAddToCartButtons() {
    const addButtons = document.querySelectorAll('.cart-add-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const card = this.closest('.menu-card, .accessory-card, .merch-card');
            if (card) {
                const title = card.querySelector('h2').textContent.trim();
                const priceText = card.querySelector('.menu-price, .merch-price, .card-details p')?.textContent || "KES 0";
                
                // Extract number from price text
                const priceMatch = priceText.match(/\d[\d,]*/);
                const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;

                addToCart(title, price);
            }
        });
    });
}

function addToCart(name, price) {
    const existingIndex = cartState.findIndex(item => item.name === name);
    if (existingIndex > -1) {
        cartState[existingIndex].qty += 1;
    } else {
        cartState.push({ id: Date.now(), name: name, price: price, qty: 1 });
    }
    
    saveCart();
    updateGlobalCartCount();
    
    // Modern sleek toast notification instead of intrusive browser alert
    showCartNotification(`${name} added to cart!`);
}

function saveCart() {
    localStorage.setItem('offreek_cart', JSON.stringify(cartState));
}

function updateGlobalCartCount() {
    const totalItems = cartState.reduce((sum, item) => sum + item.qty, 0);
    
    // Update floating top-right badge
    const badge = document.getElementById('floatingCartBadge');
    if (badge) {
        badge.textContent = totalItems;
    }

    // Update header cart buttons
    const cartButtons = document.querySelectorAll('.header-cart-btn');
    cartButtons.forEach(btn => {
        btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Cart (${totalItems})`;
    });
}

// Non-intrusive Toast Notification Banner
function showCartNotification(message) {
    const existingToast = document.getElementById('cartToast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'cartToast';
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background-color: #000;
        color: #fff;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: fadeIn 0.3s ease-in-out;
    `;
    
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #25D366;"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

/* =========================================
   2. CART PAGE & CHECKOUT LOGIC
   ========================================= */

function renderCart() {
    const tbody = document.getElementById("cartTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (cartState.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-cart-msg">Your cart is currently empty. Visit Menu, Gear, or Merch to add items!</td></tr>';
        calculateTotals(0);
        return;
    }

    let subtotal = 0;
    cartState.forEach((item, index) => {
        const itemSub = item.price * item.qty;
        subtotal += itemSub;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>KES ${item.price.toLocaleString()}</td>
            <td><input type="number" value="${item.qty}" min="1" onchange="updateQty(${index}, this.value)" class="qty-input"></td>
            <td>KES ${itemSub.toLocaleString()}</td>
            <td><button onclick="removeItem(${index})" class="remove-btn">&times;</button></td>
        `;
        tbody.appendChild(tr);
    });

    calculateTotals(subtotal);
}

function updateQty(index, newQty) {
    const parsedQty = parseInt(newQty) || 1;
    cartState[index].qty = parsedQty;
    saveCart();
    updateGlobalCartCount();
    renderCart();
}

function removeItem(index) {
    cartState.splice(index, 1);
    saveCart();
    updateGlobalCartCount();
    renderCart();
}

function toggleFulfillment(type) {
    currentFulfillment = type;
    const deliveryFields = document.getElementById("deliveryFields");
    const deliveryRow = document.getElementById("deliveryFeeRow");

    if (type === "pickup") {
        if (deliveryFields) deliveryFields.style.display = "none";
        if (deliveryRow) deliveryRow.style.display = "none";
        currentDeliveryFee = 0;
    } else {
        if (deliveryFields) deliveryFields.style.display = "block";
        if (deliveryRow) deliveryRow.style.display = "flex";
        updateDeliveryFee();
    }
    renderCart();
}

function updateDeliveryFee() {
    if (currentFulfillment === "pickup") return;

    const kmInput = document.getElementById("distanceKM");
    const km = kmInput ? parseFloat(kmInput.value) : 0;

    if (isNaN(km) || km <= 0) {
        currentDeliveryFee = 0;
    } else if (km <= 3) {
        currentDeliveryFee = 100;
    } else if (km <= 15) {
        currentDeliveryFee = Math.round(100 + (km - 3) * 25);
    } else {
        currentDeliveryFee = Math.round(400 + (km - 15) * 20);
    }
    renderCart();
}

function calculateTotals(subtotal) {
    const subDisplay = document.getElementById("subtotalDisplay");
    const feeDisplay = document.getElementById("deliveryFeeDisplay");
    const grandDisplay = document.getElementById("grandTotalDisplay");

    if (subDisplay) subDisplay.textContent = "KES " + subtotal.toLocaleString();
    if (feeDisplay) feeDisplay.textContent = "KES " + currentDeliveryFee.toLocaleString();
    
    const grandTotal = subtotal + currentDeliveryFee;
    if (grandDisplay) grandDisplay.textContent = "KES " + grandTotal.toLocaleString();
}

function handleCheckout(e) {
    e.preventDefault();
    if (cartState.length === 0) {
        alert("Your cart is empty! Please add items before placing an order.");
        return;
    }

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const notes = document.getElementById("custNotes").value.trim();

    let orderText = "🛒 *NEW ORDER - OFFREEK SOCIETY*\n\n";
    orderText += "*Customer:* " + name + " (" + phone + ")\n";
    orderText += "*Option:* " + (currentFulfillment === "delivery" ? "🚀 Rider Delivery" : "🏪 Store Pickup (Ruiru)") + "\n";

    if (currentFulfillment === "delivery") {
        const loc = document.getElementById("dropLocation").value.trim();
        const km = document.getElementById("distanceKM").value;
        orderText += "*Drop-off:* " + loc + " (~" + km + " KM)\n";
        orderText += "*Delivery Fee:* KES " + currentDeliveryFee + "\n";
    }

    orderText += "\n*ITEMS ORDERED:*\n";
    let subtotal = 0;
    cartState.forEach(item => {
        const itemSub = item.price * item.qty;
        subtotal += itemSub;
        orderText += `• ${item.name} x${item.qty} = KES ${itemSub.toLocaleString()}\n`;
    });

    const grandTotal = subtotal + currentDeliveryFee;
    orderText += "\n*TOTAL DUE:* KES " + grandTotal.toLocaleString() + " (Pay on Delivery)\n";

    if (notes !== "") {
        orderText += "\n*Notes/Conditions:* " + notes + "\n";
    }

    const whatsappUrl = "https://wa.me/254748692188?text=" + encodeURIComponent(orderText);
    window.open(whatsappUrl, "_blank");
}

/* =========================================
   3. FLOATING AI ASSISTANT
   ========================================= */

function toggleChatbot() {
    const chat = document.getElementById("chatbotWindow");
    if (chat) {
        chat.style.display = (chat.style.display === "flex") ? "none" : "flex";
    }
}

function handleKeyPress(e) {
    if (e.key === "Enter") {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById("chatInput");
    if (!input) return;

    const query = input.value.trim();
    if (query !== "") {
        const body = document.getElementById("chatBody");
        
        const userMsg = document.createElement("div");
        userMsg.className = "chat-msg user";
        userMsg.textContent = query;
        body.appendChild(userMsg);
        input.value = "";
        body.scrollTop = body.scrollHeight;

        setTimeout(() => {
            const botMsg = document.createElement("div");
            botMsg.className = "chat-msg bot";
            botMsg.textContent = getAIResponse(query);
            body.appendChild(botMsg);
            body.scrollTop = body.scrollHeight;
        }, 700);
    }
}

function getAIResponse(q) {
    const lower = q.toLowerCase();
    if (lower.includes("delivery") || lower.includes("where") || lower.includes("ruiru")) {
        return "We deliver across Ruiru, Kimbo, KU environs, and Membley daily between 7 AM and 7 PM!";
    } else if (lower.includes("pay") || lower.includes("mpesa") || lower.includes("cost")) {
        return "Payment is strictly upon delivery via M-Pesa or cash.";
    } else if (lower.includes("hour") || lower.includes("time") || lower.includes("open")) {
        return "Our delivery operating hours are from 7:00 AM to 7:00 PM.";
    } else if (lower.includes("cookie") || lower.includes("menu") || lower.includes("food")) {
        return "Check out our Menu page for fresh soft-baked cookies and deluxe fruit bowls!";
    } else {
        return "Thanks for reaching out! You can WhatsApp us directly at +254 748 692 188 for instant support.";
    }
}

/* =========================================
   4. TERMS & CONDITIONS MODAL
   ========================================= */

function toggleTermsModal() {
    const modal = document.getElementById("termsModal");
    if (modal) {
        modal.style.display = (modal.style.display === "flex") ? "none" : "flex";
    }
}

function closeTermsOnOutsideClick(e) {
    if (e.target.id === "termsModal") {
        toggleTermsModal();
    }
}

/* =========================================
   5. INTERACTIVE COMMENTS / REVIEWS
   ========================================= */

function postComment(e) {
    e.preventDefault();
    const authorInput = document.getElementById("commentAuthor");
    const textInput = document.getElementById("commentText");

    if (!authorInput || !textInput) return;

    const author = authorInput.value.trim();
    const text = textInput.value.trim();

    if (author && text) {
        const list = document.getElementById("reviewsList");
        const card = document.createElement("div");
        card.className = "review-card";

        card.innerHTML = `<p>"${text}"</p><span class="reviewer">- ${author}</span>`;

        list.prepend(card);
        document.getElementById("commentForm").reset();
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    alert("Thank you! Your message has been sent successfully.");
    e.target.reset();
}