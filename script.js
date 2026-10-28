
const products = [
    {
        id: 1,
        name: "Pandesal",
        price: 8,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Chocolate Donut",
        price: 15,
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Croissant",
        price: 35,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Blueberry Muffin",
        price: 40,
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Cinnamon Roll",
        price: 45,
        image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Cheese Bread",
        price: 12,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Chocolate Cake",
        price: 60,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Cookies",
        price: 20,
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80"
    }
];

let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("kanaBakeryCart")
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(function(item) {
            return products.some(function(product) {
                return product.id === item.id;
            }) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0;
        }).map(function(item) {
            const product = products.find(function(product) {
                return product.id === item.id;
            });

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            };
        });
    }
} catch (error) {
    cart = [];
}

function saveCart() {
    localStorage.setItem("kanaBakeryCart", JSON.stringify(cart));
}

function displayProducts() {
    const productList = document.getElementById("product-list");

    if (!productList) {
        return;
    }

    productList.innerHTML = "";

    products.forEach(function(product) {
        productList.innerHTML += `
            <article class="product-card">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400/f4e8d9/422719?text=Kana+Bakery';"
                >

                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>₱${product.price.toFixed(2)} / pc</p>

                    <button
                        class="add-button"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>
                </div>
            </article>
        `;
    });
}

function addToCart(productId) {
    const product = products.find(function(item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    const cartItem = cart.find(function(item) {
        return item.id === productId;
    });

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    displayCart();
}

function changeQuantity(productId, amount) {
    const item = cart.find(function(item) {
        return item.id === productId;
    });

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(function(item) {
            return item.id !== productId;
        });
    }

    saveCart();
    displayCart();
}

function displayCart() {
    const cartItems = document.getElementById("cart-items");

    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty. Let\'s get some bread!</p>';
    }

    cart.forEach(function(item) {
        const subtotal = item.price * item.quantity;

        totalItems += item.quantity;
        totalPrice += subtotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>₱${item.price.toFixed(2)} each</p>
                    <p>Subtotal: ₱${subtotal.toFixed(2)}</p>
                </div>

                <div class="quantity-controls">
                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                        aria-label="Decrease ${item.name}"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                        aria-label="Increase ${item.name}"
                    >+</button>
                </div>
            </div>
        `;
    });

    document.getElementById("cart-count").textContent = totalItems;
    document.getElementById("total-items").textContent = totalItems;

    document.getElementById("total-price").textContent =
        "₱" + totalPrice.toFixed(2);

    document.getElementById("checkout-button").disabled =
        cart.length === 0;
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let summary = "YOUR Daily Dough ORDER\n\n";
    let total = 0;

    cart.forEach(function(item) {
        const subtotal = item.price * item.quantity;

        summary += item.name + " x " + item.quantity +
            " = ₱" + subtotal.toFixed(2) + "\n";

        total += subtotal;
    });

    summary += "\nTOTAL: ₱" + total.toFixed(2);
    summary += "\n\nThis is a demo checkout. No order has been submitted.";

    alert(summary);
}

displayProducts();
displayCart();
