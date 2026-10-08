# Ciao Ciao – sajt

Font je Nunito (podržava č, ć, š, ž, đ). Čist HTML/CSS/JS, bez build koraka. Otvorite `index.html` ili ga postavite na bilo koji statički hosting.

## Slike (u `assets/img/`, tačno ovi nazivi, .jpg)
`gallery1.jpg` … `gallery9.jpg` (lounge unutra, devojčica u lopticama, traktorčić, tobogan, piće, piće, bašta, piće, stolice sa zvučnikom).
`gallery2` i `gallery4` se koriste i u sekciji „O nama", `gallery1`, `gallery7`, `gallery9` i u Lounge sekciji. Dok slika ne postoji, vidi se šareni placeholder.
Već su generisani: `logo-dark.png` / `logo-light.png` (prozirne varijante logoa), `hand.png`, ikonice, `og-image.jpg`.

## Popuniti
- **Cene rođendana i zakupa**: trenutno piše „Cena na upit" (sekcija `#rodjendani` u `index.html`). Cena radionice 1.500 RSD je iz vaših podataka.
- Opis paketa je opšti, dopunite ga kad budete imali tačne sadržaje paketa.
- **Recenzije**: ocena 5,0 i 65 recenzija su iz vaših podataka. Tri recenzije u `#recenzije` su PRIMERI, zamenite ih pravim. Dugmad vode na Google Maps pretragu; za direktno „Ostavite recenziju" zamenite link sa `https://search.google.com/local/writereview?placeid=VAS_PLACE_ID`.
- **WhatsApp**: forma i dugmad koriste `wa.me/381631360713` (otvara se u novom tabu; na računaru WhatsApp Web). Proverite da je taj broj na WhatsApp-u.
- Email `info@ciaociao.rs` je samo prikazan u kontaktu.
- Koordinate (`geo`) nisu dodate u JSON-LD, dodajte po želji.

## Izmene
- **Radno vreme**: tabela u `index.html` (`#hrs`), JSON-LD u `<head>` i objekat `H` / `CLOSE` u `js/main.js` (za indikator „Otvoreno").
- **Boje**: promenljive na vrhu `css/style.css` (`:root`).
- **Domen**: zamenite `ciaociao-nis.vercel.app` sa `ciaociao.rs` u `index.html`, `robots.txt`, `sitemap.xml`.
- **Kontakt forma**: trenutno otvara mejl (mailto). Za pravo slanje: napravite formu na formspree.io, u `<form id="form">` dodajte `action="https://formspree.io/f/XXXX" method="post"` i obrišite blok „forma" na kraju `js/main.js`.

## Objavljivanje
- **Vercel / Netlify / Cloudflare Pages**: prevucite folder (ili povežite repo), build komanda i output folder se ne podešavaju.
- **Klasičan hosting**: sve fajlove iz foldera pošaljite u `public_html` preko FTP-a.
