console.log("Connected Stripe.js")
import {} from "https://js.stripe.com/v3/";

const apiKey_test = "pk_test_51MGGUDAq9xuLz7CjcnciRFJDwiys022apQvKFsJbpln9Zr7ufFYVC1vrDIqbxCaCjskheT5JK4xcSa7JkSLyN8Mf00yVNue4TG"
const apiKey = "pk_live_51MGGUDAq9xuLz7CjxQzFdeC6WlNCNG48N9MoAf6r7Laj33njvGIkSSnh0E4vYe8DYriKSrSBu7SDfgAgRMqc2E1k00ZyEDyjch";
// process.env.PAGES_API_KEY;

var stripe = Stripe (apiKey);

const cartItems = JSON.parse(localStorage.getItem("cartItems"));
// console.log(cartItems);

const itemPrice = {
    "french financiers;4 pcs/pack":"price_1MGGkkAq9xuLz7CjiEVOaXpB",
    "french financiers;8 pcs/box":"price_1MGIuhAq9xuLz7CjbiTxrCnP",
    "french financiers;12 pcs/box":"price_1MGIvdAq9xuLz7Cj2eJ51iu5",
    "chocolate cookies;3 pcs/box":"price_1MGIt8Aq9xuLz7CjiCQ7ZI1Q",
    "pineapple rose buds;8 pcs/can":"price_1MIEASAq9xuLz7CjArTfYPSJ",
    "pineapple rose buds;12 pcs/can":"price_1MIEC9Aq9xuLz7CjkPpKcaRD",
    "pineapple rose buds;16 pcs/can":"price_1MIED2Aq9xuLz7CjhV4VfhVZ",
    "palet bretons;3 pcs/pack":"price_1MGIzLAq9xuLz7CjhYd6b3mx",
    "italian almond cake;1 whole cake":"price_1MGIt3Aq9xuLz7CjOgJ7YrzR"
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
