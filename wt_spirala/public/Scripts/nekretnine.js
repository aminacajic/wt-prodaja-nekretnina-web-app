
/*
function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    // Pozivanje metode za filtriranje
    const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });

    // Čišćenje svih elemenata liste
    divReferenca.innerHTML = '';

    if (filtriraneNekretnine.length === 0) {
        divReferenca.innerHTML = '<p>Trenutno nema dostupnih nekretnina ovoga tipa.</p>';
    } else {
        filtriraneNekretnine.forEach(nekretnina => {
            const nekretninaElement = document.createElement('div');
            nekretninaElement.classList.add('nekretnina');

            // Dodavanje specifične klase na osnovu tipa nekretnine
            if (tip_nekretnine === "Stan") {
                nekretninaElement.classList.add('stan');
            } else if (tip_nekretnine === "Kuća") {
                nekretninaElement.classList.add('kuca');
            } else if (tip_nekretnine === "Poslovni prostor") {
                nekretninaElement.classList.add('pp');
            }

            // Kreiranje sadržaja za nekretninu
            const slikaElement = document.createElement('img');
            slikaElement.classList.add('slika-nekretnine');
            slikaElement.src = `../Resources/${nekretnina.id}.jpg`;
            slikaElement.alt = nekretnina.naziv;
            nekretninaElement.appendChild(slikaElement);

            const detaljiElement = document.createElement('div');
            detaljiElement.classList.add('detalji-nekretnine');
            detaljiElement.innerHTML = `
                <h3>${nekretnina.naziv}</h3>
                <p>Kvadratura: ${nekretnina.kvadratura} m²</p>
            `;
            nekretninaElement.appendChild(detaljiElement);

            const cijenaElement = document.createElement('div');
            cijenaElement.classList.add('cijena-nekretnine');
            cijenaElement.innerHTML = `<p>Cijena: ${nekretnina.cijena.toLocaleString()} BAM</p>`;
            nekretninaElement.appendChild(cijenaElement);

            const detaljiDugme = document.createElement('a');
            detaljiDugme.classList.add('detalji-dugme');
            detaljiDugme.textContent = 'Detalji';

            // Event listener za otvaranje detalja nekretnine
            detaljiDugme.addEventListener('click', function (event) {
                event.preventDefault();
                const idNekretnine = nekretnina.id;
                window.location.href = `../HTML/detalji.html?id=${idNekretnine}`;
            });

            nekretninaElement.appendChild(detaljiDugme);

            // Dodavanje kreiranog elementa u divReferenca
            divReferenca.appendChild(nekretninaElement);
        });
    }
}

const listaKorisnika = [];
const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

// Instanciranje modula
let nekretnine = SpisakNekretnina();

// Dohvatanje lokacije iz URL-a (za top 5 nekretnina)
const params = new URLSearchParams(window.location.search);
const lokacija = params.get("lokacija");

if (lokacija) {
    // Prikazivanje top 5 nekretnina za određenu lokaciju
    document.querySelector("#lokacija-naslov").textContent = lokacija;

    PoziviAjax.getTop5Nekretnina(lokacija, (error, listaNekretnina) => {
        if (error) {
            console.error("Greška prilikom dohvatanja top 5 nekretnina:", error);
        } else {
            nekretnine.init(listaNekretnina, listaKorisnika);
            spojiNekretnine(divStan, nekretnine, "Stan");
            spojiNekretnine(divKuca, nekretnine, "Kuća");
            spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
        }
    });
} else {
    // Prikazivanje svih nekretnina
    PoziviAjax.getNekretnine((error, listaNekretnina) => {
        if (error) {
            console.error("Greška prilikom dohvatanja svih nekretnina:", error);
        } else {
            nekretnine.init(listaNekretnina, listaKorisnika);
            spojiNekretnine(divStan, nekretnine, "Stan");
            spojiNekretnine(divKuca, nekretnine, "Kuća");
            spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
        }
    });
}

function filtrirajNekretnine(filtriraneNekretnine) {
    const filtriraneNekretnineInstance = SpisakNekretnina();
    filtriraneNekretnineInstance.init(filtriraneNekretnine, listaKorisnika);

    spojiNekretnine(divStan, filtriraneNekretnineInstance, "Stan");
    spojiNekretnine(divKuca, filtriraneNekretnineInstance, "Kuća");
    spojiNekretnine(divPp, filtriraneNekretnineInstance, "Poslovni prostor");
}

document.getElementById('dugmePretraga').addEventListener('click', () => {
    const kriterij = {
        min_cijena: parseFloat(document.getElementById('minCijena').value) || 0,
        max_cijena: parseFloat(document.getElementById('maxCijena').value) || Infinity,
        min_kvadratura: parseFloat(document.getElementById('minKvadratura').value) || 0,
        max_kvadratura: parseFloat(document.getElementById('maxKvadratura').value) || Infinity
    };

    const filtriraneNekretnine = nekretnine.filtrirajNekretnine(kriterij);
    filtrirajNekretnine(filtriraneNekretnine);
});

setInterval(() => {
    MarketingAjax.osvjeziPretrage(document.getElementById('divNekretnine'));
    MarketingAjax.osvjeziKlikove(document.getElementById('divNekretnine'));
}, 500);


*/



