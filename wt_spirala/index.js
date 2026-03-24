const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs").promises;
const bcrypt = require("bcrypt");
const db = require("./data/db");
const app = express();
const PORT = 3000;

app.use(
  session({
    secret: "tajna sifra",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.static(__dirname + "/public"));

app.use(express.json());

async function serveHTMLFile(req, res, fileName) {
  const htmlPath = path.join(__dirname, "public/html", fileName);
  try {
    const content = await fs.readFile(htmlPath, "utf-8");
    res.send(content);
  } catch (error) {
    console.error("Error serving HTML file:", error);
    res.status(500).json({ greska: "Internal Server Error" });
  }
}

const routes = [
  { route: "/nekretnine.html", file: "nekretnine.html" },
  { route: "/detalji.html", file: "detalji.html" },
  { route: "/meni.html", file: "meni.html" },
  { route: "/prijava.html", file: "prijava.html" },
  { route: "/profil.html", file: "profil.html" },
];

routes.forEach(({ route, file }) => {
  app.get(route, async (req, res) => {
    await serveHTMLFile(req, res, file);
  });
});

async function readJsonFile(filename) {
  const filePath = path.join(__dirname, "data", `${filename}.json`);
  try {
    const rawdata = await fs.readFile(filePath, "utf-8");
    return JSON.parse(rawdata);
  } catch (error) {
    throw error;
  }
}

async function saveJsonFile(filename, data) {
  const filePath = path.join(__dirname, "data", `${filename}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    throw error;
  }
}

const loginAttempts = {};

async function logAttempt(username, status) {
  const logEntry = `[${new Date().toISOString()}] - username: "${username}" - status: "${status}"
`;
  const logPath = path.join(__dirname, "data", "prijave.txt");
  await fs.appendFile(logPath, logEntry);
}

app.post("/login", async (req, res) => {
  const jsonObj = req.body;

  if (!jsonObj.username || !jsonObj.password) {
    return res
      .status(400)
      .json({ greska: "Username and password are required." });
  }

  const username = jsonObj.username;

  if (!loginAttempts[username]) {
    loginAttempts[username] = { count: 0, blockUntil: null };
  }

  const userAttempt = loginAttempts[username];
  const now = Date.now();

  if (userAttempt.blockUntil && now < userAttempt.blockUntil) {
    return res.status(429).json({
      greska: "Previse neuspjesnih pokusaja. Pokusajte ponovo za 1 minutu.",
    });
  }
  let found = false;
  try {
    const korisnik = await db.korisnik.findOne({
      where: { username },
    });
    const isPasswordMatched = await bcrypt.compare(
      jsonObj.password,
      korisnik.password
    );

    if (isPasswordMatched) {
      req.session.username = korisnik.username;
      userAttempt.count = 0;
      userAttempt.blockUntil = null;
      found = true;
      await logAttempt(username, "uspješno");
      return res.status(200).json({ poruka: "Uspješna prijava" });
    }
    console.log("Dosao do ovdje");

    if (!found) {
      userAttempt.count += 1;
      await logAttempt(username, "neuspješno");

      if (userAttempt.count >= 3) {
        userAttempt.blockUntil = now + 60000;
        return res.status(429).json({
          greska: "Previse neuspjesnih pokusaja. Pokusajte ponovo za 1 minutu.",
        });
      }
      return res.status(401).json({ greska: "Invalid credentials." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ greska: "Internal Server Error" });
  }
});

app.post("/logout", (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: "Neautorizovan pristup" });
  }
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      res.status(500).json({ greska: "Internal Server Error" });
    } else {
      res.status(200).json({ poruka: "Uspješno ste se odjavili" });
    }
  });
});

app.get("/nekretnine/top5", async (req, res) => {
  const { lokacija } = req.query;

  if (!lokacija) {
    return res.status(400).json({ greska: "Lokacija je obavezna." });
  }

  try {
    let properties = await db.nekretnina.findAll({
      include: {
        model: db.upit,
        as: "upiti", // Include the "upiti" relation
        attributes: ["KorisnikId", "tekst"], // Select relevant fields from the "upit" model
      },
    });

    properties = properties.map((p) => p.dataValues);

    const filteredProperties = properties.filter(
      (property) => property.lokacija.toLowerCase() === lokacija.toLowerCase()
    );

    const sortedProperties = filteredProperties.sort((a, b) => {
      const dateA = new Date(a.datum_objave);
      const dateB = new Date(b.datum_objave);
      return dateB - dateA;
    });

    const top5Properties = sortedProperties.slice(0, 5);

    res.status(200).json(top5Properties);
  } catch (error) {
    console.error("Greška prilikom čitanja ili obrade podataka:", error);
    res.status(500).json({ greska: "Došlo je do greške na serveru." });
  }
});

app.get("/korisnik", async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: "Neautorizovan pristup" });
  }

  const username = req.session.username;

  try {
    const user = await db.korisnik.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ greska: "Neautorizovan pristup" });
    }

    const userData = {
      id: user.id,
      ime: user.ime,
      prezime: user.prezime,
      username: user.username,
      password: user.password,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ greska: "Internal Server Error" });
  }
});

app.post("/upit", async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: "Neautorizovan pristup" });
  }

  const username = req.session.username;
  const { nekretnina_id, tekst_upita } = req.body;

  if (!nekretnina_id || !tekst_upita) {
    return res.status(400).json({ greska: "Nedostaju obavezni podaci." });
  }

  try {
    const loggedInUser = await db.korisnik.findOne({
      where: { username },
    });

    if (!loggedInUser) {
      return res.status(401).json({ greska: "Neautorizovan pristup" });
    }

    const nekretnina = db.nekretnina.findOne({
      where: {
        id: parseInt(nekretnina_id),
      },
    });

    if (!nekretnina) {
      return res
        .status(404)
        .json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji.` });
    }

    nekretnina.upiti = nekretnina.upiti || [];
    const userQueries = nekretnina.upiti.filter(
      (upit) => upit.korisnik_id === loggedInUser.id
    );

    if (userQueries.length >= 3) {
      return res
        .status(429)
        .json({ greska: "Previse upita za istu nekretninu." });
    }

    db.upit.create({
      KorisnikId: loggedInUser.id,
      NekretninaId: parseInt(nekretnina_id),
      tekst: tekst_upita,
    });

    res.status(200).json({ poruka: "Upit je uspješno dodan." });
  } catch (error) {
    console.error("Greška prilikom obrade upita:", error);
    res.status(500).json({ greska: "Došlo je do greške na serveru." });
  }
});

