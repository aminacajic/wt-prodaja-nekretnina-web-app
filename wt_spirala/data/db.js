const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt24", "root", "password", {
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
});
const db = {};

db.sequelize = sequelize;

db.korisnik = require("../modeli/korisnik.js")(sequelize);
db.nekretnina = require("../modeli/nekretnina.js")(sequelize);
db.upit = require("../modeli/upit.js")(sequelize);
db.zahtjev = require("../modeli/zahtjev.js")(sequelize);
db.ponuda = require("../modeli/ponuda.js")(sequelize);

db.korisnik.hasMany(db.upit, { as: "upiti" });
db.korisnik.hasMany(db.zahtjev, { as: "zahtjevi" });
db.korisnik.hasMany(db.ponuda, { as: "ponude" });

db.nekretnina.hasMany(db.upit, { as: "upiti" });
db.nekretnina.hasMany(db.zahtjev, { as: "zahtjevi" });
db.nekretnina.hasMany(db.ponuda, { as: "ponude" });

db.nekretnina.prototype.getInteresovanja = async function () {
  const upiti = await this.getUpiti();
  const zahtjevi = await this.getZahtjevi();
  const ponude = await this.getPonude();
  const interesovanja = [
    ...upiti.map((upit) => ({ ...upit.dataValues, tip: "upit" })),
    ...zahtjevi.map((zahtjev) => ({ ...zahtjev.dataValues, tip: "zahtjev" })),
    ...ponude.map((ponuda) => ({ ...ponuda.dataValues, tip: "ponuda" })),
  ];
  return interesovanja;
};

db.ponuda.belongsTo(db.ponuda, {
  foreignKey: "ponuda_id",
  as: "originalPonuda",
});
db.ponuda.hasMany(db.ponuda, { foreignKey: "ponuda_id", as: "vezanePonude" });

async function kreiranjeTabela() {
  console.log("Pokrenuto kreiranje tabela...");
  await db.sequelize.sync({ force: true });
  console.log("Tabela su kreirane.");
}

async function punjenjeTabela() {
  console.log("Punjenje tabela sa podacima...");

  const korisnik = await db.korisnik.create({
    ime: "user",
    prezime: "user",
    username: "user",
    password: "$2b$10$fD.EBZXqBPGG1.rABp0LMOicHzxy5TenZBxt0fDFK93obnDt3GP/6",
    admin: false,
  });

  const admin = await db.korisnik.create({
    ime: "admin",
    prezime: "admin",
    username: "admin",
    password: "$2b$10$iq./6bXhOls3Jh7HKb9T/OrPiJ80h8Xi8ebQpGgjJZarDU2ACnp/.",
    admin: true,
  });

  console.log("Tabela su uspješno popunjene.");
}


kreiranjeTabela().then(() => {
  setTimeout(punjenjeTabela, 1000);
});

module.exports = db;