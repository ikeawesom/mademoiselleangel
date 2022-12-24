// Helper function
function clearProductSession(){
    sessionStorage.removeItem("title");
    sessionStorage.removeItem("desc");
    sessionStorage.removeItem("prices");
    sessionStorage.removeItem("filename");
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

if (!sessionStorage.getItem("title")) {
    clearProductSession();
    if (!sessionStorage.getItem("add-item")) {
        window.location.href = "../dashboard.html";
    } else {
        //process when new item
        const empty_Price = document.querySelector(".prices .empty");
        const empty_Img = document.querySelector(".image-container .empty")
        const image_container = document.querySelector(".details.image");
        image_container.style.overflow = "hidden";
        empty_Img.style.display = "block";
        empty_Price.style.display = "block";
    }
    
} else {
    // hide image stuff
    const image_unavail = document.querySelector(".details.image .unavailable");
    image_unavail.style.display = "none";

    const title = sessionStorage.getItem("title");
    const desc = sessionStorage.getItem("desc");
    const prices = sessionStorage.getItem("prices");
    const filename = sessionStorage.getItem("filepath");    
    const titleInput = document.querySelector("#product-title");
    const descInput = document.querySelector("#product-desc");
    const imageContainer = document.querySelector(".image-container");
    
    if (fileExists(`../${filename}`)) {
        imageContainer.style.backgroundImage = `url(../${filename})`;
    } else {
        imageContainer.style.backgroundImage = `url(../../resources/image-unavailable.png)`;
    }
    titleInput.value = title;
    descInput.value = desc;
    
    if (prices === "") {
        const empty_Price = document.querySelector(".prices .empty");
        empty_Price.style.display = "block";
    } else {
        var priceArr = prices.split(";");
        
        const priceContainer = document.querySelector(".price-container");
        priceArr.forEach((text) => {
            // Details
            const price = text;
            
            // New elements
            const priceItem_div = document.createElement("div");
            const text_div = document.createElement("div");
            const p_tag = document.createElement("p");
            const button_div = document.createElement("div");
            const minus_i = document.createElement("i");

            // Assign values
            p_tag.innerHTML = price;
        
            // Add identifiers
            priceItem_div.classList.add("price-item");
            priceItem_div.classList.add("active");

            text_div.classList.add("text");

            button_div.classList.add("button");
            minus_i.classList.add("fa");
            minus_i.classList.add("fa-minus");

            // Add events
            button_div.addEventListener('click', () => {
                // Remove price from session Storage
                const price_remove = price;
                var new_priceList = "";

                priceArr.forEach((item) => {
                    if (item !== price_remove) {
                        new_priceList += item + ";";
                    }
                })

                new_priceList = new_priceList.substring(0, new_priceList.length - 1);
                sessionStorage.setItem("prices",new_priceList);

                // Remove price from container
                const priceItems = priceContainer.querySelectorAll(".price-item.active");

                priceItems.forEach((item) => {
                    const tag = item.querySelector(".text p").innerHTML;
                    if (tag === price) {
                        item.style.animation = "fade-out 400ms forwards";

                        setTimeout(() => {
                            priceContainer.removeChild(item);                        

                            if (priceContainer .children.length <= 1) {
                                const empty_Price = document.querySelector(".prices .empty");
                                empty_Price.style.display = "block";
                            }

                        }, 450);
                    }
                }) 
                console.log(sessionStorage.getItem("prices"));
            })

            button_div.appendChild(minus_i);

            text_div.appendChild(p_tag);

            priceItem_div.appendChild(text_div);
            priceItem_div.appendChild(button_div);

            priceContainer.appendChild(priceItem_div);
        
        });
    }
}

// Adding prices
if (sessionStorage.getItem("prices")) {
    var prices_list = sessionStorage.getItem("prices")
} else {
    var prices_list = "";
}

console.log(prices_list);

const addPrice_button = document.querySelector("#product #add-price-button");

addPrice_button.addEventListener('click',()=>{
    // sessionStorage.removeItem("prices");
    const package = document.querySelector("#product #price-package");
    const contents = document.querySelector("#product #price-content");
    const quantity = document.querySelector("#product #price-quantity");
    const valuePrice = document.querySelector("#product #price-value");

    var status_package = false;
    var status_contents = false;
    var status_quantity = false;
    var status_value = false;

    if (package.value === "") {
        status_package = false;
        package.style.border = "1px solid rgb(255, 74, 74)";
    } else {
        status_package = true;
        package.style.border = "none";
    }

    if (contents.value === "") {
        status_contents = false;
        contents.style.border = "1px solid rgb(255, 74, 74)";
    } else {
        status_contents = true;
        contents.style.border = "none";
    }

    if (quantity.value === "") {
        status_quantity = false;
        quantity.style.border = "1px solid rgb(255, 74, 74)";
    } else {
        quantity.style.border = "none";
        status_quantity = true;
    }

    if (valuePrice.value === "") {
        valuePrice.style.border = "1px solid rgb(255, 74, 74)";
        status_value = false;
    } else {
        status_value = true;
        valuePrice.style.border = "none";
    }

    if (status_contents && status_package && status_quantity && status_value) {
        const new_price = `${quantity.value} ${contents.value} per ${package.value} - $${valuePrice.value}`;
        if (sessionStorage.getItem(new_price)) {
            alert("This price item already exists.")
        } else {
            prices_list += new_price + ";";

            // Vanish empty div
            const empty_Price = document.querySelector(".prices .empty");
            empty_Price.style.display = "none";

            // Append new item to price-container
            const price_container = document.querySelector(".prices .price-container");

            // New elements
            const priceItem_div = document.createElement("div");
            const text_div = document.createElement("div");
            const text_p = document.createElement("p");
            const button_div = document.createElement("div");
            const icon_i = document.createElement("i");

            // Assign values
            text_p.innerHTML = new_price;

            // Assign identifiers
            priceItem_div.classList.add("price-item");
            priceItem_div.classList.add("active");

            text_div.classList.add("text");

            button_div.classList.add("button");

            icon_i.classList.add("fa");
            icon_i.classList.add("fa-minus");

            // Add events
            button_div.addEventListener('click', () => {
                // Remove price from session Storage
                const price_remove = new_price;
                var new_priceList = "";

                prices_list.split(";").forEach((item) => {
                    if (item !== price_remove) {
                        new_priceList += item + ";";
                    }
                })

                new_priceList = new_priceList.substring(0, new_priceList.length - 1);
                sessionStorage.setItem("prices",new_priceList);

                // Remove price from container
                const priceItems = price_container.querySelectorAll(".price-item.active");

                priceItems.forEach((item) => {
                    const tag = item.querySelector(".text p").innerHTML;
                    if (tag === new_price) {
                        item.style.animation = "fade-out 400ms forwards";

                        setTimeout(() => {
                            price_container.removeChild(item);                        

                            if (price_container.children.length <= 1) {
                                const empty_Price = document.querySelector(".prices .empty");
                                empty_Price.style.display = "block";
                            }

                        }, 450);
                    }
                })               
            })

            // Append children
            text_div.appendChild(text_p);

            button_div.appendChild(icon_i);

            priceItem_div.appendChild(text_div);
            priceItem_div.appendChild(button_div);
            
            // Set anmimation
            priceItem_div.style.animation = "fade-in 400ms forwards";
            
            price_container.appendChild(priceItem_div);

            sessionStorage.setItem("prices",prices_list.substring(0,prices_list.length-1));
            console.log(sessionStorage.getItem("prices"));
        }
    }
});

// function futureDev() {
//     const reloadButton = document.querySelector(".details.image #reload-image");
//     const empty_Img = document.querySelector(".image-container .empty");
    
//     reloadButton.addEventListener('click',()=>{
//         const titleList = document.querySelector("#product-title").value.split(" ");
//         var filename = "product-";
//         titleList.forEach((word) => {
//             filename += word + "-";
//         })
//         filename += "1.png"
//         console.log(filename);
//         // var imageFile = "../../resources/"
//     })
//             // empty_Img.style.display = "block";
// }
