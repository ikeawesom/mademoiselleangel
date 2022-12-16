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

const itemBG = document.querySelector("#item");
const itemContainer = itemBG.querySelector(".item-container");
const itemBanner = itemBG.querySelector(".popup");
const itemTitle = itemBanner.querySelector(".block-text h3");
const itemDesc = itemBanner.querySelector(".block-text p");
const itemPrices = itemBanner.querySelector(".block-quantity select");
const itemCancel = itemBanner.querySelector(".block-buttons .cancel");

itemCancel.addEventListener('click', ()=>{
    itemContainer.style.animation = "fade-out 400ms forwards";
    itemBanner.style.animation = "itemSlideOut 800ms forwards, fade-out 1000ms forwards";
    setTimeout(() => {
        itemBG.style.visibility = "hidden";
    }, 500);
});

function getProducts(title) {
    itemBG.style.visibility = "visible";
    itemContainer.style.animation = "fade-in 400ms forwards";
    itemBanner.style.animation = "itemSlideIn 800ms forwards, fade-in 1000ms forwards";
    const dbref = ref(productDB);

    get(child(dbref, `Products/${title}`))
    .then((snapshot) => {
        itemTitle.innerHTML = snapshot.val()["Title"];
        itemDesc.innerHTML = snapshot.val()["Desc"];
        const options = snapshot.val()["Prices"].split(";");
            options.forEach((price) => {
            console.log(price);
            const option = document.createElement("option");
            option.innerHTML = price;
            itemPrices.appendChild(option);
        })
        // console.log(typeof options);        
    })
    .catch((error) => {
        alert(`ERROR: ${error}`);
    }) 

}

const productList = document.querySelectorAll("#products .product-details");

productList.forEach((html) => {
    const title = html.querySelector("h3").innerHTML;
    const button = html.querySelector(".continue");
    
    button.addEventListener('click', () => {
        itemPrices.innerHTML = "";
        getProducts(title);
    })
})

const orderNowButton = document.querySelector("#banner .order");
orderNowButton.addEventListener('click', ()=> {
    itemPrices.innerHTML = "";
    getProducts("French Financiers");
});