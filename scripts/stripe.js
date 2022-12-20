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
    "rose pineapple tarts;8 pcs/can":"price_1MGIxuAq9xuLz7Cj5kexy0sr",
    "rose pineapple tarts;12 pcs/can":"price_1MGIyHAq9xuLz7CjwEW9RpNi",
    "rose pineapple tarts;16 pcs/can":"price_1MGIydAq9xuLz7Cjj8apsQbO",
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

const checkoutButton = document.querySelector("#checkout-button");

checkoutButton.addEventListener("click", () => {
    localStorage.setItem("fromCart", "cart");
    
    stripe.redirectToCheckout({
        lineItems: cartArr,
        mode: "payment",
        successUrl: "https://mademoiselleangel.github.io/success",
        cancelUrl: "https://mademoiselleangel.github.io/cart",
        shippingAddressCollection: {
            allowedCountries: ['SG']
        },
        billingAddressCollection: 'required',
    }).then(function(result){
        alert(result);
    });
})
