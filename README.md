# Lipuke-järjestelmä (React + Vite + Firebase)

Sisältö:
- Generoi QR-lipukkeita ja tallentaa niiden datan Firebase Realtime Databaseen.
- Tulostettavat PDF:t (A4, 8 lipuketta / sivu).
- Skannaa QR-koodit kameralla ja päivittää lipukkeiden tilan (in/out).
- Tuntematon lipuke lähettää äänimerkin.

## Asennus
1. Lisää Firebase-konfiguraatio `src/firebase.js` tiedostoon.
2. Asenna riippuvuudet:
   ```bash
   npm install
   ```
3. Käynnistä kehityspalvelin:
   ```bash
   npm run dev
   ```
4. Avaa selaimessa `http://localhost:5173` (tai Viten antama osoite).

## Firebase
Projekti käyttää Realtime Databasea. Malli tallennukseen:
```
tickets/
  <uuid>:
    name: "nimi tai null"
    status: "none" | "in" | "out"
    updatedAt: 1670000000000
```

## Muuta
- PDF-generaattori luo liput A4:lle, kahteen sarakkeeseen ja neljään riviin (8/sivu).
- QR:iin koodataan JSON: `{ id: "<uuid>", name: "<nimi?>" }`
- Skannaus-sivu käyttää `html5-qrcode`-kirjastoa.

