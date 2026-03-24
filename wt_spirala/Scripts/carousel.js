function postaviCarousel(glavniElement, sviElementi, indeks = 0) {
    if (!glavniElement || !sviElementi.length || indeks < 0 || indeks >= sviElementi.length) {
        return null;
    }

    function prikaziElement() {
        glavniElement.innerHTML = sviElementi[indeks].outerHTML; 

    }

    function fnLijevo() {
        indeks = (indeks - 1 + sviElementi.length) % sviElementi.length; 
        prikaziElement();
    }

    function fnDesno() {
        indeks = (indeks + 1) % sviElementi.length; 
        prikaziElement();
    }

    prikaziElement();

    return {
        fnLijevo : fnLijevo,
        fnDesno : fnDesno
    };
}
