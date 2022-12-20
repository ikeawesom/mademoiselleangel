console.log("Entered PayNow");

const pricetag = document.querySelector("#total-price");

const totalprice = localStorage.getItem("totalPrice");

pricetag.innerHTML = `SGD ${totalprice}`;

const agreement = document.querySelector("#agree-received");
const buttonPay = document.querySelector("#pay-button");
agreement.addEventListener('click',()=>{
    if (agreement.checked) {
        buttonPay.classList.remove("inactive");
    } else {
        buttonPay.classList.add("inactive");
    }
})