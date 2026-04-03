export const cart = []; // export means we can use this variable in other files, and we can import it in other files.

export function addToCart(productId){
    let matchingItem;
    let productQuantity = parseInt(document.querySelector(`.js-quantity-selector-${productId}`).value);

    cart.forEach((cartItem) =>{
        if(cartItem.productId === productId){
            matchingItem = cartItem;
        }
    });
    if(matchingItem){
        matchingItem.productQuantity += productQuantity;
    }
    else{
    cart.push({
        productId, //productId: productId
        productQuantity // productQuantity: productQuantity
    });
    }
}
