import {cart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js'; // a single . means go back from the current folder
let cartSummaryHTML = '';
let paymentSummaryHTML = '';
let itemsTotalPrice = 0;
let TotalItems = 0;


cart.forEach((cartItem) => {
let matchingProduct;

products.forEach((product) => {
    if(cartItem.productId === product.id){
        matchingProduct = product;
        itemsTotalPrice += (product.priceCents * cartItem.productQuantity) / 100;
        TotalItems += cartItem.productQuantity;
    }
});

cartSummaryHTML += `
          <div class="cart-item-container">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.productQuantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-button" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
`;
});

paymentSummaryHTML = `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${TotalItems}):</div>
            <div class="payment-summary-money">$${(itemsTotalPrice).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$4.99</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${(itemsTotalPrice).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(itemsTotalPrice * 0.1).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${(itemsTotalPrice * 1.1).toFixed(2)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
`;

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
document.querySelector('.js-return-to-home-link').innerHTML = `${TotalItems} items`;

document.querySelectorAll(`.js-delete-button`).forEach((deleteButton,index) => {
    deleteButton.addEventListener('click', () => {
        const productId = deleteButton.dataset.productId;

        if(cart[index].productQuantity > 1)
          cart[index].productQuantity--;
        else
          cart.splice(index, 1);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload();
        });

    });




