console.log("Entered animations.js");
var curPage = window.location.pathname;

// Helpers
function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}

// -- Main Functions -- //
var clicked = false; // fixes line bouncing bug
// Navigation Bar Effects
const navEffects = () => {
    gsap.registerPlugin(Flip);
    const navLinks = document.querySelectorAll(".nav-item li a");
    const activeNav = document.querySelector(".active-nav");
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            clicked = true; // fixes line bouncing bug
            
            // Turn navs blue
            gsap.to(navLinks, {color:"rgb(0, 0, 105)"});
            if (document.activeElement === link) {
                gsap.to(link, {color: "rgb(75, 75, 223)"});
            }
            
            // Move line
            const state = Flip.getState(activeNav);
            link.appendChild(activeNav);
            Flip.from(state, {
                duration:0.5,
                absolute:true,
                ease: 'elastic.out(0.5,0.5)'
            });

            setTimeout(() => {
                clicked = false;
            }, 1000); // fixes line bouncing bug
        });
        link.addEventListener('mouseover', ()=> {
            link.style.color = "rgb(75, 75, 223)";
        })
        link.addEventListener('mouseout', () => {
            link.style.color = "rgb(0, 0, 105)";
        })
    });
    
    // Hamburger
    const hamburger = document.querySelector("#hamburger");
    const navBar = document.querySelector("#navbar");
    const navLinksA = document.querySelectorAll(".nav-item li");
    
    hamburger.addEventListener('click', () => {
        navBar.classList.toggle("active");
        navLinksA.forEach((linkA, index) => {
            if (linkA.style.animation) {
                linkA.style.animation = '';
            } else {
                linkA.style.animation = `fade-right 0.3s ease ${index / 7 + 2}s;`
            }
        })
    
        hamburger.classList.toggle("toggle");
    });  
}

// Scroll animation Effects
const scrollAnimation = () => {
    gsap.registerPlugin(Flip);

    // Fade in animations
    const animationIn = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("show");
                        entry.target.style.transitionDelay = `${index*150}ms`;
                        setTimeout(() => {
                            entry.target.style.transitionDelay = "";
                        }, 500);
                    }, 500);
                    setTimeout(() => {
                        entry.target.classList.remove("extra");
                    }, 1500);
                } else {
                    // entry.target.classList.remove("show");
                }
            })
        })
    
        const hiddenElements = document.querySelectorAll(".hidden");
        hiddenElements.forEach((el) => {
            observer.observe(el);
        })
    
        const hiddenLeftElements = document.querySelectorAll(".hidden-left");
        hiddenLeftElements.forEach((el) => {
            observer.observe(el);
        })
    
        const hiddenRightElements = document.querySelectorAll(".hidden-right");
        hiddenRightElements.forEach((el) => {
            observer.observe(el);
        })
    }

    // Smooth scrolls on main page
    if (!curPage.includes("cart") && !curPage.includes("/products")){
        const smoothScrolls = () => {

            function smoothScrollHelper(target, duration) {
                var target = document.getElementById(target);
                var targetPosition = target.getBoundingClientRect().top - vh(12);
                var startPosition = window.scrollY;
                var startTime = null;
    
    
                function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    var timeElapsed = currentTime - startTime;
                    var run = ease(timeElapsed, startPosition, targetPosition, duration);
                    window.scrollTo(0,run);
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
    
                function ease (t, b, c, d) {
                    t /= d/2;
                    if (t < 1) return c/2*t*t + b;
                    t--;
                    return -c/2 * (t*(t-2) - 1) + b;
    
                };
                requestAnimationFrame(animation);
            }
    
            const navLinks = document.querySelectorAll(".nav-item li a");
            navLinks.forEach(link => {
                if (link.innerHTML === "Home") {
                    link.addEventListener('click',function() {
                        smoothScrollHelper("banner",1000);
                    })
                }
                else if (link.innerHTML === "About") {
                    link.addEventListener('click',function() {
                        smoothScrollHelper("about",1000);
                    })
                }
                else if (link.innerHTML === "Menu") {
                    link.addEventListener('click',function() {
                        smoothScrollHelper("menu",1000);
                    })
                }
                else if (link.innerHTML === "Ordering") {
                    link.addEventListener('click',function() {
                        smoothScrollHelper("ordering",1000);
                    })
                }
            })
    
            // Move bar while scrolling
    
            const navHome = document.querySelector("#nav-home");
            const navAbout = document.querySelector("#nav-about");
            const navMenu = document.querySelector("#nav-menu");
            const navOrdering = document.querySelector("#nav-ordering");
            const activeNav = document.querySelector(".active-nav");
    
            
            window.onscroll = function() {
                if (!clicked) { // solves line movement bug
                    var top = window.scrollY;
                    const state = Flip.getState(activeNav);
                    if (top >= vh(310)){
                        navMenu.appendChild(activeNav);
                        Flip.from(state, {
                            duration:0.5,
                            absolute:true,
                            ease: 'elastic.out(0.5,0.5)'
                        });
                        navHome.style = "color: rgb(0, 0, 105)";
                        navMenu.style = "color: rgb(75, 75, 223)";
                        navAbout.style = "color: rgb(0, 0, 105)";
                        navOrdering.style = "color: rgb(0, 0, 105)";

                    }
                    else if (top >=vh(185)) {
                        navOrdering.appendChild(activeNav);
                        Flip.from(state, {
                            duration:0.5,
                            absolute:true,
                            ease: 'elastic.out(0.5,0.5)'
                        });
                        navHome.style = "color: rgb(0, 0, 105)";
                        navOrdering.style = "color: rgb(75, 75, 223)";
                        navAbout.style = "color: rgb(0, 0, 105)";
                        navMenu.style = "color: rgb(0, 0, 105)";
                    }
                    else if (top >= vh(90)) {
                        navAbout.appendChild(activeNav);
                        Flip.from(state, {
                            duration:0.5,
                            absolute:true,
                            ease: 'elastic.out(0.5,0.5)'
                        });
                        navHome.style = "color: rgb(0, 0, 105)";
                        navAbout.style = "color: rgb(75, 75, 223)";
                        navMenu.style = "color: rgb(0, 0, 105)";
                        navOrdering.style = "color: rgb(0, 0, 105)";
                    } else {
                        navHome.appendChild(activeNav);
                        Flip.from(state, {
                            duration:0.5,
                            absolute:true,
                            ease: 'elastic.out(0.5,0.5)'
                        });
                        navAbout.style = "color: rgb(0, 0, 105)";
                        navHome.style = "color: rgb(75, 75, 223)";
                        navMenu.style = "color: rgb(0, 0, 105)";
                        navOrdering.style = "color: rgb(0, 0, 105)";
                    }
                }
            }
            
        }
        smoothScrolls();
    }
    animationIn();
}

const app = () => {
    navEffects();
    scrollAnimation();
}

app();