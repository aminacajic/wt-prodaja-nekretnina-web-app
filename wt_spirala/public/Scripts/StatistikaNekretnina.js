let StatistikaNekretnina = function () {
    let spisakNekretnina;


    let init = function (listaNekretnina, listaKorisnika) {
        spisakNekretnina = SpisakNekretnina(); 
        spisakNekretnina.init(listaNekretnina, listaKorisnika); 
    };


    let prosjecnaKvadratura = function (kriterij) {
        let filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine(kriterij);
        if (filtriraneNekretnine.length === 0) return 0;

        let ukupnaKvadratura = filtriraneNekretnine.reduce((suma, nekretnina) => suma + nekretnina.kvadratura, 0);
        return ukupnaKvadratura / filtriraneNekretnine.length;
    };


    let outlier = function (kriterij, nazivSvojstva) {
        let filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine(kriterij);
        if (filtriraneNekretnine.length === 0) return null;
    
        let sveNekretnine = spisakNekretnina.filtrirajNekretnine({});
        let sumaSvojstva = sveNekretnine.reduce((suma, nekretnina) => suma + nekretnina[nazivSvojstva], 0);
        let srednjaVrijednost = sumaSvojstva / sveNekretnine.length;
        let najveceOdstupanje = 0;
        let outlierNekretnina = null;
        filtriraneNekretnine.forEach(nekretnina => {
            let vrijednostSvojstva = nekretnina[nazivSvojstva];
            let odstupanje = Math.abs(vrijednostSvojstva - srednjaVrijednost);    
            if (odstupanje > najveceOdstupanje) {
                najveceOdstupanje = odstupanje;
                outlierNekretnina = nekretnina;
            }
        }); 
        return outlierNekretnina;
    }; 

    
    let mojeNekretnine = function (korisnik) { 
        let korisnikId = korisnik.id; 
        let filtriraneNekretnine = spisakNekretnina.filtrirajNekretnine({}); 
        let povezaneNekretnine = filtriraneNekretnine.filter(nekretnina => 
            nekretnina.upiti.some(upit => upit.korisnik_id === korisnikId) 
        );  
        return povezaneNekretnine.sort((a, b) => b.upiti.length - a.upiti.length); 
    };


    let histogramCijena = function (periodi, rasponiCijena) {
        let sveNekretnine = spisakNekretnina.filtrirajNekretnine({});
        let histogram = [];
    
        periodi.forEach((period, indeksPerioda) => {
            let nekretnineUPeriodu = sveNekretnine.filter(nekretnina => {
                let godinaObjave = parseInt(nekretnina.datum_objave.split(".")[2], 10);
                return godinaObjave >= period.od && godinaObjave <= period.do;
            });
    
            rasponiCijena.forEach((raspon, indeksRasponaCijena) => {
                let brojNekretnina = nekretnineUPeriodu.filter(nekretnina => {
                    let cijena = parseFloat(nekretnina.cijena);
                    return cijena >= raspon.od && cijena <= raspon.do;
                }).length;
    
                histogram.push({
                    indeksPerioda: indeksPerioda,
                    indeksRasponaCijena: indeksRasponaCijena,
                    brojNekretnina: brojNekretnina,
                });
            });
        });  
        return histogram;
    };

    return {
        init: init,
        prosjecnaKvadratura: prosjecnaKvadratura,
        outlier: outlier,
        mojeNekretnine: mojeNekretnine,
        histogramCijena: histogramCijena
    };
};
