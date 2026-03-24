function postaviCarousel(glavniElement, sviElementi, brojElemenata = 3, pocetniIndeks = 0) {
    if (!glavniElement || !sviElementi.length || pocetniIndeks < 0 || pocetniIndeks >= sviElementi.length) {
        return null;
    }

    let indeks = pocetniIndeks;

    function prikaziGrupu() {
        glavniElement.innerHTML = "";
        for (let i = 0; i < brojElemenata; i++) {
            const trenutniIndeks = (indeks + i) % sviElementi.length;
            glavniElement.appendChild(sviElementi[trenutniIndeks]);
        }
    }

    function fnLijevo() {
        indeks = (indeks - brojElemenata + sviElementi.length) % sviElementi.length;
        prikaziGrupu();
    }

    function fnDesno() {
        indeks = (indeks + brojElemenata) % sviElementi.length;
        prikaziGrupu();
    }

    prikaziGrupu();

    return {
        fnLijevo,
        fnDesno,
    };
}

