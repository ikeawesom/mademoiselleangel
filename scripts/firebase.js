import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import {getDatabase, set, get, update, remove, ref, child} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

console.log("Entered firebase.js");

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

const DB = getDatabase();
const curPage = window.location.pathname;
// for future use
function addProducts(item) { // item[] -> {ID, Name, Desc, Prices}
    set(ref(DB, "Products/" + item[0]), {
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
if (!curPage.includes("/cart")) {
    // Initialise banner elements
    const itemBG = document.querySelector("#item");
    const itemContainer = itemBG.querySelector(".item-container");
    const itemBanner = itemBG.querySelector(".popup");
    const itemTitle = itemBanner.querySelector(".block-text h3");
    const itemDesc = itemBanner.querySelector(".block-text p");
    const itemPrices = itemBanner.querySelector(".block-quantity select");
    const itemQuantity = itemBanner.querySelector(".block-quantity input");
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
    function addToCart(title, pack, quantity) {
        // console.log(`${title} ${pack} ${quantity}`);
        const packet = pack;
        const price = parseInt(pack.split(" - ")[1].substring(1));
        const storeName = `${title};${packet}`;
        const quantityPriceArr = [parseInt(quantity), price];

        // console.log(storeName);
        // console.log(quantityPriceArr)
        
        // For future use
        // var cartCount = parseInt(localStorage.getItem("cartCount"));
        // localStorage.setItem("cartCount",cartCount+1);

        var cartItems = JSON.parse(localStorage.getItem("cartItems"));

        if (storeName in cartItems) {
            var currQuantityPriceArr = cartItems[storeName];
            var currQuantity = parseInt(currQuantityPriceArr[0]);
            currQuantity += parseInt(quantity);
            
            currQuantityPriceArr[0] = currQuantity;
            cartItems[storeName] = currQuantityPriceArr;
        } else {
            cartItems[storeName] = quantityPriceArr;
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
        const dbref = ref(DB);

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
                addToCart(title, itemPrices.value, itemQuantity.value);
                showCartPopup();
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
            itemQuantity.value = 1;
            getProducts(title);
        })
    })

    // Add link for POPULAR product order button
    const orderNowButton = document.querySelector("#banner .order");
    orderNowButton.addEventListener('click', ()=> {
        itemPrices.innerHTML = "";
        itemQuantity.value = 1;
        getProducts("French Financiers"); // featured product name
    });
}

// Newsletter functionality
function ValidateEmail(input) {
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (input.match(validRegex)) {return true;}
    else {return false;}
}
const newsLetterButton = document.querySelector("#footer #newsletter .continue");
const emailAddress = document.querySelector("#footer #newsletter .email");
const feedback = document.querySelector("#newsletter .block-text .feedback");


function addNewsLetter(input, user) {
    set(ref(DB,`Newsletter/${input}`), {
        mail: true
    }).then(()=>{
        feedback.innerHTML = `${user} has been added to our mailing list!`;
        feedback.classList.add("active");      
        setTimeout(() => {
            feedback.classList.remove("active");
        }, 2000);       
    }).catch((error) => {
        alert(error);
    });
}

newsLetterButton.addEventListener('click',function() {
    const inputted = emailAddress.value;
    if (ValidateEmail(inputted)) {
        var email = "";

        const prefix_split = inputted.split("@")
        const prefix = prefix_split[0];
        email += prefix + "-";

        const domain_split = prefix_split[1].split(".");
        
        domain_split.forEach((name) => {
            email += name + "_";
        })

        const trimmed = email.substring(0, email.length-1);
       
        addNewsLetter(trimmed, inputted);
    } else {
        feedback.innerHTML = "Please enter a valid email!";
        feedback.classList.add("invalid");
    
        setTimeout(() => {
            feedback.classList.remove("invalid");
        }, 2000);
    }
})
