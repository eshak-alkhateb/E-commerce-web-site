import {cart,addToCart,calculateCartQuantity} from '../data/cart.js'; // .. means go back one folder, then go to data folder and get cart.js file, and import the variable cart from that file. We can use this variable in this file now.
import {products} from '../data/products.js';
import { formatCurrency } from './utils/money.js';
// import has another syntax, import * as cartModule from '../data/cart.js'; // imports everyting from a file and group it into an object , then we can access the variable cart using cartModule.cart, and the function addToCart using cartModule.addToCart. This is useful when we want to import many variables and functions from a file, so we don't have to write them all in the import statement.

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
                ${formatCurrency(product.priceCents)}
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

// we won't move the function addToCart to this file, because we want to keep the data and the logic of manipulating the data in the same file, which is cart.js file, and we want to keep the code that generates the HTML and makes it interactive in this file, which is arnab.js file. This way we can keep our code organized and easier to maintain.
function updateCartQuantity(){
    let cartQuantity = calculateCartQuantity();

    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

function addedToCartMessage(productId){
    let addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

    addedMessage.classList.add('added-to-cart-show');

    clearTimeout(timeOutIds[productId]); // remove the timeout if the user clicks the add to cart button multiple times quickly, so that the message will stay for 2 seconds after the last click.( يلغي التايمر القديم ويبدأ تايمر جديد).

    timeOutIds[productId] = setTimeout(() =>{
            addedMessage.classList.remove('added-to-cart-show');

        },2000);
}

document.querySelectorAll('.js-add-to-cart').forEach((button) =>{
    button.addEventListener('click', () => {
        const {productId} = button.dataset;// const productId = button.dataset.productId; // special attribute in HTML to store data, we can access it using dataset in JavaScript

        addToCart(productId);
        updateCartQuantity();
        addedToCartMessage(productId);

    });
});

updateCartQuantity();

/*
    Main idea of JavaScript:
    1. save the data
    2. generate the HTML
    3. Make it interactive
*/