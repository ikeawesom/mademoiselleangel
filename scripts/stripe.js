window.href = "https://mademoiselleangel.herokuapp.com/";
console.log("Connected Stripe.js")
import {} from "https://js.stripe.com/v3/";

const apiKey_test = API_TEST_KEY
const apiKey = API_KEY

var stripe = Stripe (apiKey);

const cartItems = JSON.parse(localStorage.getItem("cartItems"));
// console.log(cartItems);

const itemPrice = {
    "french financiers;4 pcs/pack":"",
    "french financiers;8 pcs/box":"",
    "french financiers;12 pcs/box":"",
    "chocolate cookies;3 pcs/box":"",
    "pineapple rose buds;8 pcs/can":"",
    "pineapple rose buds;12 pcs/can":"",
    "pineapple rose buds;16 pcs/can":"",
    "palet bretons;3 pcs/pack":"",
    "italian almond cake;1 whole cake":""
}

var cartArr = []

for (const [key, value] of Object.entries(cartItems)) {
    const keyID = key.split(" - ")[0].toLowerCase();
    const quantity = value[0];
    const tempProd = {
        price: itemPrice[keyID],
        quantity: quantity
    };
    cartArr.push(tempProd);
}

// console.log(cartArr)

// Checkout queries
var method = "";
const checkoutButton = document.querySelector("#checkout-button");
const paynow = document.querySelector("#paynow");
const credit = document.querySelector("#credit");

paynow.addEventListener('click',()=>{
    paynow.style.opacity = "1";
    credit.style.opacity = "0.3";
    method = "paynow";
    checkoutButton.classList.remove("inactive");
})

credit.addEventListener('click',()=>{
    credit.style.opacity = "1";
    paynow.style.opacity = "0.3";
    method = "credit";
    checkoutButton.classList.remove("inactive");

});

checkoutButton.addEventListener('click',function() {
    if (method == "") {
        alert("Please select a payment method.");
    } else {
        localStorage.setItem("fromCart", "cart");
        const loadingIcon = document.querySelector(".loading-icon");
        const continueIcon = document.querySelector(".continue-icon");
        loadingIcon.style.display = "block";
        continueIcon.style.display = "none";
        if (method == 'credit') {
            localStorage.setItem("paynow","false");
            toStripe();
        } else if (method == 'paynow') {
            localStorage.setItem("paynow","true");
            window.location.href = "/paynow.html";
        }
    }
})

function toStripe() {    
    stripe.redirectToCheckout({
        lineItems: cartArr,
        mode: "payment",
        successUrl: "https://mademoiselleangel.netlify.app/success",
        cancelUrl: "https://mademoiselleangel.netlify.app/cart",
        // shippingAddressCollection: {
        //     allowedCountries: ['SG']
        // },
        billingAddressCollection: 'required',
    }).then(function(result){
        alert(result);
    });
}
