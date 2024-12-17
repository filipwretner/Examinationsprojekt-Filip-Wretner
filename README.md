# Examinationsprojekt-Filip-Wretner
 
Projektbeskrivning
---------------------------------------------------------------------------------------------------------
FilmSamlaren är en webbapplikation som låter användaren söka efter filmer genom att använda ett offentligt film-API (t.ex. The Open Movie Database (OMDb)). Användaren ska kunna:

Se minst 10 filmer utan att behöva söka efter något.
Ange en filmtitel i ett sökfält eller användaren skall kunna filtrera filmer med via exempel genrer.
När användaren klickar på en vald film, visa mer detaljerad information (titel, år, genre, kort beskrivning, poster m.m?).
Du ska utveckla applikationen individuellt.

Projektkrav
---------------------------------------------------------------------------------------------------------

Teknisk Funktionalitet för att nå G nivå:
---------------------------------------------------------------------------------------------------------
Datahantering (JSON):
Hämta data i JSON-format från ett offentligt API.
Tolka och presentera JSON-datan på webbsidan.

HTTP/HTTPS & Asynkronitet:
Använd fetch() för att göra asynkrona GET-förfrågningar mot API:et.
Använd async/await och try/catch för felhantering av asynkrona operationer..
Säkerställ att du hanterar nätverksfel, ogiltiga sökningar och oväntade svar på ett användarvänligt sätt.

Dynamisk Komponent och Datatyper/Operatorer:
Låt användaren söka efter filmer via ett input-fält  eller en filtrering av listad data.
Visa sökresultatet  eller filtrerad data dynamiskt på sidan (skapa element i DOM).
Räkna och visa antalet matchande filmer. Använd JavaScript-logik (t.ex. operatorer och villkor) för att dölja visa element vid behov.
När användaren klickar på en film, visa detaljer (på samma sida eller i en modal/overlay).
När användaren interagerar (t.ex. skriver in sökord, klickar på en filter knapp) ska innehållet på sidan uppdateras dynamiskt.

UX/UI och WCAG:
Ta fram en enkel wireframe eller mockup i Figma där du visar hur du tänkt kring layout och UX/UI-principer (de 6 principerna ni lärt er).
Bifoga en länk eller bild på din Figma-design i projektets README.
Implementera minst några grundläggande WCAG-hänsyn i din kod (ex. alt-texter på bilder, tydlig färgkontrast, semantisk HTML-struktur).
Använd principer om användarvänlighet, konsekvens, feedback, felprevention – t.ex. ge användaren tydlig återkoppling när data laddas, eller vid fel.

Versionshantering med Git:
Använd Git för att versionshantera ditt projekt.
Minst 3 meningsfulla commits.
1 “huvudbranch” (main?), den använder ni vid presentationen. 
1 develop branch som mergas i huvud branchen.
Minst 1 feature branch som mergas i developbranchen.

Teknisk Funktionalitet för att nå VG nivå:
---------------------------------------------------------------------------------------------------------
Favoritlista (LocalStorage):
Låt användaren markera utvalda filmer som favoriter och spara dem i LocalStorage. Favoriter ska kunna ses även efter om laddning av sidan.

Responsiv Design:
Gör gränssnittet responsivt. (3 skärmar: mobil, tablet, desktop storlekar)

UX/UI och WCAG:
Figma design för alla 3 skärmar
Hanterar asynkronitet med gott handlag:
Använder Promise.all() eller caching.

Versionshantering med Git:
1 huvud branch, minst 1 develop branch och minst 3 feature brancher och allt mergas i rätt ordning (feature branch inte in direkt i huvud branch), minst 5 commits, tydliga commit-meddelanden.
Skapa minst 2 sidor.

Organisation:
Har du flera filer av samma sort? Skapa mapp för det, till exempel du har 2 html filer, skapa mapp!
