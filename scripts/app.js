// Local storages
if (!localStorage.getItem("cartCount")) {
    localStorage.setItem("cartCount",0);
    localStorage.setItem("cartItems",JSON.stringify({}));
}

const curPage = window.location.pathname;
console.log(JSON.parse(localStorage.getItem("cartItems")));

if (curPage.includes("cart.html")) {
    function emptyCart() {
        const emptyCartDisplay = document.querySelector("#emptyCart");
        const cartData = document.querySelector("#cartData");
        emptyCartDisplay.classList.add("active");
        cartData.style.display = "none";
    }

    function remItemStorage(parent, child, node, table, row) {
        const name = node.dataset.name;
        
        // TODO FIX BUG OF INDEX
        const index = node.dataset.index;
        
        const cartItems = JSON.parse(localStorage.getItem("cartItems"));
        child.style.animation = "fade-out-right 400ms forwards";
        cartItems[name].splice(index, 1);
        console.log(cartItems[name]);
        setTimeout(() => {
            console.log(table.children.length);
            if (cartItems[name].length === 0) {
                delete cartItems[name];
                table.removeChild(row);
            } else {
                parent.removeChild(child);
            }
            localStorage.setItem("cartItems",JSON.stringify(cartItems));

            if (table.children.length == 1) {
                emptyCart();
            }
            
        }, 410);    
    }

    const cartTable = document.querySelector("#cartData .cart.table");
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
    
    let count = 0;
    for (const [key, value] of Object.entries(cartItems)) {
        const tempRow = document.createElement("tr");
        const count_td = document.createElement("td");
        const name_td = document.createElement("td");
        const quantity_td = document.createElement("td");
        const price_td = document.createElement("td");
        
        count += 1
        count_td.innerHTML = count;

        name_td.innerHTML = key;
        
        const tempList = document.createElement("ul");
        var tempPrice = 0;
        
        value.forEach((item, index) => {
            const tempListItem = document.createElement("li");
            const tempRemDiv = document.createElement("div");
            const tempRemButton = document.createElement("i");

            // Assign icon to button
            tempRemButton.classList.add("fa");
            tempRemButton.classList.add("fa-x");
            tempRemButton.classList.add("table-icon");
            tempRemButton.dataset.name = key;
            tempRemButton.dataset.index = index;
            tempRemDiv.classList.add("rem-div");
            tempRemDiv.appendChild(tempRemButton);

            // Add list item
            tempListItem.classList.add("quantity-item");
            tempListItem.innerHTML = item[0];
            // console.log
            tempListItem.appendChild(tempRemDiv);
            tempList.appendChild(tempListItem);
            
            tempRemButton.addEventListener('click', function() {
                remItemStorage(tempList, tempListItem, tempRemButton, cartTable, tempRow);
            });

            tempPrice += parseInt(item[1].substring(1));

        })

        quantity_td.appendChild(tempList);

        price_td.innerHTML = `$${tempPrice}`;
        
        tempRow.appendChild(count_td);
        tempRow.appendChild(name_td);
        tempRow.appendChild(quantity_td);
        tempRow.appendChild(price_td);
        
        cartTable.appendChild(tempRow);
    }
    
    if (count === 0) { //empty cart
        emptyCart();
    }
}