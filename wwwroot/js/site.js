document.addEventListener("DOMContentLoaded", () => {

    const line = document.querySelector(".hero-line");
    const buttons = document.querySelectorAll(".hero-btn");

    buttons[0].addEventListener("mouseenter", () => {
        line.style.transform = "translateX(-120px)";
        line.style.background = "#512bd4";
    });

    buttons[1].addEventListener("mouseenter", () => {
        line.style.transform = "translateX(0px)";
        line.style.background = "#58a6ff";
    });

    buttons[2].addEventListener("mouseenter", () => {
        line.style.transform = "translateX(120px)";
        line.style.background = "#22c55e";
    });

    document.querySelector(".hero-buttons")
        .addEventListener("mouseleave", () => {
            line.style.transform = "translateX(0px)";
        });
});