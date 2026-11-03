<p align="center"><strong>FARE SIGNAL</strong><br>Il treno costa troppo? Lascia che il controllo lavori per te.</p>

# Cercavo un biglietto sotto i 40 €. Ho costruito un sistema che mi avvisasse su Telegram.

Volevo comprare un biglietto del treno per un viaggio in Germania. **Il prezzo del treno che seguivo stava aumentando.** Tornare sul sito per controllarlo ogni volta non mi aiutava.

Allora ho cambiato domanda: **«E se uno dei treni successivi costasse meno di 40 €?»** Mi andavano bene anche altre partenze, purché fossero **dirette e dopo le 12:30**, nella stessa data e sulla stessa tratta.

Ho costruito un sistema che cercava al posto mio. Controllava i prezzi circa ogni due ore. Quando trovava un treno adatto sotto il budget, verificava di nuovo e mi mandava un messaggio Telegram.

**Alla fine abbiamo acquistato un biglietto per un treno successivo e spento le notifiche.** Il sistema non comprava nulla: mi aiutava a sapere quando valeva la pena guardare. Non pubblico il prezzo pagato e non calcolo un risparmio che non posso dimostrare.

**[Prova la demo →](https://annamariadirella-coder.github.io/fare-signal/)** · [Leggi la storia completa](docs/CASE_STUDY.md) · [Avvia una copia sul tuo PC](#avvia-la-demo-sul-tuo-pc)

> **Due versioni, una storia.** Il sistema originale privato cercava prezzi reali e inviava avvisi Telegram reali; ora è spento. Questo repository contiene una dimostrazione del percorso completo, con treni, prezzi e messaggi inventati. Non contiene il lettore ferroviario privato, non cerca biglietti reali e non invia messaggi al telefono.

## Ecco il messaggio che volevo ricevere

Il punto non era avere un’altra pagina da consultare. **Volevo che fosse il messaggio a raggiungere me**, quando c’era qualcosa di interessante.

Questo è un esempio illustrato. Il treno e il prezzo sono gli stessi dati inventati usati nella demo; non sono il biglietto che abbiamo comprato.

<p align="center"><img src="assets/telegram-example.svg" width="540" alt="Esempio Telegram: il treno diretto NF 208 costa 34,90 euro, sotto il budget di 40 euro. Parte alle 15:38. Prezzo controllato due volte. Dati inventati, nessun invio reale."></p>

Il messaggio, in parole semplici:

> **Un treno è sotto il tuo budget!**  
> **34,90 €**, invece del limite di meno di 40 €.  
> NF 208 · diretto · 15:38 → 18:16  
> Northport Central → Linden Hbf · 14 marzo 2027  
> Stesso treno e stesso prezzo controllati due volte.  
> Controlla il sito prima di comprare: il prezzo può cambiare.

Nel sistema reale, l’avviso arrivava nella chat del bot e indicava il viaggio da controllare sul sito di prenotazione. Nella demo lo vedi nella chat simulata, dentro la pagina.

## Come ho risolto il problema

![Sei passaggi: problema, ricerca più ampia, controllo ogni due ore, doppia verifica, Telegram, acquisto e stop](assets/problem-to-solution.svg)

1. **Ho scelto cosa cercare.** Stessa tratta e data, solo diretti dopo le 12:30, prezzo inferiore a 40 €.
2. **Ho fatto partire i controlli da GitHub.** GitHub Actions è il servizio che esegue il programma a orari programmati. Il mio PC non doveva restare acceso. Un controllo programmato può partire in ritardo: non è un allarme preciso al minuto.
3. **Ho controllato due volte.** Prima di avvisarmi, il sistema doveva ritrovare lo stesso treno e lo stesso prezzo. Se qualcosa non era chiaro, non inventava una risposta.
4. **Ho evitato i messaggi ripetuti.** Un piccolo “quaderno” ricordava i treni già segnalati. Rivedere lo stesso treno non faceva partire un altro avviso.
5. **Ho collegato Telegram.** Il bot mandava il risultato alla mia chat. La sua chiave segreta era conservata nei GitHub Secrets, fuori dal codice.
6. **Ho comprato il biglietto e fermato il sistema.** L’acquisto era una mia decisione. Dopo, non servivano altri controlli.

## Quando arriva un avviso? E quando no?

Il limite della demo è **strettamente sotto 40 €**. Non basta arrivare a 40 € esatti.

| Cosa vede il sistema | Cosa succede |
|---|---|
| Prezzo 47,90 €, confermato due volte | Nessun avviso: è sopra il budget. |
| Prezzo 34,90 €, confermato due volte per un treno adatto | Un avviso: è sotto il budget. |
| Prezzo 40,00 € esatti | Nessun avviso: non è meno di 40 €. |
| Prima lettura 34,90 €, seconda lettura 39,90 € | Nessun avviso: i due prezzi non concordano. |
| Lo stesso treno a 34,90 € era già stato segnalato | Nessun nuovo avviso, anche se ricontrollo. |
| Non è chiaro se il messaggio sia arrivato | Il sistema aspetta un controllo, invece di rischiare un doppione. |

“Controllato due volte” riduce gli errori. Non blocca il prezzo: il sito può cambiarlo prima dell’acquisto.

## Prova tutto il percorso nella demo

La [demo online](https://annamariadirella-coder.github.io/fare-signal/) si apre senza account o installazioni. L’esempio Telegram è visibile subito. I pulsanti del percorso interattivo sono in inglese; qui trovi cosa premere:

1. **Make a pretend bot**: crea il bot finto.
2. **Press Start — pretend chat**: simula il saluto al bot con `/start`.
3. **Start the pretend watch**: accende il monitor finto.
4. **Jump 2 hours & check**: fa passare due ore sull’orologio finto e controlla. Con il budget a 40 €, compaiono due avvisi simulati.
5. **Open the notebook**: mostra le due letture, la decisione e cosa ricorda il quaderno.
6. Premi di nuovo **Jump 2 hours & check**: nessun nuovo messaggio per gli stessi treni.
7. **I bought a ticket — stop**: ferma il monitor finto dopo l’acquisto immaginato. Non compra davvero nulla.
8. **Start over**: svuota tutto e riparte dalla creazione del bot.

Puoi spostare il budget o scegliere un caso difficile: prezzi diversi, nessuna risposta, consegna incerta. Cambiare esempio svuota il quaderno; spostare solo il budget lo conserva. Ricaricare la pagina cancella tutto. Nessun controllo continua in sottofondo.

## Cosa c’è qui e cosa resta privato

| Parte | Sistema originale privato | Questo progetto pubblico |
|---|---|---|
| Ricerca dei prezzi | Visite reali al sito ferroviario | Dati inventati |
| Partenze successive, diretti, orari e budget | Regole del monitor | Regole mostrate con esempi |
| Controllo ogni due ore | GitHub Actions, ora disattivato | Un pulsante muove il tempo finto |
| Doppia verifica e memoria degli avvisi | Usate dal monitor | Codice eseguibile, condiviso tra demo e test |
| Telegram | Bot e avvisi reali, ora fermi | Creazione, Start, chat e ricevute simulati |
| Acquisto | Fatto da noi sul sito | Nessun acquisto |

Puoi installare **la demo completa** da questo repository. Non è un servizio pubblico di prezzi in tempo reale. La storia del progetto originale è raccontata senza pubblicare chiavi, chat private, biglietti o la cronologia del monitor.

## Avvia la demo sul tuo PC

Serve **Node.js 22 o più recente**, un programma che esegue JavaScript. Se hai Git, apri il terminale, cioè la finestra dove scrivi i comandi, e inserisci queste righe una alla volta:

```sh
git clone https://github.com/annamariadirella-coder/fare-signal.git
cd fare-signal
npm start
```

Apri **http://127.0.0.1:8765** nel browser. È un indirizzo del tuo computer. Tieni aperto il terminale; per fermare la demo premi **Ctrl+C** lì.

**Senza Git:** scegli **Code → Download ZIP** su GitHub, estrai la cartella e apri un terminale nella cartella che contiene `package.json`. Scrivi `npm start`.

Non serve `npm install`: non ci sono pacchetti aggiuntivi da scaricare. Se la porta 8765 è occupata, chiudi l’altra copia o scegli un altro numero con la variabile `PORT` nel terminale.

| Comando | A cosa serve |
|---|---|
| `npm start` | Apre la demo sul tuo computer. |
| `npm test` | Esegue 16 prove delle regole e del percorso. |
| `npm run check` | Cerca errori di scrittura nel codice, file mancanti e alcuni tipi di dati privati. |
| `npm run build` | Prepara i file del sito nella cartella `dist/`. |
| `npm run standalone` | Crea `fare-signal-demo.html`, un file unico da aprire e presentare anche senza Node. |

Il file unico include codice, disegni e dati inventati. La versione normale con più file va aperta con `npm start`, non facendo doppio clic su `index.html`.

## Come è costruito

Il progetto usa JavaScript senza librerie aggiuntive. La pagina e i test usano le stesse regole. I soldi sono contati in centesimi: 34,90 € diventa `3490`, così i confronti sono precisi.

| Dove guardare | Cosa trovi |
|---|---|
| `src/monitor.mjs` | Le regole e il quaderno degli avvisi. |
| `demo/fixtures.mjs` | Treni e prezzi inventati. |
| `demo/journey.mjs` | Bot finto, orologio e pulsante di stop. |
| `demo/app.mjs` | Collega pulsanti, risultati e chat. |
| `tests/` | Le prove automatiche. |
| `assets/` | Disegni ed esempi illustrati. |
| `.github/workflows/` | Le istruzioni per controllare e pubblicare questa demo su GitHub. |

I test verificano le domande importanti: il treno è quello giusto? Il prezzo è sotto il limite? Due letture concordano? Due controlli insieme creano doppioni? Cosa succede se una consegna resta incerta? Un test passato non promette che ogni caso possibile sia coperto.

[![Controlli automatici](https://github.com/annamariadirella-coder/fare-signal/actions/workflows/ci.yml/badge.svg)](https://github.com/annamariadirella-coder/fare-signal/actions/workflows/ci.yml)

## Per approfondire

- [La storia completa: problema, scelte e risultato](docs/CASE_STUDY.md).
- [Il percorso dall’inizio al messaggio](docs/JOURNEY.md).
- [Come funziona il codice](docs/ARCHITECTURE.md) e [cosa abbiamo verificato](docs/QA.md).
- [Come presentarlo](docs/PRESENTING.md) e [pubblicare una copia](docs/PUBLISHING.md).
- [Come contribuire](CONTRIBUTING.md), [proteggere i dati](SECURITY.md) e [partecipare con rispetto](CODE_OF_CONDUCT.md).

Le altre guide tecniche sono in inglese semplice. Il progetto usa la [licenza MIT](LICENSE). Non è affiliato a Telegram o a una compagnia ferroviaria. Il controllo dei dati privati riconosce solo alcuni schemi: serve comunque una revisione umana prima di pubblicare file nuovi.
