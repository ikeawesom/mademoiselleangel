import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import {getDatabase, set, get, onValue, update, remove, ref, child} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence, updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

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
    auth.signOut().then(function() {
        alert("You will been signed out!");
        sessionStorage.clear();
    }).catch((error) =>{
        alert("An error "+error+" occured. Please contact Ike for assistance.");
    });  
    onAuthStateChanged(auth ,() => {
        window.location.href = "/";
    })
}

function checkLength(value) {
    return value.length >= 8;
}

function checkCaps(value) {
    const caps = /[A-Z]/g;
    return value.match(caps);
}

function checkLow(value) {
    const low = /[a-z]/g;
    return value.match(low);
}

function checkNumber(value) {
    const numbers = /[0-9]/g;
    return value.match(numbers);
}

function clearProductSession(){
    sessionStorage.removeItem("title");
    sessionStorage.removeItem("desc");
    sessionStorage.removeItem("prices");
    sessionStorage.removeItem("filename");
    sessionStorage.removeItem("add-item");
}

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send()
        return req.status==200;
    } else {
        return false;
    }
}

// Firebase processes in main page
if (!curPage.includes("/cart") && !curPage.includes("/paynow") && !curPage.includes("/success") && !curPage.includes("/admin/login") && !curPage.includes("/admin/dashboard")) {
    // Logs out of current account
    auth.signOut();
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
// PayNow page
else if (curPage.includes("/paynow")) {
    // Logs out of current account
    auth.signOut();
    
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
            
            set(ref(DB,`paynowOrders/${curDay}/${curTime}`), {
                email: emailInput.value,
                id: paynowInput.value,
                cart: cartString,
                paid: localStorage.getItem("totalPrice")
            })

            window.location.href = "/success.html";
        }
}

    
}
// Log in admin page
else if (curPage.includes("/admin/login")) {
    document.body.style.visibility = "hidden";
    // Logging into dashboard
    onAuthStateChanged(auth, (user) => {
        if (user) {
            get(ref(DB,`Admins/${user.uid}`))
            .then((snapshot) => {
                if (snapshot.val()) {
                    document.body.style.visibility = "visible";
                    window.location.href = "dashboard.html";
                } else {
                    alert("You do not have access to this page.");
                    window.location.href = "/";
                }
            })
            .catch((error)=> {
                alert(error);
            })
        } else {
            document.body.style.visibility = "visible";
            const loginButton = document.querySelector("#admin-login");
    
            loginButton.addEventListener("click",function() {
                const emailInput = document.querySelector("#admin-user").value;
                const passInput = document.querySelector("#admin-pass").value;
                
                setPersistence(auth, browserSessionPersistence)
                .then(() => {
                    return signInWithEmailAndPassword(auth, emailInput, passInput);
                })
                .catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(`ERROR ${errorCode}: ${errorMessage}`);
                });
            });
        }
    });   
}
// Dashboard pages
else if (curPage.includes("/admin/dashboard") && !curPage.includes("product")) {
    document.body.style.visibility = "hidden";
    try {
        clearProductSession();
    } catch (error) {
        console.log(`ERROR: ${error.code}: ${error.message}`);
    }
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            get(ref(DB,`Admins/${user.uid}`))
            .then((snapshot) => {
                if (snapshot.val()) {
                    document.body.style.visibility = "visible";
                    const userEmail = user.email;
                    setUp(snapshot.val()["displayName"]);
                    showAnnouncements();
                    showProducts();
                    showOrders();
                    showNewsletter();
                    showAdmin(user, userEmail);
                } else {
                    alert("You do not have access to this page.");
                    window.location.href = "/";
                }
            })
            .catch((error)=> {
                alert(error);
            })
        } else {
          window.location.href="login.html";
        }
      });

    // Set up basic events
    function setUp(user) {
        // Header
        const returnHomepage = document.querySelector("#return-homepage");
        returnHomepage.addEventListener('click',resetSession);

        // Signout button
        const signoutButton = document.querySelector("#signout-button");
        signoutButton.addEventListener('click',()=>{
            // Firebase function
            auth.signOut().then(function() {
                alert("You have been signed out!");
                sessionStorage.clear();
            }).catch((error) =>{
                alert("An error "+error+" occured. Please contact Ike for assistance.");
            });
            
        })
        // Greeting
        const greeting = document.querySelector("#header h2");
        greeting.innerHTML = `Welcome to your dashboard, ${user}.`;
    }

    // Show any announcements
    function showAnnouncements() {
        // Get elements
        const section_announce = document.querySelector("#announcements .container");
        
        // Show announcements
        get(ref(DB,"Announcements/"))
        .then((snapshot) => {
            const announcementList = snapshot.val();
            // console.log(announcementList);

            for (const [dateRec, valueRec] of Object.entries(announcementList)) {

                if (dateRec === "1") {continue;} // for firebase storage

                // Details
                const date = dateRec;
                const text = valueRec;

                // New element
                const title = document.createElement("h4");
                const details = document.createElement("p");

                title.innerHTML = date;
                details.innerHTML = text;

                title.classList.add("heading");

                section_announce.appendChild(title);
                section_announce.appendChild(details);
            }
        })
    }
    
    // Show paynow orders
    function showOrders() {
        // Get elements
        const section_orders = document.querySelector("#paynowOrders .items");
        const heading_orders = document.querySelector("#paynowOrders .heading h3");
        const heading_prices = document.querySelector("#paynowOrders .heading .total");

        // Show orders
        get(ref(DB,"paynowOrders/"))
        .then((snapshot) => {
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
                // Adds animation to each product block
                orderChildrenList.forEach((item, index) => {
                    item.style.animationDelay = `${index*100+100}ms`;
                })
            }

            heading_prices.innerHTML = `Total Earnings: SGD ${total_earnings}`;
            heading_orders.innerHTML = `PayNow Orders (${totalOrders})`;
        }).catch((error) => {
            section_orders.classList.add("empty");
            const emptyDiv = document.querySelector("#paynowOrders .items > .empty");
            emptyDiv.style.display = "block";
        })
    }

    // Show products
    function showProducts() {
        // Get elements
        const section_products = document.querySelector("#products .items");
        const heading_products = document.querySelector("#products .heading h3");
        
        // Show Product data
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

                // Append children
                block.appendChild(titleElement);
                block.appendChild(priceElement);

                newItem.appendChild(image);
                newItem.appendChild(block);
                
                // Add click event
                newItem.addEventListener('click',() => {
                    sessionStorage.setItem("title",title);
                    sessionStorage.setItem("desc",desc);
                    sessionStorage.setItem("prices",value["Prices"]);
                    sessionStorage.setItem("filepath",filepath);
                    window.location.href = "dashboard/product.html"
                })

                // Assign values
                if (fileExists(filepath)) {
                    image.src = filepath;
                } else {
                    image.src = '../resources/image-unavailable.png';
                }
                titleElement.innerHTML = title;
                priceElement.innerHTML = prices;
                section_products.append(newItem);
            }

            if (count > 4) {
                section_products.style.overflowY = "scroll";
            }
            // Adds animation to each product block
            const productChildrenList = document.querySelectorAll("#products .items .container.item");
            productChildrenList.forEach((item, index) => {
                item.style.animationDelay = `${index*100+100}ms`;
            })
            heading_products.innerHTML = `Products (${count})`;
        })

        // Add products
        const addProduct_button = document.querySelector("#products #add-product");
        addProduct_button.addEventListener('click',()=> {
            console.log("click");
            sessionStorage.setItem("add-item","true");
            window.location.href = "dashboard/product.html"
        })
    }

    // Show newsletter emails
    function showNewsletter() {
        // Show orders
        const section_newsletter = document.querySelector("#newsletter .items");
        const heading_newsletter = document.querySelector("#newsletter .heading h3");

        get(ref(DB,"Newsletter/"))
        .then((snapshot) => {
            const newsLetterList = snapshot.val();
            var totalPeople = 0;

            for (const [emailRec, statusRec] of Object.entries(newsLetterList)) {
                totalPeople += 1;

                // Details
                var email = "";
                for (let i = 0; i < emailRec.length; i++) {
                    if (emailRec.charAt(i) === "-") {
                        email += "@";
                    }
                    else if (emailRec.charAt(i) === "_") {
                        email += ".";
                    }
                    else {
                        email += emailRec.charAt(i);
                    }
                }

                var status = "";
                for (const [typeRec, typeStatusRec] of Object.entries(statusRec)) {
                    status += `${typeRec}: ${typeStatusRec}`;
                }
                
                
                // New elements
                const itemDiv = document.createElement("div");
                    const detailsDiv = document.createElement("div");
                        const emailElement = document.createElement("h4");
                        const statusElement = document.createElement("p");

                // Assign identities
                itemDiv.classList.add("container");
                itemDiv.classList.add("item");

                detailsDiv.classList.add("block-text");

                // Assign values
                emailElement.innerHTML = email;
                statusElement.innerHTML = status;

                // Append children
                detailsDiv.appendChild(emailElement);
                detailsDiv.appendChild(statusElement);

                itemDiv.appendChild(detailsDiv);

                section_newsletter.appendChild(itemDiv);
            }
            
            heading_newsletter.innerHTML = `Newsletter Emails (${totalPeople})`;    
            
            if (totalPeople > 5) {
                section_newsletter.style.overflowY = "scroll";
            }

            const newsChildrenList = document.querySelectorAll("#newsletter .items .container.item");
            // Adds animation to each product block
            newsChildrenList.forEach((item, index) => {
                item.style.animationDelay = `${index*100+100}ms`;
            })
        })
        .catch((error) => {
            section_newsletter.classList.add("empty");
            const emptyDiv = document.querySelector("#newsletter .items > .empty");
            emptyDiv.style.display = "block";
            alert("ERROR: " + error);
        })
    }

    // Admin stuff
    function showAdmin(user, userEmail) {
        const changeEmailButton = document.querySelector(".button#change-email");
        const changePassButton = document.querySelector(".button#change-pass");

        changeEmailButton.addEventListener('click', () => {
            // Get elements
            const curEmailInput = document.querySelector("#email-cur");
            const newEmailInput = document.querySelector("#email-new");
            const newEmailCfmInput = document.querySelector("#email-new-cfm");

            // Error box
            const errorBox = document.querySelector("#email-error")
            const errorEmail = document.querySelector("#email-wrong");
            const errorInvalidEmail = document.querySelector("#email-invalid");
            const errorInvalidEmailCfm = document.querySelector("#email-mismatch");

            errorBox.style.display = "flex";

            var correctCurrentEmail = false;
            var validNewEmail = false
            var validNewEmailCfm = false;

            // Validation
            if (curEmailInput.value !== userEmail) {
                errorEmail.style.display = "list-item";
                curEmailInput.style.border = "1px solid rgb(255, 74, 74)";
                correctCurrentEmail = false;
            } else {
                curEmailInput.style.border = "none";
                errorEmail.style.display = "none";
                correctCurrentEmail = true;
            }

            if (!ValidateEmail(newEmailInput.value)) {
                errorInvalidEmail.style.display = "list-item";
                newEmailInput.style.border = "1px solid rgb(255, 74, 74)";
                validNewEmail = false;
            } else {
                errorInvalidEmail.style.display = "none";
                newEmailInput.style.border = "none";
                validNewEmail = true;
            }

            if (newEmailCfmInput.value !== newEmailInput.value) {
                errorInvalidEmailCfm.style.display = "list-item";
                newEmailCfmInput.style.border = "1px solid rgb(255, 74, 74)";
                validNewEmailCfm = false;
            } else {
                errorInvalidEmailCfm.style.display = "none";
                newEmailCfmInput.style.border = "none";
                validNewEmailCfm = true;
            }

            // Change email firebase
            if (correctCurrentEmail && validNewEmail && validNewEmailCfm) {
                errorBox.style.display = "none";
                const buttonIcon = document.querySelector("#change-email .button-icon");
                const loadingIcon = document.querySelector("#admin #change-email .loading-icon");
                buttonIcon.style.display = "none";
                loadingIcon.style.display = "block";
                updateEmail(user, newEmailCfmInput.value)
                .then(() => {
                    alert(`Email address has been changed to: ${newEmailCfmInput.value}.\n\nPlease sign in again using this new email address.`);
                    auth.signOut();
                })
                .catch((error) => {
                    alert(`ERROR ${error.code}: ${error.message}`);
                });
            } else {
                errorBox.style.display = "flex";
            }
        })

        changePassButton.addEventListener('click', () => {
            // Get elements
            const curPassInput = document.querySelector("#pass-cur");
            const newPassInput = document.querySelector("#pass-new");
            const newPassCfm = document.querySelector("#pass-new-cfm");

            // Error bpx
            const errorBox = document.querySelector("#pass-error");
            const error_Wrong = document.querySelector("#pass-wrong");
            const error_Length = document.querySelector("#pass-short");
            const error_Caps = document.querySelector("#pass-caps");
            const error_Low = document.querySelector("#pass-low");
            const error_Num = document.querySelector("#pass-num");
            const error_mismatch = document.querySelector("#pass-mismatch");

            var status_curPass = false;
            var status_Length = false;
            var status_Caps = false;
            var status_Low = false;
            var status_Num = false;
            var status_newCfmPass = false;

            get(ref(DB,`Admins/${user.uid}`))
            .then((snapshot) => {

                const passwordRec = snapshot.val()["password"];

                if (curPassInput.value !== passwordRec) {
                    error_Wrong.style.display = "list-item";
                    curPassInput.style.border = "1px solid rgb(255, 74, 74)";
                    status_curPass = false
                } else {
                    error_Wrong.style.display = "none";
                    curPassInput.style.border = "none";
                    status_curPass = true
                }

                if (!checkLength(newPassInput.value)) {
                    error_Length.style.display = "list-item";
                    newPassInput.style.border = "1px solid rgb(255, 74, 74)";
                    status_Length = false
                } else {
                    error_Length.style.display = "none";
                    newPassInput.style.border = "none";
                    status_Length = true
                }

                if (!checkCaps(newPassInput.value)) {
                    error_Caps.style.display = "list-item";
                    newPassInput.style.border = "1px solid rgb(255, 74, 74)";
                    status_Caps = false
                } else {
                    error_Caps.style.display = "none";
                    newPassInput.style.border = "none";
                    status_Caps = true
                }

                if (!checkLow(newPassInput.value)) {
                    error_Low.style.display = "list-item";
                    newPassInput.style.border = "1px solid rgb(255, 74, 74)";
                    status_Low = false
                } else {
                    error_Low.style.display = "none";
                    newPassInput.style.border = "none";
                    status_Low = true
                }

                if (!checkNumber(newPassInput.value)) {
                    error_Num.style.display = "list-item";
                    newPassInput.style.border = "1px solid rgb(255, 74, 74)";
                    status_Num = false
                } else {
                    error_Num.style.display = "none";
                    newPassInput.style.border = "none";
                    status_Num = true
                }

                if (newPassInput.value !== newPassCfm.value) {
                    error_mismatch.style.display = "list-item";
                    newPassCfm.style.border = "1px solid rgb(255, 74, 74)";
                    status_newCfmPass = false
                } else {
                    error_mismatch.style.display = "none";
                    newPassCfm.style.border = "none";
                    status_newCfmPass = true
                }

                if (status_curPass && status_newCfmPass && status_Caps && status_Length && status_Low && status_Num) {
                    errorBox.style.display = "none";

                    // Update Auth password
                    updatePassword(user, newPassCfm.value).then(() => {
                        // Update successful.

                        // Update database password
                        update(ref(DB,`Admins/${user.uid}`),{
                            password: newPassCfm.value
                        }).then(()=> {
                            alert(`Password has been changed \nPlease sign in again using this new password.`);
                            auth.signOut();
                        })
                        .catch((error) => {
                            // An error ocurred
                            alert(`ERROR ${error.code}: ${error.message}`);
                        });
                        
                      }).catch((error) => {
                        // An error ocurred
                        alert(`ERROR ${error.code}: ${error.message}`);
                      });

                } else {
                    errorBox.style.display = "flex";
                }
            })
            .catch((error) => {
                alert(`ERROR ${error.code}: ${error.message}`);
            })
        })
    }
}
// Product page
else if (curPage.includes("/admin/dashboard/product")) {
    // Update products
    const save_button = document.querySelector("#product .heading #save-button");
    const error_container = document.querySelector("#product .error-container");

    // Input fields
    const titleInput = document.querySelector("#product-title");
    const descInput = document.querySelector("#product-desc");
    const pricesInput = document.querySelector("#product .prices .price-container")

    save_button.addEventListener('click',()=>{

        // Validate
        var title_status = false;
        var desc_status = false;
        var price_status = false;

        if (titleInput.value === "") {
            titleInput.style.border = "1px solid rgb(255, 74, 74)";
            title_status = false;
        } else {
            title_status = true;
            titleInput.style.border = "none";
        }

        if (descInput.value === "") {
            descInput.style.border = "1px solid rgb(255, 74, 74)";
            desc_status = false;
        } else {
            descInput.style.border = "none";
            desc_status = true;
        }

        if (!sessionStorage.getItem("prices")) {
            pricesInput.style.border = "1px solid rgb(255, 74, 74)";
            price_status = false;
        } else {
            pricesInput.style.border = "none";
            price_status = true;
        }

        if (price_status && desc_status && title_status) {
            

            // Bug here
            get(ref(DB,"Products/"))
            .then((snapshot)=>{
                var loop_check = true;
                console.log(snapshot.val());
                for (const [titleRec, detailsRec] of Object.entries(snapshot.val())) {

                    // Check if adding new item
                    if (sessionStorage.getItem("add-item") === "true") {
                        if (titleInput.value === titleRec) {
                            alert("Name already exists. Please choose a different product name");
                            titleInput.style.border = "1px solid rgb(255, 74, 74)";
                            loop_check = false;
                            break
                        }
                    }
                    // Check if overlaps another current item
                    else {
                        if (sessionStorage.getItem("title") == titleRec) {
                            continue;
                        }
                        if (titleInput.value === titleRec) {
                            alert("Name already exists. Please choose a different product name");
                            titleInput.style.border = "1px solid rgb(255, 74, 74)";
                            loop_check = false;
                            break
                        }
                    }
                }
                if (loop_check) {
                    error_container.style.display = "none";

                    // New Item
                    if (sessionStorage.getItem("add-item") === "true") {
                        // Add to firebase DB
                        set(ref(DB, `Products/${titleInput.value}`), {
                            Title: titleInput.value,
                            Desc: descInput.value,
                            Prices: sessionStorage.getItem("prices")
                        })
                        .then(()=> {
                            alert(`Item "${titleInput.value}" updated.`);
                            clearProductSession();
                            window.location.href = "../dashboard.html";
                        })
                        .catch((error) => {
                            alert(`ERROR ${error.code}: ${error.message}`);
                        })
                    } else {
                        // Update item in firebase DB
                        update(ref(DB,`Products/${titleInput.value}`), {
                            Title: titleInput.value,
                            Desc: descInput.value,
                            Prices: sessionStorage.getItem("prices")
                        })
                        .then(()=>{
                            alert(`Item "${titleInput.value}" updated.`);
                            clearProductSession();
                            window.location.href = "../dashboard.html";
                        })
                        .catch((error) => {
                            alert(`ERROR ${error.code}: ${error.message}`);
                        })

                    }


            
                    

                } else {
                    error_container.style.display = "block";
                }
            })
            .catch((error) => {
                alert(`ERROR: ${error.code}: ${error.message}`);
            })            
        } else {
            error_container.style.display = "block";
        }
    })
}

// Newsletter functionality
try {
    const newsLetterButton = document.querySelector("#footer #newsletter .continue");
    const emailAddress = document.querySelector("#footer #newsletter .email");
    const feedback = document.querySelector("#newsletter .block-text .feedback");

    function addNewsLetter(input, user) {
        set(ref(DB,`Newsletter/${input}`), {
            Mail: true,
        }).then(()=>{
            feedback.innerHTML = `${user} has been added to our mailing list!`;
            feedback.classList.add("active");      
            setTimeout(() => {
                feedback.classList.remove("active");
            }, 2000);       
        }).catch((error) => {
            alert("ERROR: "+ error);
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

