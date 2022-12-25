// Maintenance
localStorage.setItem("maintenance",1);
alert((localStorage.getItem("maintenance"));

if (localStorage.getItem("maintenance") === "1" && !curPage.includes("/admin/")) {
    alert("here");
    window.location.href = "/maintenance"
}