app.get("/upiti/moji", async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: "Neautorizovan pristup" });
  }

  const username = req.session.username;

  try {
    // Finding the korisnik (user) by username
    const korisnik = await db.korisnik.findOne({
      where: { username },
      include: {
        model: db.upit,
        as: "upiti", // The alias for the upiti relationship with korisnik
        attributes: ["id", "tekst", "NekretninaId"], // Only fetch the 'id' and 'tekst' from upit
      },
    });

    // If korisnik not found, return error
    if (!korisnik) {
      return res.status(401).json({ greska: "Neautorizovan pristup" });
    }
    // Mapping upiti to include necessary information
    const userQueries = korisnik.upiti.map((upit) => ({
      id_nekretnine: upit.NekretninaId,
      tekst_upita: upit.tekst,
    }));

    // If no queries are found, return an empty array
    if (userQueries.length === 0) {
      return res.status(404).json([]); // Prazan niz ako nema upita
    }

    // Returning the user queries
    res.status(200).json(userQueries);
  } catch (error) {
    console.error("Greška prilikom dohvaćanja upita korisnika:", error);
    res.status(500).json({ greska: "Internal Server Error" });
  }
});

//dodano
// Ruta: /nekretnina/:id
app.get("/nekretnina/:id", function (req, res) {
  const id = parseInt(req.params.id);
  try {
    db.nekretnina
      .findOne({
        where: { id },
      })
      .then((nekretnina) => {
        if (!nekretnina) {
          return res.status(404).json({ greska: "Nekretnina nije pronađena." });
        }

        db.upit
          .findAll({
            where: { NekretninaId: nekretnina.dataValues.id },
          })
          .then(async (upiti) => {
            upiti = upiti.map((u) => u.dataValues);

            // Adding the associated 'username' from the 'korisnik' table
            await Promise.all(
              upiti.map(async (upit, j) => {
                const korisnik = await db.korisnik.findOne({
                  where: { id: upit.KorisnikId },
                });

                if (korisnik) {
                  upiti[j].user = korisnik.dataValues.username;
                }
              })
            );

            const lastThreeUpiti = upiti.slice(-3).map((upit) => {
              return {
                korisnik_id: upit.KorisnikId,
                tekst_upita: upit.tekst,
              };
            });
            nekretnina.dataValues.upiti = lastThreeUpiti;

            res.status(200).json(nekretnina);
          });
      });
  } catch (err) {
    console.error("Greška:", err);
    res.status(500).json({ greska: "Greška na serveru." });
  }
});

