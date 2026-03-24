document.addEventListener("DOMContentLoaded", () => {
    const upitiContainer = document.getElementById("upiti-container");

    function prikaziGresku(poruka) {
        upitiContainer.innerHTML = `<p style="color: red;">${poruka}</p>`;
    }

    function prikaziUpite(upiti) {
        if (upiti.length === 0) {
            upitiContainer.innerHTML = "<p>Nemate nijedan upit.</p>";
            return;
        }

        const lista = document.createElement("ul");
        lista.style.listStyle = "none";

        upiti.forEach((upit) => {
            const listItem = document.createElement("li");
            listItem.style.border = "1px solid #ccc";
            listItem.style.margin = "10px 0";
            listItem.style.padding = "10px";
            listItem.innerHTML = `
                <p><strong>ID Nekretnine:</strong> ${upit.id_nekretnine}</p>
                <p><strong>Tekst Upita:</strong> ${upit.tekst_upita}</p>
            `;
            lista.appendChild(listItem);
        });

        upitiContainer.appendChild(lista);
    }

    PoziviAjax.getMojiUpiti((error, data) => {
        if (error) {
            if (error.status === 401) {
                prikaziGresku("Neautorizovan pristup. Molimo prijavite se.");
            } else if (error.status === 404) {
                prikaziGresku("Nemate nijedan upit.");
            } else {
                prikaziGresku("Došlo je do greške prilikom dohvaćanja upita.");
            }
        } else {
            prikaziUpite(data);
        }
    });
});
