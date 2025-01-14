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
- Trycka på "Visa detaljer" knappen på en viss film för att få mer detaljerad information t.ex. handling och skådespelare.
- Bläddra bland filmer genom att använda pagineringen.
- I hamburgarmenyn längst upp till höger kan du trycka "kontakta oss" för att få upp ett kontaktformulär.
- För att ta dig tillbaka till Filmsamlaren från kontaktformuläret så trycker du på Hemmakväll loggan längst upp till vänster.

---------------------------------------------------------------------------------------------------------

Länk till Figma: https://www.figma.com/design/OmY50MMuij5s3ELYpkkBix/Examinationsprojekt?node-id=0-1&t=i5ZO9dE202dWWmvZ-1
Väldigt enkel Figma design men var väldigt användbar för att snabbt få en överblick över hur hemsidan skulle se ut.

---------------------------------------------------------------------------------------------------------

Bas URL för API: https://api.themoviedb.org/3

Jag använde 5 olika endpoints;
- /search/movie: För att söka efter film
- /discover/movie: För att senare filtera efter genre
- /movie/popular: Om ingentings söks på visas bara de mest populära filmerna
-/movie/(specifikt film ID): För att få information om en specifik film, filterar också genom denna för att få information om skådespelare

De parametrar som används för att få den data jag behöver:
- api_key: För att autentisera mig mot API:et.
- page: Generellt för att hantera paginering.
- query: Sökparameter.
- with_genres: Filterar efter genre.
- movie_id: För att komma åt data om en specifik film.
- credits: Hämtar information om skådespelare i en viss film.

----------------------------------------------------------------------------------------------------------------

Datahantering: 

API anroppet hämtar data i JSON format. I fetchMovies funktionen hämtas den data som anropas vilket sedan valideras för att sedan parsas så 
länge det inte blivit något fel vid själva hämtningen, t.ex. om servern var nere eller om det är något fel med API nyckeln. Efter det kollar 
vi om vi har hittat några filmer inom det kriteriet som söks efter och kallar sedan på displayMovies funktionen om vi har hittat filmer, 
denna funktion renderar då alla filmer som matchar sökningen. Ett ytterligare anrop görs när användaren vill se mer information om en film, 
då anropas funktionen openMovieDetails som hämtar mer information om just den filmen, denna data hämtas med hjälp av Promise.all så felhantering och JSON-parsing behöver därför ske parallellt. 

----------------------------------------------------------------------------------------------------------------

HTTP/HTTPS & Asynkronitet:
I funktionerna fetchMovies och openMoviesDetails används fetch() för att göra asynkrona HTTP GET-förfrågninar till API:et. Använder async/await 
så att funktionen väntar på respons från API innan det bearbetas. Använder try/catch för att hantera eventuella fel eller nätverksproblem samt 
återger information kring detta till användaren. I openMovieDetails används även Promise.all() för att parallellt hämta data från två olika endpoints och därmed unvika callback hell.

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

Mappstruktur:
- public innehåller båda HTML filerna
- src innehåller båda Javascript filerna
Övriga filer tillhör inte några mappar
----------------------------------------------------------------------------------------------------------------

Verisionshantering i Git: 
Har jobbat i 3 feature brancher och använt 1 dev branch där jag testat hela applikationen innan jag mergade till main. Gjorde en enkel struktur i main, skapade sedan en dev branch från main och sedan tre feature branches från dev:
en för fetch funktionerna och en för pagineringsfunktionen. Började då med att göra klart det mesta i fetch vilket även inkluderade displayMovies funktionen och allt kring localStorage. Sedan mergade jag från fetch-dev in i dev, sedan pullade jag från den uppdaterade dev för att implementera pagineringen och mergade då tillbaka i dev igen. Därefter fortsatte jag jobba i dev för att göra det sista kring styling och eventuella små fixar i övriga funktioner. Jag gjorde tillslut en tredje feature branch för att lägga till ytterligare en HTML sida, denna gång var det bara ett enkelt kontaktformulär. Det sista jag gjorde innan inlämning var att skriva den här meningen innan jag merga dev med main och för att sedan lämna in projektet.

----------------------------------------------------------------------------------------------------------------


