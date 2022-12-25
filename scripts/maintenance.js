// Maintenance
localStorage.setItem("maintenance",1);
alert("hi");

if (localStorage.getItem("maintenance") === "1" && !curPage.includes("/admin/")) {
    window.location.href = "/maintenance"
}
