// Maintenance
localStorage.setItem("maintenance",0);

if (localStorage.getItem("maintenance") === "1" && !window.location.pathname.includes("/admin/")) {
    window.location.href = "/maintenance";
}
