console.log(listaNekretnina);  
console.log(listaKorisnika);   

let statistika = StatistikaNekretnina();
statistika.init(listaNekretnina, listaKorisnika);

   
const korisnikSelect = document.getElementById('odaberiKorisnika'); 
listaKorisnika.forEach(korisnik => { 
    const option = document.createElement('option'); 
    option.value = korisnik.username; 
    option.text = `${korisnik.ime} ${korisnik.prezime}`; 
    korisnikSelect.add(option); 
});

document.getElementById('filter-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const kriterijSelect = document.getElementById('kriterij');
    const odabraniKriterij = kriterijSelect.value;
    const vrijednost = document.getElementById('vrijednost').value;
    const kriterij = {};
    kriterij[odabraniKriterij] = vrijednost;
    const rezultat = statistika.prosjecnaKvadratura(kriterij);
    document.getElementById('prosjecnaKvadratura').innerText = rezultat;
});


document.getElementById('outlier-form').addEventListener('submit', function(event) { 
    event.preventDefault(); 
    const kriterijSelect = document.getElementById('outlier-kriterij');
    const odabraniKriterij = kriterijSelect.value;
    const vrijednost = document.getElementById('outlier-vrijednost').value; 
    const nazivSvojstvaSelect = document.getElementById('nazivSvojstva'); 
    const nazivSvojstva = nazivSvojstvaSelect.value;
    const kriterij = {}; 
    kriterij[odabraniKriterij] = vrijednost; 
    const rezultat2 = statistika.outlier(kriterij, nazivSvojstva);
    if (rezultat2) {
        document.getElementById('outlier').innerText = `
            ID: ${rezultat2.id},
            Tip nekretnine: ${rezultat2.tip_nekretnine},
            Naziv: ${rezultat2.naziv},
            Kvadratura: ${rezultat2.kvadratura},
            Cijena: ${rezultat2.cijena},
            Tip grijanja: ${rezultat2.tip_grijanja},
            Lokacija: ${rezultat2.lokacija},
            Godina izgradnje: ${rezultat2.godina_izgradnje},
            Datum objave: ${rezultat2.datum_objave},
            Opis: ${rezultat2.opis}
        `;
    } else {
        document.getElementById('outlier').innerText = 'Nema rezultata koji zadovoljavaju kriterij.';
    }
});




document.getElementById('korisnik-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const korisnikSelect = document.getElementById('odaberiKorisnika');
    const odabraniKorisnik = korisnikSelect.value;
    const korisnik = listaKorisnika.find(korisnik => korisnik.username === odabraniKorisnik);
    if (!korisnik) {
        document.getElementById('mojeNekretnine').innerText = 'Korisnik nije pronađen.';
        return;
    }
    const rezultat3 = statistika.mojeNekretnine(korisnik);
    const rezultatTekst = rezultat3.map(nekretnina => ` 
        ID: ${nekretnina.id}, 
        Tip nekretnine: ${nekretnina.tip_nekretnine}, 
        Naziv: ${nekretnina.naziv}, 
        Kvadratura: ${nekretnina.kvadratura}, 
        Cijena: ${nekretnina.cijena}, 
        Tip grijanja: ${nekretnina.tip_grijanja}, 
        Lokacija: ${nekretnina.lokacija}, 
        Godina izgradnje: ${nekretnina.godina_izgradnje}, 
        Datum objave: ${nekretnina.datum_objave}, 
        Opis: ${nekretnina.opis} 
        
    `).join('\n\n'); 
    
    document.getElementById('mojeNekretnine').innerText = rezultatTekst; });




    document.getElementById('histogram-form').addEventListener('submit', function(event) {
        event.preventDefault();
        let periodi = [];
        document.querySelectorAll('.period').forEach((periodElement, index) => {
            const od = parseInt(periodElement.querySelector('[name="period-od"]').value, 10);
            const do1 = parseInt(periodElement.querySelector('[name="period-do"]').value, 10);
            periodi.push({ od, do: do1 });
        });
        let rasponiCijena = [];
        document.querySelectorAll('.raspon').forEach((rasponElement, index) => {
            const od = parseInt(rasponElement.querySelector('[name="raspon-od"]').value, 10);
            const do1 = parseInt(rasponElement.querySelector('[name="raspon-do"]').value, 10);
            rasponiCijena.push({ od, do: do1 });
        });
        const rezultat4 = statistika.histogramCijena(periodi, rasponiCijena);
        const rezultatTekst = rezultat4.map(item => `
            Indeks perioda: ${item.indeksPerioda},
            Indeks raspona cijena: ${item.indeksRasponaCijena},
            Broj nekretnina: ${item.brojNekretnina}
        `).join('\n\n');
        document.getElementById('histogramRezultat').innerText = rezultatTekst;

        const histogramPodaci = statistika.histogramCijena(periodi, rasponiCijena);

        iscrtajHistogram(periodi, rasponiCijena, histogramPodaci);
    });



    function iscrtajHistogram(periodi, rasponiCijena, histogramPodaci) {
        const ctx = document.getElementById('histogramCanvas').getContext('2d');
    
        const labels = rasponiCijena.map(raspon => `${raspon.od} - ${raspon.do}`);
        const datasets = periodi.map((period, indeks) => {
            const data = rasponiCijena.map((_, indeksRasponaCijena) => {
                const item = histogramPodaci.find(h => h.indeksPerioda === indeks && h.indeksRasponaCijena === indeksRasponaCijena);
                return item ? item.brojNekretnina : 0;
            });
            return {
                label: `Period ${period.od}-${period.do}`,
                data: data,
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
                borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                borderWidth: 1
            };
        });
    
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Rasponi cijena'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Broj nekretnina'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }
    

    function dodajPeriod() {
        const periodContainer = document.getElementById('periodi');
        const newPeriod = document.createElement('div');
        newPeriod.className = 'period';
        newPeriod.innerHTML = `
            <input type="number" name="period-od" placeholder="Od" required>
            <input type="number" name="period-do" placeholder="Do" required>
        `;
        periodContainer.appendChild(newPeriod);
    }

    function dodajRaspon() {
        const rasponContainer = document.getElementById('rasponi');
        const newRaspon = document.createElement('div');
        newRaspon.className = 'raspon';
        newRaspon.innerHTML = `
            <input type="number" name="raspon-od" placeholder="Od" required>
            <input type="number" name="raspon-do" placeholder="Do" required>
        `;
        rasponContainer.appendChild(newRaspon);
    }


