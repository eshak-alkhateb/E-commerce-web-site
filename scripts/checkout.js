import { calculateCartQuantity, cart, removeFromCart, saveToStorage, updateDeliveryOption } from '../data/cart.js';
import products from '../data/products.js';
import formatCurrency from './utils/money.js'; // a single . means go back from the current folder
import dayjs from 'https://cdn.jsdelivr.net/npm/dayjs@1.11.20/+esm';
import { deliveryOptions } from '../data/deliveryOptions.js';

function renderOrderSummary() {
    let cartSummaryHTML = '';
    let TotalPrice = 0;

    cart.forEach((cartItem) => {
      let matchingProduct;

      products.forEach((product) => {
        if (cartItem.productId === product.id) {
          matchingProduct = product;
          TotalPrice += (product.priceCents * cartItem.productQuantity) / 100;
        }
      });

      /////////////////delivery option
    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

  /////////////////delivery option
    cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
              <div class="delivery-date">
                Delivery date: ${dateString}
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
                      <span class="link-primary js-update-link" data-product-id="${matchingProduct.id}">Update</span>
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
                ${deliveryOptionsHTML(matchingProduct,cartItem)}
                </div>
              </div>
            </div>
  `;
  });

  /////////////////delivery option
  function deliveryOptionsHTML(matchingProduct,cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption)=>{
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
      const dateString = deliveryDate.format('dddd, MMMM D');
      const priceString = deliveryOption.priceCents === 0 
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html +=
      `
      <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
        ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
      `;
    });
    return html;
  }

  let paymentSummaryHTML = '';

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
      removeFromCart(productId);
      renderOrderSummary();
    });
  });

  document.querySelectorAll(`.js-update-link`).forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;

      const quantityInput = document.querySelector('.js-quantity-input-' + productId);
      const saveLink = document.querySelector('.js-save-link-' + productId);

      quantityInput.classList.add('is-editing');
      saveLink.classList.add('is-editing');
      document.querySelector(`.js-update-link`).classList.add('update-quantity-hide');

      quantityInput.focus();
      
      saveLink.addEventListener('click', () => {
        updateQuantity(productId,quantityInput);
        renderOrderSummary();
      });

      quantityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          updateQuantity(productId, quantityInput);
          renderOrderSummary();
        }
      });

    });

  });

  function updateQuantity(productId,quantityInput) {
        const quantityInputValue = parseInt(quantityInput.value);

        const cartItem = cart.find((item) => item.productId === productId);

          if (quantityInputValue > 0 && quantityInputValue <= 1000) {
            cartItem.productQuantity = quantityInputValue;
            saveToStorage();
          }
          else if(quantityInputValue === 0){
            cartItem.productQuantity = quantityInputValue;
            removeFromCart(productId);
          }

        quantityInput.classList.remove('is-editing');
        document.querySelector('.js-save-link-' + productId).classList.remove('is-editing');
        document.querySelector('.js-update-link').classList.remove('update-quantity-hide');
        
  }

  /////////////////delivery option
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
    });
  });
}
renderOrderSummary();