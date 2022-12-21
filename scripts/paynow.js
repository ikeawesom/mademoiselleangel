console.log("Entered PayNow");

const pricetag = document.querySelector("#total-price");

const totalprice = localStorage.getItem("totalPrice");

pricetag.innerHTML = `SGD ${totalprice}`;