document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM potpuno učitan.");

    const glavniElement = document.querySelector("#upiti");
    const sviElementi = Array.from(document.querySelectorAll("#upiti .upit"));
    const dugmeLijevo = document.querySelector("#prevBtn");
    const dugmeDesno = document.querySelector("#nextBtn");

    console.log("Glavni element:", glavniElement);
    console.log("Svi elementi:", sviElementi);
    console.log("Dugmad:", { dugmeLijevo, dugmeDesno });

    const carousel = postaviCarousel(glavniElement, sviElementi);

    if (carousel) {
        dugmeLijevo.addEventListener("click", () => {
            carousel.fnLijevo();
        });
        dugmeDesno.addEventListener("click", () => {
            carousel.fnDesno();
        });
    } 
});
