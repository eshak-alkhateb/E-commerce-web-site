export let cart = JSON.parse(localStorage.getItem('cart')) ||
    []; // export means we can use this variable in other files, and we can import it in other files. 

export function addToCart(productId) {
    let matchingItem;
    let productQuantity = parseInt(document.querySelector(`.js-quantity-selector-${productId}`).value);

    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            matchingItem = cartItem;
        }
    });
    if (matchingItem) {
        matchingItem.productQuantity += productQuantity;
    }
    else {
        cart.push({
            productId, //productId: productId
            productQuantity // productQuantity: productQuantity
        });
    }
    saveToStorage();
    //localStorage.clear();
}

export function removeFromCart(productId) {
    const cartItem = cart.find(item => item.productId === productId);

    if (cartItem.productQuantity > 1) {
        cartItem.productQuantity -= 1;
    }
    else {
        cart = cart.filter((item) => {
            return item.productId !== productId;
        })
    }

    saveToStorage();
    location.reload();
}

export function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
