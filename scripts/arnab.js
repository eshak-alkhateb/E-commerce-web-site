import {cart} from '../data/cart.js'; // .. means go back one folder, then go to data folder and get cart.js file, and import the variable cart from that file. We can use this variable in this file now.
import {products} from '../data/products.js';
let productsHTML = '';
let timeOutIds = {};

products.forEach((product) => {
    productsHTML += `
        <div class="product-container">
            <div class="product-image-container">
            <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
                ${product.name}
            </div>

            <div class="product-rating-container">
            <img class="product-rating-stars"
                src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
                ${product.rating.count}
            </div>
            </div>

            <div class="product-price">
                ${(product.priceCents / 100).toFixed(2)}
            </div>

            <div class="product-quantity-container">
            <select class='js-quantity-selector-${product.id}'>
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            </div>

            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
            Add to Cart
            </button>
        </div>
    `;
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;

document.querySelectorAll('.js-add-to-cart').forEach((button) =>{
    button.addEventListener('click', () => {
        const {productId} = button.dataset;// special attribute in HTML to store data, we can access it using dataset in JavaScript

        let matchingItem;
        let cartQuantity = 0;
        let productQuantity = parseInt(document.querySelector(`.js-quantity-selector-${productId}`).value);
        let addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

        cart.forEach((item) =>{
            if(item.productId === productId){
                matchingItem = item;
            }
        });
        if(matchingItem){
            matchingItem.quantity += productQuantity;
        }
        else{
        cart.push({
            productId, //productId: productId
            quantity: productQuantity
        });
        }
        cart.forEach((item) => {
            cartQuantity += item.quantity;
        });
        document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

        addedMessage.classList.add('added-to-cart-show');

        clearTimeout(timeOutIds[productId]);
        timeOutIds[productId] = setTimeout(() =>{
                addedMessage.classList.remove('added-to-cart-show');

            },2000);

    });
});
/*
    Main idea of JavaScript:
    1. save the data
    2. generate the HTML
    3. Make it interactive
*/