app.get("/next/upiti/nekretnina/:id", async (req, res) => {
  const { id } = req.params;
  const { page } = req.query;

  if (!page || isNaN(page) || page < 0) {
    return res.status(400).json({
      greska: "Neispravan broj stranice. PAGE mora biti >= 0.",
    });
  }

  try {
    const nekretnina = await db.nekretnina.findOne({
      where: { id },
    });

    if (!nekretnina) {
      return res.status(404).json({ greska: "Nekretnina nije pronađena." });
    }

    const limit = 3;

    // Total count of upiti for pagination
    const totalUpiti = await db.upit.count({
      where: { NekretninaId: id },
    });

    // Calculate the offset starting from the last record and going backwards
    let offset = totalUpiti - (parseInt(page) + 1) * limit;
    console.log(totalUpiti, page, limit, offset);
    if (offset < -2) {
      return res.status(404).json([]); // If offset is negative, no more upiti to return
    }

    // Fetching paginated upiti
    const paginatedUpiti = await db.upit.findAll({
      where: { NekretninaId: id },
      offset: offset > 0 ? offset : 0,
      limit: offset > 0 ? limit : limit + offset,
    });

    const paginatedUpitiResponse = paginatedUpiti.map((upit) => ({
      korisnik_id: upit.KorisnikId,
      tekst_upita: upit.tekst,
    }));
    res.status(200).json(paginatedUpitiResponse);
  } catch (error) {
    console.error("Greška prilikom dohvaćanja paginiranih upita:", error);
    res.status(500).json({ greska: "Internal Server Error" });
  }
});

app.put("/korisnik", async (req, res) => {
  if (req.session.korisnik) {
    let korisnik = await db.korisnik.findOne({
      where: {
        id: req.session.korisnik.id,
      },
    });

    const noviPodaci = req.body;
    korisnik = korisnik.dataValues;
    korisnik = {
      ...korisnik,
      ime: noviPodaci.ime || korisnik.ime,
      prezime: noviPodaci.prezime || korisnik.prezime,
      username: noviPodaci.username || korisnik.username,
      password: hesuj(noviPodaci.password) || korisnik.password,
    };

    db.korisnik.update(
      {
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        username: korisnik.username,
        password: korisnik.password,
      },
      {
        where: {
          id: korisnik.id,
        },
      }
    );

    req.session.korisnik = korisnik;

    res.status(200).json({
      poruka: "Podaci su uspješno ažurirani",
    });
  } else {
    return res.status(401).json({ poruka: "Neautorizovan pristup" });
  }
});

/*
Returns all properties from the file.
*/
app.get("/nekretnine", async function (req, res) {
  try {
    let nekretnine = await db.nekretnina.findAll();
    nekretnine = nekretnine.map((p) => p.dataValues);
    res.status(200).json(nekretnine);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/nekretnina/:id/interesovanja", async function (req, res) {
  const id = parseInt(req.params.id);
  try {
    let user = null;

    if (req.session.username) {
      const username = req.session.username;
      user = await db.korisnik.findOne({
        where: { username },
      });
    }

    const nekretnina = await db.nekretnina.findOne({
      where: {
        id,
      },
    });
    //console.log(await nekretnina.getInteresovanja());
    console.log("user", user);
    let interesovanja = await nekretnina.getInteresovanja();

    for (let i = 0; i < interesovanja.length; i++) {
      if (
        (!user || !user.dataValues.admin) &&
        interesovanja[i].tip == "ponuda"
      ) {
        if (user.id !== interesovanja[i].KorisnikId) {
          delete interesovanja[i].cijena;
        }
      }
    }

    res.status(200).json(interesovanja);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ greska: "Internal Server Error" });
  }
});

app.post("/nekretnina/:id/ponuda", async function (req, res) {
  const id = parseInt(req.params.id);
});

app.post("/nekretnina/:id/zahtjev", async function (req, res) {
  const id = parseInt(req.params.id);
  const { tekst, trazeniDatum } = req.body;
  const nekretnina = await db.nekretnina.findByPk(id);

  if (!req.session.username) {
    return res.status(401).json({ greska: "Neautorizovan pristup" });
  }
  const username = req.session.username;
  const loggedInUser = await db.korisnik.findOne({
    where: { username },
  });

  if (!nekretnina) {
    return res.status(404).json({ greska: "Nekretnina nije pronađena." });
  }
  const requestedDate = new Date(trazeniDatum);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  if (requestedDate <= currentDate) {
    return res.status(404).json({ poruka: "Neispravan datum" });
  }
  try {
    const zahtjev = await db.zahtjev.create({
      tekst,
      trazeniDatum: requestedDate,
      NekretninaId: nekretnina.id,
      KorisnikId: loggedInUser.dataValues.id,
      odobren: false,
    });

    return res.status(201).json({ poruka: "Zahtjev uspjesno napravljen" });
  } catch (error) {
    return res.status(500).json({ poruka: "Greska", error: error.message });
  }
});

