if (!sessionStorage.getItem("title")) {
    if (!sessionStorage.getItem("add-item")) {
        window.location.href = "../dashboard.html";
    } else {
        //process when new item
        const empty_Price = document.querySelector(".prices .empty");
        const empty_Img = document.querySelector(".image-container .empty")
        empty_Img.style.display = "block";
        empty_Price.style.display = "block";
    }
    
} else {
    const title = sessionStorage.getItem("title");
    const desc = sessionStorage.getItem("desc");
    const prices = sessionStorage.getItem("prices");
    const filename = sessionStorage.getItem("filepath");
    
    const titleInput = document.querySelector("#product-title");
    const descInput = document.querySelector("#product-desc");
    const imageContainer = document.querySelector(".image-container");
    
    imageContainer.style.backgroundImage = `url(../${filename})`;
    titleInput.value = title;
    descInput.value = desc;
    
    var priceArr = prices.split(";");
    
    const priceContainer = document.querySelector(".price-container");
    // <div class="price-item active">
    //     <div class="text">
    //         <p>Price Item goes here</p>
    //     </div>
    //     <div class="button">
    //         <i class="fa fa-minus"></i>
    //     </div>
    // </div>
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

        button_div.appendChild(minus_i);

        text_div.appendChild(p_tag);

        priceItem_div.appendChild(text_div);
        priceItem_div.appendChild(button_div);

        priceContainer.appendChild(priceItem_div);
    
    });
}

