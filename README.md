# Web aplikacija za prodaju nekretnina - Projekat (WT 2024/25)

## :link: Mirror repozitorij

Ovaj projekat je također dostupan i na Bitbucketu:
[Link na Bitbucket repozitorij](https://bitbucket.org/aminacajic/wt24p19218/src/master/)

---

Ovo je repozitorij full-stack projekta razvijenog u okviru predmeta **Web tehnologije** na Elektrotehničkom fakultetu u Sarajevu.

Aplikacija omogućava pregled i prodaju nekretnina. Razvoj je sproveden kroz četiri faze (spirale), postepeno gradeći kompletan sistem sa frontend-om, backend-om i bazom podataka, prema definisanim specifikacijama.

---
## Ključne funkcionalnosti i faze razvoja

Projekt je strukturiran po granama koje prate evoluciju aplikacije. Finalna verzija se nalazi na **`main`** grani.

### Spirala 1: Statički interfejs & responzivnost
* Implementirane statične HTML/CSS stranice: **Početna, Nekretnine, Detalji, Vijesti**.
* Primijenjen responzivni dizajn (Mobile-First) koristeći CSS tehnike (**CSS Grid, Flexbox**).
* Integrisan meni sa animiranim ikonicama i CSS tranzicijama.

### Spirala 2: Dinamika klijenta & analitika
* Razvijen *carousel* (galerija slika) na stranici detalja koristeći klijentski JavaScript.
* Implementirani JavaScript moduli za statističku obradu podataka nekretnina (**prosječna kvadratura, histogram cijena**).
* Integrisana biblioteka Chart.js za vizuelizaciju histograma cijena.

### Spirala 3: Backend REST API & AJAX
* Kreiran RESTful server koristeći **Node.js** i **Express** framework.
* Implementiran REST API koji radi sa JSON datotekama, pokrivajući:
    * Autentifikaciju korisnika (login).
    * Upravljanje upitima.
    * Učitavanje detalja nekretnine.
* Frontend i backend povezani putem **AJAX zahtjeva**.
* Implementirana paginacija upita za optimizovan prikaz.
* Dodana sigurnosna blokada (**rate-limiting**) za login nakon višestrukih neuspješnih pokušaja.

### Spirala 4: Migracija na bazu podataka (`master` grana)
* Izvršena potpuna migracija perzistentnosti podataka sa JSON datoteka na **MySQL** bazu podataka.
* Implementirani složeni **Sequelize ORM** modeli i relacije (**Korisnik, Nekretnina, Upit, Zahtjev, Ponuda**).
* Razvijene rute za naprednu interakciju sa nekretninama:
    * **Davanje cjenovnih ponuda** (kreiranje vezanih nizova ponuda).
    * **Zakazivanje zahtjeva za pregled**.
* Definisana granularna prava pristupa (obični korisnik vs. administrator) za osjetljive podatke.
* Dodana mogućnost administratorima da odgovaraju na zahtjeve i ponude.

---

## Korištene tehnologije

* **Frontend**: HTML5, CSS3, JavaScript (ES6+), Chart.js.
* **Backend**: Node.js, Express.
* **Baza podataka**: MySQL, Sequelize ORM.

***