app.put("/nekretnina/:id/zahtjev/:zid", async function (req, res) {
  const id = parseInt(req.params.id);
  const zid = parseInt(req.params.zid);
  if (!req.session.username) {
    return res.status(401).json({ greska: "Neautorizovan pristup" });
  }
  const username = req.session.username;
  const loggedInUser = await db.korisnik.findOne({
    where: { username },
  });
  if (loggedInUser.role !== "admin") {
    return res
      .status(403)
      .json({ poruka: "Samo admin moze odgovoriti na poruku" });
  }
  const zahtjev = await db.zahtjev.findByPk(zid);
  if (!zahtjev || zahtjev.NekretninaId !== nekretnina.id) {
    return res.status(404).json({ message: "Neodgovarajuci zahtjev" });
  }
  if (!odobren && !addToTekst) {
    return res
      .status(400)
      .json({ message: "addToTekst nije proslijedjen za neodobreni zahtjev" });
  }
  try {
    const updatedText = addToTekst
      ? `${zahtjev.tekst} ODGOVOR ADMINA: ${addToTekst}`
      : zahtjev.tekst;

    await zahtjev.update({
      odobren,
      tekst: updatedText,
    });

    return res.status(200).json({ message: "Zahtjev uspjesno uredjen" });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
});

/* ----------------- MARKETING ROUTES ----------------- */

// Route that increments value of pretrage for one based on list of ids in nizNekretnina
app.post("/marketing/nekretnine", async (req, res) => {
  const { nizNekretnina } = req.body;

  try {
    // Load JSON data
    let preferencije = await readJsonFile("preferencije");

    // Check format
    if (!preferencije || !Array.isArray(preferencije)) {
      console.error("Neispravan format podataka u preferencije.json.");
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Init object for search
    preferencije = preferencije.map((nekretnina) => {
      nekretnina.pretrage = nekretnina.pretrage || 0;
      return nekretnina;
    });

    // Update atribute pretraga
    nizNekretnina.forEach((id) => {
      const nekretnina = preferencije.find((item) => item.id === id);
      if (nekretnina) {
        nekretnina.pretrage += 1;
      }
    });

    // Save JSON file
    await saveJsonFile("preferencije", preferencije);

    res.status(200).json({});
  } catch (error) {
    console.error("Greška prilikom čitanja ili pisanja JSON datoteke:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/marketing/nekretnina/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Read JSON
    const preferencije = await readJsonFile("preferencije");

    // Finding the needed objects based on id
    const nekretninaData = preferencije.find(
      (item) => item.id === parseInt(id, 10)
    );

    if (nekretninaData) {
      // Update clicks
      nekretninaData.klikovi = (nekretninaData.klikovi || 0) + 1;

      // Save JSON file
      await saveJsonFile("preferencije", preferencije);

      res
        .status(200)
        .json({ success: true, message: "Broj klikova ažuriran." });
    } else {
      res.status(404).json({ error: "Nekretnina nije pronađena." });
    }
  } catch (error) {
    console.error("Greška prilikom čitanja ili pisanja JSON datoteke:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/marketing/osvjezi/pretrage", async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON
    const preferencije = await readJsonFile("preferencije");

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, pretrage: nekretninaData ? nekretninaData.pretrage : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error("Greška prilikom čitanja ili pisanja JSON datoteke:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/marketing/osvjezi/klikovi", async (req, res) => {
  const { nizNekretnina } = req.body || { nizNekretnina: [] };

  try {
    // Read JSON
    const preferencije = await readJsonFile("preferencije");

    // Finding the needed objects based on id
    const promjene = nizNekretnina.map((id) => {
      const nekretninaData = preferencije.find((item) => item.id === id);
      return { id, klikovi: nekretninaData ? nekretninaData.klikovi : 0 };
    });

    res.status(200).json({ nizNekretnina: promjene });
  } catch (error) {
    console.error("Greška prilikom čitanja ili pisanja JSON datoteke:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  const hashedString = await bcrypt.hash("admin", 10);
  console.log(hashedString);
});