// Dohvatanje referenci na elemente u HTML-u
const naslovTop5 = document.getElementById("naslov-top5");
const lokacijaNaslov = document.getElementById("lokacija-naslov");
const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");
const dugmePretraga = document.getElementById("dugmePretraga");

// Instanciranje modula
const nekretnine = SpisakNekretnina();
const listaKorisnika = [];

// Dohvatanje lokacije iz URL-a (za top 5 nekretnina)
const params = new URLSearchParams(window.location.search);
const lokacija = params.get("lokacija");

if (lokacija) {
    // Prikazivanje top 5 nekretnina za određenu lokaciju
    lokacijaNaslov.textContent = lokacija;
    naslovTop5.style.display = "block"; // Prikaži naslov

    PoziviAjax.getTop5Nekretnina(lokacija, (error, listaNekretnina) => {
        if (error) {
            console.error("Greška prilikom dohvatanja top 5 nekretnina:", error);
        } else {
            nekretnine.init(listaNekretnina, listaKorisnika);
            spojiNekretnine(divStan, nekretnine, "Stan");
            spojiNekretnine(divKuca, nekretnine, "Kuća");
            spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
        }
    });
} else {
    // Skrivanje naslova jer se prikazuju sve nekretnine
    naslovTop5.style.display = "none";

    PoziviAjax.getNekretnine((error, listaNekretnina) => {
        if (error) {
            console.error("Greška prilikom dohvatanja svih nekretnina:", error);
        } else {
            nekretnine.init(listaNekretnina, listaKorisnika);
            spojiNekretnine(divStan, nekretnine, "Stan");
            spojiNekretnine(divKuca, nekretnine, "Kuća");
            spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
        }
    });
}

function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    // Pozivanje metode za filtriranje
    const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine });

    // Čišćenje svih elemenata liste
    divReferenca.innerHTML = '';

    if (filtriraneNekretnine.length === 0) {
        divReferenca.innerHTML = '<p>Trenutno nema dostupnih nekretnina ovoga tipa.</p>';
    } else {
        filtriraneNekretnine.forEach(nekretnina => {
            const nekretninaElement = document.createElement('div');
            nekretninaElement.classList.add('nekretnina');

            // Dodavanje specifične klase na osnovu tipa nekretnine
            if (tip_nekretnine === "Stan") {
                nekretninaElement.classList.add('stan');
            } else if (tip_nekretnine === "Kuća") {
                nekretninaElement.classList.add('kuca');
            } else if (tip_nekretnine === "Poslovni prostor") {
                nekretninaElement.classList.add('pp');
            }

            // Kreiranje sadržaja za nekretninu
            const slikaElement = document.createElement('img');
            slikaElement.classList.add('slika-nekretnine');
            slikaElement.src = `../Resources/${nekretnina.id}.jpg`;
            slikaElement.alt = nekretnina.naziv;
            nekretninaElement.appendChild(slikaElement);

            const detaljiElement = document.createElement('div');
            detaljiElement.classList.add('detalji-nekretnine');
            detaljiElement.innerHTML = `
                <h3>${nekretnina.naziv}</h3>
                <p>Kvadratura: ${nekretnina.kvadratura} m²</p>
            `;
            nekretninaElement.appendChild(detaljiElement);

            const cijenaElement = document.createElement('div');
            cijenaElement.classList.add('cijena-nekretnine');
            cijenaElement.innerHTML = `<p>Cijena: ${nekretnina.cijena.toLocaleString()} BAM</p>`;
            nekretninaElement.appendChild(cijenaElement);

            const detaljiDugme = document.createElement('a');
            detaljiDugme.classList.add('detalji-dugme');
            detaljiDugme.textContent = 'Detalji';

            // Event listener za otvaranje detalja nekretnine
            detaljiDugme.addEventListener('click', function (event) {
                event.preventDefault();
                const idNekretnine = nekretnina.id;
                window.location.href = `../HTML/detalji.html?id=${idNekretnine}`;
            });

            nekretninaElement.appendChild(detaljiDugme);

            // Dodavanje kreiranog elementa u divReferenca
            divReferenca.appendChild(nekretninaElement);
        });
    }
}

dugmePretraga.addEventListener('click', () => {
    const kriterij = {
        min_cijena: parseFloat(document.getElementById('minCijena').value) || 0,
        max_cijena: parseFloat(document.getElementById('maxCijena').value) || Infinity,
        min_kvadratura: parseFloat(document.getElementById('minKvadratura').value) || 0,
        max_kvadratura: parseFloat(document.getElementById('maxKvadratura').value) || Infinity
    };

    const filtriraneNekretnine = nekretnine.filtrirajNekretnine(kriterij);
    spojiNekretnine(divStan, nekretnine, "Stan");
    spojiNekretnine(divKuca, nekretnine, "Kuća");
    spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
});

setInterval(() => {
    MarketingAjax.osvjeziPretrage(document.getElementById('divNekretnine'));
    MarketingAjax.osvjeziKlikove(document.getElementById('divNekretnine'));
}, 500);