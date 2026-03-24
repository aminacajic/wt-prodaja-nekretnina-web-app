# Web aplikacija za prodaju nekretnina - Projekat (WT 2024/25)

Ovo je repozitorij full-stack projekta razvijenog u okviru predmeta **Web tehnologije** na Elektrotehničkom fakultetu u Sarajevu.

Aplikacija omogućava pregled i prodaju nekretnina. Razvoj je sproveden kroz četiri faze (spirale), postepeno gradeći kompletan sistem sa frontend-om, backend-om i bazom podataka, prema definisanim specifikacijama.

---

## Ključne Funkcionalnosti i Faze Razvoja

Projekt je strukturiran po granama koje prate evoluciju aplikacije. Finalna, stabilna verzija se nalazi na **`main`** grani.

### Spirala 1: Statistički interfejs & responzivnost
* Implementirane statične HTML/CSS stranice (Početna, Nekretnine, Detalji, Vijesti).
* Primijenjen responzivni dizajn (Mobile-First) koristeći CSS Grid i Flexbox.
* Integrisan meni sa animiranim ikonicama i CSS tranzicijama.

### Spirala 2: Dinamika klijenta & analitika
* Razvijen funkcionalan *carousel* (galerija slika) koristeći klijentski JavaScript.
* Implementirani JavaScript moduli za statističku obradu podataka nekretnina (prosjeci, histogrami).
* Integrisana biblioteka Chart.js za vizuelizaciju histograma cijena.

### Spirala 3: Backend REST API & AJAX
* Kreiran RESTful server koristeći Node.js i Express framework.
* Implementiran REST API koji radi sa JSON datotekama (autentifikacija, upiti, detalji).
* Frontend i backend povezani putem AJAX zahtjeva, uz implementaciju paginacije upita.
* Dodana sigurnosna blokada (rate-limiting) za login nakon višestrukih neuspješnih pokušaja.

### Spirala 4: Migracija na bazu podataka 
* Izvršena potpuna migracija perzistentnosti na MySQL bazu podataka.
* Implementirani složeni Sequelize ORM modeli i relacije (Korisnik, Nekretnina, Upit, Zahtjev, Ponuda).
* Razvijene rute za naprednu interakciju: davanje vezanih cjenovnih ponuda, zakazivanje zahtjeva za pregled.
* Definisana granularna prava pristupa (obični korisnik vs. administrator) za osjetljive podatke.

---

## Tehnološki stack

* **Frontend**: HTML5, CSS3, JavaScript (ES6+), Chart.js.
* **Backend**: Node.js, Express.
* **Baza podataka**: MySQL, Sequelize ORM.

---

## :link: Mirror repozitorij

Ovaj projekat je također dostupan i na Bitbucketu:
[Link na Bitbucket repozitorij](https://bitbucket.org/aminacajic/wt24p19218/src/master/)

***

