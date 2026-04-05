import { calculateCartQuantity, cart, removeFromCart, saveToStorage } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js'; // a single . means go back from the current folder

let cartSummaryHTML = '';
let paymentSummaryHTML = '';
let TotalPrice = 0;


cart.forEach((cartItem) => {
  let matchingProduct;

  products.forEach((product) => {
    if (cartItem.productId === product.id) {
      matchingProduct = product;
      TotalPrice += (product.priceCents * cartItem.productQuantity) / 100;
    }
  });

  cartSummaryHTML += `
          <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
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
                  <span>
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">Update</span>
                    <input class="quantity-input-hide js-quantity-input-${matchingProduct.id}" type="text">
                    <div class="link-primary save-link-hide js-save-link-${matchingProduct.id}">Save</div>
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
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
            <div>Items (${calculateCartQuantity() || 0}):</div>
            <div class="payment-summary-money">$${(TotalPrice).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$4.99</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${(TotalPrice).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(TotalPrice * 0.1).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${(TotalPrice * 1.1).toFixed(2)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
`;


document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity() || 0} items`;

document.querySelectorAll(`.js-delete-link`).forEach((link) => {
  link.addEventListener('click', () => {
    const { productId } = link.dataset;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    removeFromCart(productId);
    container.remove();
  });
});

document.querySelectorAll(`.js-update-link`).forEach((link) => {
  link.addEventListener('click', () => {
    const { productId } = link.dataset;

    const quantityInput = document.querySelector('.js-quantity-input-' + productId);
    const saveLink = document.querySelector('.js-save-link-' + productId);

    quantityInput.classList.add('display-quantity-input-and-save-link');
    saveLink.classList.add('display-quantity-input-and-save-link');

    quantityInput.focus();
    saveLink.addEventListener('click', () => {
      updateCart(productId,quantityInput);
      quantityInput.classList.remove('display-quantity-input-and-save-link');
      saveLink.classList.remove('display-quantity-input-and-save-link');
      location.reload();
    });

    quantityInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        updateCart(productId, quantityInput);
        quantityInput.classList.remove('display-quantity-input-and-save-link');
        saveLink.classList.remove('display-quantity-input-and-save-link');
        location.reload();
      }
    });

  });

});

function updateCart(productId,quantityInput) {
      const quantityInputValue = parseInt(quantityInput.value);

      cart.forEach((cartItem) => {
        if (cartItem.productId === productId)
          if (quantityInputValue > 0 && quantityInputValue <= 99) {
            cartItem.productQuantity = quantityInputValue;
            saveToStorage();
          }
      });
}