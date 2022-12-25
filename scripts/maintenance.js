// Maintenance
localStorage.setItem("maintenance",1);

if (localStorage.getItem("maintenance") === "1" && !curPage.includes("/admin/")) {
    window.location.href = "/maintenance"
}
