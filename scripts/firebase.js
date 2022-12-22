import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import {getDatabase, set, get, onValue, update, remove, ref, child} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

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
const auth = getAuth(app);

const admin_username = "admin@mademoiselle.com";
const admin_pass = "password123"
// createUserWithEmailAndPassword(auth,admin_username,admin_pass)
// .then(function() {
//     var user = auth.currentUser;
//     console.log("Admin created");

//     var user_data = {
//         username: admin_username,
//     };
//     set(ref(DB,"Users/"+user.uid), user_data)
//     .then(function(){
//         console.log("Added to DB");
//     })
//     .catch((error) => {
//         console.log(error);
//     })
// }).catch((error) => {
//     console.log("ERROR:"+error);
// })
// signInWithEmailAndPassword(auth, admin_username, admin_pass)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });

// Initialise DB from firebase
const DB = getDatabase();
const dbref = ref(DB);

const curPage = window.location.pathname;

// helper functions
function ValidateEmail(input) {
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (input.match(validRegex)) {return true;}
    else {return false;}
}

function resetSession() {
    sessionStorage.clear();
    alert("You will be logged out");
    window.location.href = "/";
}

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
if (!curPage.includes("/cart") && !curPage.includes("/paynow") && !curPage.includes("/success") && !curPage.includes("/admin/login") && !curPage.includes("/admin/dashboard")) {
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
else if (curPage.includes("/paynow")) {

    const agreement = document.querySelector("#agree-received");
    const buttonPay = document.querySelector("#pay-button");
    agreement.addEventListener('click',()=>{
        if (agreement.checked) {
            buttonPay.classList.remove("inactive");
            buttonPay.addEventListener('click',validatePaynow);
        } else {
            buttonPay.classList.add("inactive");
            buttonPay.removeEventListener('click',validatePaynow);
        }
    });

    function validatePaynow() {
        var emailcorrect = false;
        var idcorrect = false;

        const emailInput = document.querySelector("#input-email");
        const cfmEmailInput = document.querySelector("#input-email-cfm");
        const paynowInput = document.querySelector("#paynow-iden");
        const cfmPaynowInput = document.querySelector("#paynow-iden-cfm");
        const emailError = document.querySelector(".error.email p");
        const paynowError = document.querySelector(".error.paynow p");

        if (ValidateEmail(emailInput.value)) {
            emailInput.style.border = "none";
            if (cfmEmailInput.value === emailInput.value) {
                emailcorrect = true;
                cfmEmailInput.style.border = "none";
                emailError.innerHTML = "ERROR";
                emailError.style.visibility = "hidden";
            } else {
                emailcorrect = false;
                cfmEmailInput.style.border = "1px solid rgb(255, 74, 74)";
                emailError.style.visibility = "visible";
                emailError.innerHTML = "Emails do not match."
            }
        } else {
            emailInput.style.border = "1px solid rgb(255, 74, 74)";
            emailError.style.visibility = "visible";
            emailError.innerHTML = "Please enter a valid email."
            emailcorrect = false;
        }

        if (paynowInput.value === "") {
            idcorrect = false;
            paynowError.style.visibility = "visible";
            paynowError.innerHTML = "Enter a valid PayNow identification."
            paynowInput.style.border = "1px solid rgb(255, 74, 74)";
        } else {
            paynowInput.style.border = "none";
            if (paynowInput.value === cfmPaynowInput.value) {
                idcorrect = true;
                cfmPaynowInput.style.border = "none";
                paynowInput.style.border = "none";
                paynowError.innerHTML = "ERROR";
                paynowError.style.visibility = "hidden";
            } else {
                idcorrect = false;
                paynowError.style.visibility = "visible";
                paynowError.innerHTML = "PayNow identifications do not match."
                cfmPaynowInput.style.border = "1px solid rgb(255, 74, 74)";
            }
        }

        if (idcorrect && emailcorrect) {
            const loadingIcon = document.querySelector(".loading-icon");
            const continueIcon = document.querySelector(".continue-icon");
            loadingIcon.style.display = "block";
            continueIcon.style.display = "none";

            const currentdate = new Date(); 
            const curDay = currentdate.getDate() + "-"
                            + (currentdate.getMonth()+1)  + "-" 
                            + currentdate.getFullYear();
            var curTime = currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
            
            const cartOBJ = JSON.parse(localStorage.getItem("cartItems"));
            var cartString = "| "

            for (const [key, value] of Object.entries(cartOBJ)) {
                cartString += key + " | ";
            }
            
            signInWithEmailAndPassword(auth, admin_username, admin_pass)
            .then(()=>{
                set(ref(DB,`paynowOrders/${curDay}/${curTime}`), {
                    email: emailInput.value,
                    id: paynowInput.value,
                    cart: cartString,
                    paid: localStorage.getItem("totalPrice")
                })
                auth.signOut();

                window.location.href = "/success.html";

            })
            .catch((error) => {
                console.log(`ERROR: ${error}`)
            })
        }
}

    
}
else if (curPage.includes("/admin/login")) {

    // Logging into dashboard
    if (sessionStorage.getItem("admin") === "in") {
        window.location.href = "dashboard.html";
    } else {
        const loginButton = document.querySelector("#admin-login");
    
        loginButton.addEventListener("click",function() {
            const emailInput = document.querySelector("#admin-user").value;
            const passInput = document.querySelector("#admin-pass").value;

            // Firebase function
            signInWithEmailAndPassword(auth, emailInput, passInput)
            .then(() => {
                sessionStorage.setItem("admin","in");
                window.location.href = "dashboard.html"
            })
            .catch((error) => {
                console.log(emailInput);
                console.log(passInput);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + errorMessage);
                alert(`ERROR ${errorCode}: ${errorMessage}`)
            });
        })
    }
    
}
else if (curPage.includes("/admin/dashboard")) {
    if (sessionStorage.getItem("admin") !== "in") {
        // See if admin already logged in
        window.location.href="login.html";
    } else {
        const returnHomepage = document.querySelector("#return-homepage");
        returnHomepage.addEventListener('click',resetSession);

        // Show Product data
        const section_products = document.querySelector("#products .items");
        const heading_products = document.querySelector("#products .heading h3");
        
        onValue(ref(DB,"Products/"), (snapshot) => {
            var count = 0;
            const productList = snapshot.val();
            for (const [key, value] of Object.entries(productList)) {
                count += 1;
                // Details
                const title = value["Title"];
                const desc = value["Desc"];
                const priceList = value["Prices"].split(";");
                var prices = "";
                
                priceList.forEach((price)=>{
                    prices += price + ", ";
                })
                
                prices = prices.substring(0, prices.length-2);

                // Create filename based on title
                const filename = title.split(" ").join("-");
                const filepath = `../resources/product-${filename}-1.png`;

                // New element
                const newItem = document.createElement("div");
                const image = document.createElement("img");
                const block = document.createElement("div");
                const titleElement = document.createElement("h4");
                const priceElement = document.createElement("p");

                // Assign identities
                newItem.classList.add("container");
                newItem.classList.add("item");

                block.classList.add("block-text");

                // Assign values
                image.src = filepath;
                titleElement.innerHTML = title;
                priceElement.innerHTML = prices;

                // Append children
                block.appendChild(titleElement);
                block.appendChild(priceElement);

                newItem.appendChild(image);
                newItem.appendChild(block);
                
                section_products.append(newItem);

            }
            const productChildrenList = document.querySelectorAll("#products .items .container.item");
            if (count > 4) {
                section_products.style.overflowY = "scroll";
            }

            // Adds animation to each product block
            productChildrenList.forEach((item, index) => {
                item.style.animationDelay = `${index*100+100}ms`;
            })
            heading_products.innerHTML = `Products (${count})`;
        })

        // Show orders
        const section_orders = document.querySelector("#paynowOrders .items");
        const heading_orders = document.querySelector("#paynowOrders .heading h3");
        const heading_prices = document.querySelector("#paynowOrders .heading .total");

        onValue(ref(DB, "paynowOrders/"), (snapshot) => {
            const orderList = snapshot.val();
            var total_earnings = 0;
            var totalOrders = 0;

            for (const [dateRec, ordersOnDateRec] of Object.entries(orderList)) {
                const date = dateRec;
                const ordersOnDate = ordersOnDateRec;
                
                var orderCountDate = 0;

                // New date tag
                const dateElement = document.createElement("p");
                dateElement.classList.add("date");

                // Append date tag
                section_orders.appendChild(dateElement);

                // Iterate through orders on particular date
                for (const [orderTimeRec, orderDetailsRec] of Object.entries(ordersOnDate)) {
                    orderCountDate += 1;

                    // Details
                    const time = orderTimeRec;
                    const id = orderDetailsRec["id"];
                    const email = orderDetailsRec["email"];
                    const paid = orderDetailsRec["paid"];

                    // New elements
                    const itemDiv = document.createElement("div");
                        const detailsDiv = document.createElement("div");
                            const timeElement = document.createElement("p");
                            const idElement = document.createElement("h4");
                            const emailElement = document.createElement("p");
                        const paidElement = document.createElement("h4");

                    // Assign identities
                    itemDiv.classList.add("container");
                    itemDiv.classList.add("item");
                    itemDiv.classList.add("orders");

                    detailsDiv.classList.add("block-text");

                    timeElement.classList.add("time");

                    emailElement.classList.add("email");

                    // Assign values
                    timeElement.innerHTML = time;
                    idElement.innerHTML = id;
                    emailElement.innerHTML = email;
                    paidElement.innerHTML = `SGD ${paid}`;

                    // Calculate total
                    total_earnings += parseInt(paid);

                    // Append children
                    detailsDiv.appendChild(timeElement);
                    detailsDiv.appendChild(idElement);
                    detailsDiv.appendChild(emailElement);

                    itemDiv.appendChild(detailsDiv);
                    itemDiv.appendChild(paidElement);

                    section_orders.appendChild(itemDiv);
                }
                
                totalOrders += orderCountDate;

                dateElement.innerHTML = `${date} (${orderCountDate})`;    
                
                const orderChildrenList = document.querySelectorAll("#paynowOrders .items .container.item");
                if (orderCountDate > 3) {
                    section_orders.style.overflowY = "scroll";
                }

                // Adds animation to each product block
                orderChildrenList.forEach((item, index) => {
                    item.style.animationDelay = `${index*100+100}ms`;
                })
            }

            if (totalOrders === 0) {
                section_orders.classList.add("empty");
                const emptyDiv = document.querySelector("#paynowOrders .items > .empty");
                emptyDiv.style.display = "block";
            }
            
            heading_prices.innerHTML = `Total Earnings: SGD ${total_earnings}`;
            heading_orders.innerHTML = `PayNow Orders (${totalOrders})`;
        })

        // Show newsletter emails


        // Show admin stuff


        // Signout button
        const signoutButton = document.querySelector("#signout-button");
        signoutButton.addEventListener('click',()=>{
            // Firebase function
            auth.signOut().then(function() {
                sessionStorage.setItem("admin","out");
                window.location.href = "login.html"
                alert("You have been signed out!");
            }).catch((error) =>{
                alert("An error "+error+" occured. Please contact Ike for assistance.");
            });
            
        })
    }
    
}

// Newsletter functionality
try {
    const newsLetterButton = document.querySelector("#footer #newsletter .continue");
    const emailAddress = document.querySelector("#footer #newsletter .email");
    const feedback = document.querySelector("#newsletter .block-text .feedback");

    function addNewsLetter(input, user) {
        signInWithEmailAndPassword(auth, admin_username, admin_pass)
        .then(() => {
            set(ref(DB,`Newsletter/${input}`), {
                mail: true
            }).then(()=>{
                feedback.innerHTML = `${user} has been added to our mailing list!`;
                feedback.classList.add("active");      
                setTimeout(() => {
                    feedback.classList.remove("active");

                    // sign out
                    auth.signOut();

                }, 2000);       
            }).catch((error) => {
                alert("ERROR: "+error);
            });
        })
        .catch((error) => {
            console.log(emailInput);
            console.log(passInput);
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + errorMessage);
            alert(`ERROR ${errorCode}: ${errorMessage}`)
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
} catch (error) {
    console.log(error);
}

