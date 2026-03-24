window.onload = function () {
  // Funkcija za ažuriranje menija na osnovu statusa prijave
  function updateMenuForLoginStatus(loggedIn) {
    const profilLink = document.getElementById('profilLink');
    const nekretnineLink = document.getElementById('nekretnineLink');
    const detaljiLink = document.getElementById('detaljiLink');
    const prijavaLink = document.getElementById('prijavaLink');
    const odjavaLink = document.getElementById('odjavaLink');
    const mojiUpitiLink = document.getElementById('mojiUpitiLink');
    const vijestiLink=document.getElementById('vijestiLink');

    if (loggedIn) {
      profilLink.style.display = 'block';
      nekretnineLink.style.display = 'block';
      detaljiLink.style.display = 'block';
      prijavaLink.style.display = 'none';
      odjavaLink.style.display = 'block';
      mojiUpitiLink.style.display = 'block';
      vijestiLink.style.display = 'none';
      
    } else {
      profilLink.style.display = 'none';
      nekretnineLink.style.display = 'block';
      detaljiLink.style.display = 'block';
      prijavaLink.style.display = 'block';
      odjavaLink.style.display = 'none';
      mojiUpitiLink.style.display = 'none';
      vijestiLink.style.display = 'none';

    }
  }

  // Pozivajte metodu za dobijanje korisnika kad se stranica učita
  PoziviAjax.getKorisnik(function (err, data) {
    const loggedIn = !(err || !data || !data.username);
    updateMenuForLoginStatus(loggedIn);
  });

  // Dodajte event listener za opciju "Odjava"
  const odjavaLink = document.getElementById('odjavaLink');
  odjavaLink.addEventListener('click', function () {
    PoziviAjax.postLogout(function (err) {
      if (err) {
        window.alert(err);
      } else {
        window.location.href = "http://localhost:3000/prijava.html";
      }
      updateMenuForLoginStatus(false);
    });
  });
};
