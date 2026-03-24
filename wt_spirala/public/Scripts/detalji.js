document.addEventListener("DOMContentLoaded", () => {
    // Dohvatanje ID-a nekretnine iz URL-a
    const params = new URLSearchParams(window.location.search);
    const nekretninaId = params.get("id");

    if (!nekretninaId) {
        console.error("ID nekretnine nije prosleđen u URL-u.");
        document.body.innerHTML = `<p style="color: red;">Greška: ID nekretnine nije pronađen u URL-u.</p>`;
        return;
    }

    let trenutnaStranica = 0; // Pratimo stranicu upita
    let sviUpitiUcitani = false; // Zastavica za provjeru učitanih upita
    const ucitaneStranice = {}; // Keširamo učitane stranice

    const upitiDiv = document.querySelector("#upiti");

    function prikaziUpite(upiti) {
        upitiDiv.innerHTML = ""; // Očistimo trenutni prikaz
        upiti.forEach((upit) => {
            const upitElement = document.createElement("div");
            upitElement.className = "upit";
            upitElement.innerHTML = `<p><strong>Korisnik ${upit.korisnik_id}:</strong> ${upit.tekst_upita}</p>`;
            upitiDiv.appendChild(upitElement);
        });
    }

    function ucitajStranicu(page) {
        if (ucitaneStranice[page]) {
            // Ako je stranica već keširana, prikažemo je
            prikaziUpite(ucitaneStranice[page]);
        } else {
            // Ako nije keširana, pozivamo API da je učitamo
            PoziviAjax.getNextUpiti(nekretninaId, page, (error, upiti) => {
                if (error) {
                    if (error.status === 404) {
                        sviUpitiUcitani = true; // Nema više dostupnih stranica
                        console.info("Svi dostupni upiti su učitani.");
                    } else {
                        console.error("Greška prilikom dohvaćanja stranice upita:", error);
                    }
                    return;
                }

                if (upiti && upiti.length > 0) {
                    ucitaneStranice[page] = upiti; // Keširamo stranicu
                    prikaziUpite(upiti);
                } else {
                    sviUpitiUcitani = true;
                    console.info("Svi dostupni upiti su učitani.");
                }
            });
        }
    }

    function inicijalizujCarousel() {
        document.querySelector("#prevBtn").addEventListener("click", () => {
            if (trenutnaStranica > 1) {
                trenutnaStranica--; // Vraćamo se na prethodnu stranicu
                ucitajStranicu(trenutnaStranica);
            }
        });

        document.querySelector("#nextBtn").addEventListener("click", () => {
            if (!sviUpitiUcitani || ucitaneStranice[trenutnaStranica + 1]) {
                trenutnaStranica++; // Idemo na sljedeću stranicu
                ucitajStranicu(trenutnaStranica);
            }
        });
    }

    PoziviAjax.getNekretnina(nekretninaId, (error, nekretnina) => {
        if (error) {
            console.error("Greška prilikom dohvaćanja detalja nekretnine:", error);
            document.body.innerHTML = `<p style="color: red;">Greška prilikom učitavanja detalja nekretnine.</p>`;
            return;
        }

        // Prikaz osnovnih podataka o nekretnini
        document.querySelector("#osnovno").innerHTML = `
            <img class="slika-nekretnine" src="../Resources/${nekretnina.id}.jpg" alt="${nekretnina.naziv}">
            <p><strong>Naziv:</strong> ${nekretnina.naziv}</p>
            <p><strong>Kvadratura:</strong> ${nekretnina.kvadratura} m²</p>
            <p><strong>Cijena:</strong> ${nekretnina.cijena.toLocaleString()} KM</p>
        `;

        // Prikaz dodatnih detalja o nekretnini
        document.querySelector("#detalji").innerHTML = `
            <div id="kolona1">
                <p><strong>Tip grijanja:</strong> ${nekretnina.tip_grijanja}</p>
                <p><strong>Lokacija:</strong> <a id="lokacija-link" href="nekretnine.html?lokacija=${encodeURIComponent(nekretnina.lokacija)}">${nekretnina.lokacija}</a></p>
            </div>
            <div id="kolona2">
                <p><strong>Godina izgradnje:</strong> ${nekretnina.godina_izgradnje}</p>
                <p><strong>Datum objave oglasa:</strong> ${nekretnina.datum_objave}</p>
            </div>
            <div id="opis">
                <p><strong>Opis:</strong> ${nekretnina.opis}</p>
            </div>
        `;

        // Prikaz početnih upita
        if (nekretnina.upiti) {
            ucitaneStranice[0] = nekretnina.upiti; // Keširamo početnu stranicu
            prikaziUpite(nekretnina.upiti);
        }

        inicijalizujCarousel(); // Inicijalizujemo carousel
    });
});
