# Examinationsprojekt-Filip-Wretner

----------------------------------------------------------------------------------------------------------------
 
Hur du startar och sedan navigerar på applikationen:

1. Se till att "Live Server" extension finns i din VS Code.
2. Öppna filen "index.html" i VS Code och klicka på "Go Live" längst ner till höger i VS Code.
3. index.html kommer då öppnas lokalt på din webbläsare. 
4. På hemsidan kan du:
- Söka efter film med titel genom input-fältet eller med genre genom dropdown-menyn. 
- Se information om en film genom att trycka på "Visa detaljer" knappen.
- Spara filmer bland dina favoriter genom att trycka på '+' knappen på ett "filmkort".
- Visa dina sparade favoriter genom att trycka på "Sparade filmer" knappen.
- Kan såklart också ta bort filmer från favoriter genom att trycka på '-' knappen på ett filmkort du sparat som favorit.
- Bläddra bland filmer genom att använda pagineringen.

---------------------------------------------------------------------------------------------------------

Länk till Figma: https://www.figma.com/design/OmY50MMuij5s3ELYpkkBix/Examinationsprojekt?node-id=0-1&t=i5ZO9dE202dWWmvZ-1
Väldigt enkel Figma design men var väldigt användbar för att snabbt få en överblick över hur hemsidan skulle se ut.

---------------------------------------------------------------------------------------------------------

API:iet jag använde var: https://www.omdbapi.com/
För att hämta data använder jag mig av tre olika endpoints. En för att söka efter titel, en för att filtrera efter genre och en där jag 
hämtar på en lista på de mest populära filmerna men jag använder också denna endpoint för att få mer generell information om en film. 

De parametrar som används för att få den data jag behöver:
- api_key: För att autentisera mig mot API:et.
- page: Generellt för att hantera paginering.
- query: Sökparameter.
- with_genres: Filterar efter genre.
- movieId: Hämtar information om en specifik film. 

----------------------------------------------------------------------------------------------------------------

Datahantering: 
API anroppet hämtar data i JSON format. I fetchMovies funktionen hämtas den data som anropas vilket sedan valideras för att sedan parsas så 
länge det inte blivit något fel vid själva hämtningen, t.ex. om servern var nere eller om det är något fel med API nyckeln. Efter det kollar 
vi om vi har hittat några filmer inom det kriteriet som söks efter och kallar sedan på displayMovies funktionen om vi har hittat filmer, 
denna funktion renderar då alla filmer som matchar sökningen. Ett ytterligare anrop görs när användaren vill se mer information om en film, 
då anropas funktionen openMovieDetails som hämtar mer information om just den filmen, denna data hanteras på samma sätt. 

----------------------------------------------------------------------------------------------------------------

HTTP/HTTPS & Asynkronitet:
I funktionerna fetchMovies och openMoviesDetails används fetch() för att göra asynkrona HTTP GET-förfrågninar till API:et. Använder async/await 
så att funktionen väntar på respons från API innan det bearbetas. Använder try/catch för att hantera eventuella fel eller nätverksproblem samt 
återger information kring detta till användaren. 

----------------------------------------------------------------------------------------------------------------

Felhantering:
Try/catch visar vilket typ av fel som uppstått, t.ex. 404 eller 401. Ogiltiga sökningar hanteras genom att kolla om det finns några filmer som 
matchar sökningen och att endast visa ett meddelande när det inte fanns några filmer. 

----------------------------------------------------------------------------------------------------------------

UI/UX:
Använde Hemmakvälls hemsida som mall när det gäller design och färgkontraster. WCAG principer följs i form av alt-texter vid bilder, aria-labels 
vid relevanta HTML element och semantisk struktur. Sidan är väldigt enkel och användarvänlig generellt så det krävdes inte jättemycket på denna 
fronten förutom att se till att alla element på sidan är rätt storlek. Förutom det krävdes det bara små tillägg, t.ex. kring felprevention och 
användarvänlighet så måste man konfirmera att man vill ta bort en film från favoriter när man sorterar efter sina favoriter, detta för att förhindra 
att använder trycker bort av misstag och måste nu gå tillbaka och söka upp filmen igen för att lägga tillbaka i listan.  

----------------------------------------------------------------------------------------------------------------

Verisionshantering i Git: 
Har jobbat i 3/4 brancher. Gjorde en enkel struktur i main, skapade sedan en dev branch från main och sedan två feature branches från dev:
en för fetch funktionerna och en för pagineringsfunktionen. Började då med att göra klart det mesta i fetch vilket även inkluderade displayMovies 
funktionen och allt kring localStorage. Sedan mergade jag från fetch-dev in i dev, sedan pullade jag från den uppdaterade dev för att implementera 
pagineringen och mergade då tillbaka i dev igen. Därefter fortsatte jag jobba i dev för att göra det sista kring styling och eventuella små fixar 
i övrigra funktioner. Det sista jag gjorde innan inlämning var att skriva den här meningen innan jag merga dev med main och för att sedan lämna in projektet.

----------------------------------------------------------------------------------------------------------------


