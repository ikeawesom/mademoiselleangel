console.log("Entered app.js");
// Local storages
if (!localStorage.getItem("cartCount")) {
    localStorage.setItem("cartCount",0);
    localStorage.setItem("cartItems",JSON.stringify({}));
}

console.log(JSON.parse(localStorage.getItem("cartItems")));

var curPage = window.location.pathname;

if (curPage.includes("cart.html")) {
    function emptyCart() {
        const emptyCartDisplay = document.querySelector("#emptyCart");
        const cartData = document.querySelector("#cartData");
        emptyCartDisplay.classList.add("active");
        cartData.style.display = "none";
    }

    function remItemStorage(table, row, div, title, pack) {
        const storeName = `${title};${pack}`;
        
        const cartItems = JSON.parse(localStorage.getItem("cartItems"));
        var curQuantity = cartItems[storeName][0];
        const basePrice = cartItems[storeName][1];

        curQuantity -= 1;

        if (curQuantity == 0) {
            div.style.animation = "fade-out-right 400ms forwards";
            
            delete cartItems[storeName];
            setTimeout(() => {
                table.removeChild(row);
            }, 500);
        } else {
            row.querySelector(".quantity-number").innerHTML = curQuantity;
            row.querySelector(".price").innerHTML = `$${curQuantity * basePrice}`;
            row.classList.add("remove-item");
            setTimeout(() => {
                row.classList.remove("remove-item");
            }, 500);
            const newArr = [curQuantity, basePrice];
            cartItems[storeName] = newArr;
        }
        localStorage.setItem("cartItems",JSON.stringify(cartItems));
        console.log(JSON.parse(localStorage.getItem("cartItems")));        



        // col_quantity -= 1;


        // if (col_quantity == 0) {
        //     table.removeChild(row);
        // }
        // const name = node.dataset.name;
        
        // // TODO FIX BUG OF INDEX
        // const index = node.dataset.index;
        
        // const cartItems = JSON.parse(localStorage.getItem("cartItems"));
        // child.style.animation = "fade-out-right 400ms forwards";
        // cartItems[name].splice(index, 1);
        // console.log(cartItems[name]);
        // setTimeout(() => {
        //     console.log(table.children.length);
        //     if (cartItems[name].length === 0) {
        //         delete cartItems[name];
        //         table.removeChild(row);
        //     } else {
        //         parent.removeChild(child);
        //     }
        //     localStorage.setItem("cartItems",JSON.stringify(cartItems));

        //     if (table.children.length == 1) {
        //         emptyCart();
        //     }
            
        // }, 410);    
    }

    const cartTable = document.querySelector("#cartData .cart.table");
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
    
    let count = 0;
    for (const [key, value] of Object.entries(cartItems)) {
        // Declare temp child elements
        const tempRow = document.createElement("tr");

        const name_td = document.createElement("td");
        const pack_td = document.createElement("td");
        const quantity_td = document.createElement("td");
        const quantityDiv = document.createElement("div");
        const quantityNumDiv = document.createElement("div");
        const remButton = document.createElement("i");
        const remDiv = document.createElement("div");
        const price_td = document.createElement("td");
        
        count += 1

        // Declare namespaces
        const title = key.split(";")[0];
        const pack = key.split(";")[1];
        const quantity = value[0];
        const price = quantity * value[1];
        
        // Assign values to child elements
        name_td.innerHTML = title;
        pack_td.innerHTML = pack;
        quantityNumDiv.innerHTML = quantity;
        price_td.innerHTML = `$${price}`;

        // Assign identification/data for JS
        // tempRow.dataset.index = count; // to remove row if quantity < 0
        // tempRow.dataset.title = title;
        // tempRow.dataset.pack = pack;
        // tempRow.dataset.quantity = quantity; // to keep track of current quantity

        remDiv.classList.add("rem-div");
        quantityDiv.classList.add("quantity-item");
        quantityNumDiv.classList.add("quantity-number");

        remButton.classList.add("fa");
        remButton.classList.add("fa-x");
        remButton.classList.add("table-icon");

        price_td.classList.add("price");
        // price_td.dataset.basePrice = value[1]; // assign base price        
        
        // Add click events
        remDiv.addEventListener('click',function() {
            remItemStorage(cartTable, tempRow, quantityDiv, title, pack);
            // console.log("count");
        });

        // Append children
        remDiv.appendChild(remButton);
        quantity_td.appendChild(quantityDiv);
        quantityDiv.appendChild(quantityNumDiv);
        quantityDiv.appendChild(remDiv);

        tempRow.appendChild(name_td);
        tempRow.appendChild(pack_td);
        tempRow.appendChild(quantity_td);
        tempRow.appendChild(price_td);
        
        cartTable.appendChild(tempRow);
    }
    
    if (count === 0) { //empty cart
        emptyCart();
    }
}