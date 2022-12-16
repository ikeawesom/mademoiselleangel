import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import {getDatabase, set, get, update, remove, ref, child} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDsZ_OiNSr_TZKv5bEDeVmeewqqzMnPGt8",
    authDomain: "mademoiselle-ecommerce-724ce.firebaseapp.com",
    databaseURL: "https://mademoiselle-ecommerce-724ce-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mademoiselle-ecommerce-724ce",
    storageBucket: "mademoiselle-ecommerce-724ce.appspot.com",
    messagingSenderId: "218324369791",
    appId: "1:218324369791:web:068a52ce9a97dc0bb5da4a",
    measurementId: "G-0CN8EW3Q4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const productDB = getDatabase();
const curPage = window.location.pathname;
// for future use
function addProducts(item) { // item[] -> {ID, Name, Desc, Prices}
    set(ref(productDB, "Products/" + item[0]), {
        Name: item[1],
        Desc: item[2],
        Prices: item[3]
    })
    .then(()=>{
        alert("Product added successfully!")
    })
    .catch((error) => {
        alert(`ERROR: ${error}`);
    })   
}

// Firebase processes in main page
if (curPage.includes("index.html")) {
    // Initialise banner elements
    const itemBG = document.querySelector("#item");
    const itemContainer = itemBG.querySelector(".item-container");
    const itemBanner = itemBG.querySelector(".popup");
    const itemTitle = itemBanner.querySelector(".block-text h3");
    const itemDesc = itemBanner.querySelector(".block-text p");
    const itemPrices = itemBanner.querySelector(".block-quantity select");
    const itemCancel = itemBanner.querySelector(".block-buttons .cancel");
    const itemX = itemBanner.querySelector(".close");
    const itemImage = itemBanner.querySelector(".block-popup .img-container");

    // Initialise cart popup elements
    const cartPopup = document.querySelector("#popup-cart");

    // Hides banner
    function hideItemBanner (node) {
        // Animations to hide banner
        itemContainer.style.animation = "fade-out 400ms forwards";
        itemBanner.style.animation = "itemSlideOut 800ms forwards, fade-out 1000ms forwards";
        setTimeout(() => {
            itemBG.style.visibility = "hidden";
        }, 500);

        // Clear click events of order button
        node.replaceWith(node.cloneNode(true));
    }

    // Show add to cart popup
    function showCartPopup () {
        // Animations to show popup
        cartPopup.style.visibility = "visible";
        cartPopup.style.animation = "fade-in 400ms forwards";
        setTimeout(() => {
            cartPopup.style.animation = "fade-out 1000ms forwards";
            setTimeout(() => {
                cartPopup.style.visibility = "hidden";
            }, 5000);
        }, 3500); // Timeout to delay hiding of popup
    }

    // Add to cart
    function addToCart(title, quantity) {
        // console.log(`Title:${title}, Quantity: ${quantity}`);
        const tempArrA = quantity.split(" - ");
        console.log(tempArrA);
        var cartCount = parseInt(localStorage.getItem("cartCount"));
        localStorage.setItem("cartCount",cartCount+1);

        var cartItems = JSON.parse(localStorage.getItem("cartItems"));

        if (title in cartItems) {
            var curArr = cartItems[title];
            curArr.push(tempArrA);
            cartItems[title] = curArr;
        } else {
            var tempArr = [];
            tempArr.push(tempArrA);        
            cartItems[title] = tempArr;
        }

        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        // console.log("Logged from firebase.js")
        // console.log(localStorage.getItem("cartCount"));
        // console.log(JSON.parse(localStorage.getItem("cartItems")));
    }   

    // Display product details in #items banner
    function getProducts(title) {

        // Adds animations to item banner
        itemBG.style.visibility = "visible";
        itemContainer.style.animation = "fade-in 400ms forwards";
        itemBanner.style.animation = "itemSlideIn 800ms forwards, fade-in 1000ms forwards";

        // Initialise DB from firebase
        const dbref = ref(productDB);

        get(child(dbref, `Products/${title}`))
        .then((snapshot) => {
            // Assigns detail to respective element
            const title_ = snapshot.val()["Title"];
            itemTitle.innerHTML = title_;
            itemDesc.innerHTML = snapshot.val()["Desc"];

            // Create filename based on title
            const filename = title_.split(" ").join("-");
            const filepath = `../resources/product-${filename}-1.png`;
            itemImage.style.backgroundImage = `url(${filepath}`;

            // Add options to quantity selection
            const options = snapshot.val()["Prices"].split(";");
                options.forEach((price) => {
                    const option = document.createElement("option");
                    option.innerHTML = price;
                    option.value = price;
                    itemPrices.appendChild(option);
                })

            // Cart
            const itemAddCart = itemBanner.querySelector(".order");
            itemAddCart.addEventListener('click', function() {
                showCartPopup();
                addToCart(title, itemPrices.value, itemAddCart);
            });

            // Handle exit banner events
            itemCancel.addEventListener('click', function() {
                hideItemBanner(itemAddCart);
            });

            itemX.addEventListener('click', function() {
                hideItemBanner(itemAddCart);
            });

        })
        .catch((error) => {
            alert(`ERROR: ${error}`);
        }) 

    }

    // Add link for each ".continue" button
    const productList = document.querySelectorAll("#products .product-details");

    productList.forEach((html) => {
        const title = html.querySelector("h3").innerHTML;
        const continue_button = html.querySelector(".continue");
        
        continue_button.addEventListener('click', () => {
            
            itemPrices.innerHTML = "";
            getProducts(title);
        })
    })

    // Add link for POPULAR product order button
    const orderNowButton = document.querySelector("#banner .order");
    orderNowButton.addEventListener('click', ()=> {
        itemPrices.innerHTML = "";
        getProducts("French Financiers"); // featured product name
    });


}

// Firebase processes in cart page
else if (curPage.includes("cart.html")) {
    //
}
