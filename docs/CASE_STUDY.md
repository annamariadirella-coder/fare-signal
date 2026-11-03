# Il problema, le scelte e il risultato

## 1. Non volevo controllare il prezzo tutto il giorno

Dovevo comprare un biglietto per un viaggio in Germania. Seguivo un treno, ma vedevo il prezzo aumentare. Il mio obiettivo era semplice: trovare una partenza adatta sotto i 40 €, senza tornare continuamente sul sito.

## 2. Ho allargato la ricerca, non il budget

Anche uno dei treni successivi poteva andare bene. Ho quindi chiesto al sistema di cercare tutti i collegamenti diretti dopo le 12:30, per la stessa data e tratta. Così non dipendevo dal prezzo di un solo treno.

![Dal problema all’avviso e allo stop](../assets/problem-to-solution.svg)

## 3. Ho trasformato la ricerca in un controllo automatico

Il sistema originale usava GitHub Actions per partire circa ogni due ore. Non serviva tenere acceso il PC di casa. Cercava le partenze, controllava i filtri e verificava di avere letto il viaggio e il prezzo giusti.

Un orario programmato può partire in ritardo. Il monitor era un aiuto alla ricerca, non una garanzia di trovare ogni offerta.

## 4. Ho stabilito quando meritavo un messaggio

Un prezzo basso da solo non bastava. Doveva appartenere al treno giusto, comparire in due letture concordanti ed essere strettamente inferiore a 40 €. Una risposta mancante o poco chiara non diventava un prezzo inventato.

Il quaderno degli avvisi ricordava i treni già segnalati. Lo stesso treno non doveva farmi arrivare lo stesso messaggio a ogni controllo. Se non era chiaro se un invio fosse riuscito, il sistema non lo ripeteva alla cieca.

## 5. Telegram chiudeva il percorso

Il risultato utile arrivava nella chat del bot. Non dovevo consultare un altro cruscotto. Leggevo l’avviso, aprivo il sito e decidevo se comprare. Le chiavi del bot restavano nei GitHub Secrets, fuori dal codice.

L’immagine seguente è un esempio inventato, non una copia della chat privata e non il prezzo del nostro acquisto:

<p align="center"><img src="../assets/telegram-example.svg" width="520" alt="Avviso Telegram illustrato: un treno diretto a 34,90 euro è sotto il budget di 40 euro. Dati inventati."></p>

## 6. Abbiamo comprato un biglietto e spento il monitor

Abbiamo trovato una partenza successiva adatta e comprato il biglietto. Poi abbiamo fermato le notifiche. Il monitor non comprava biglietti e non prendeva decisioni al posto nostro.

Questo è il risultato che posso raccontare. Non pubblico un prezzo pagato, una cifra risparmiata o un tasso di successo non verificato.

## 7. Ho preparato una versione pubblica da mostrare

La demo ripete la storia con dati inventati: crei il bot finto, premi Start, fai avanzare il timer, guardi i controlli, ricevi il messaggio simulato e fermi il monitor dopo l’acquisto immaginato.

Le regole del prezzo e dei doppioni sono codice eseguibile, usato anche nei test. La ricerca ferroviaria, il timer e Telegram sono simulati nella pagina. Il lettore ferroviario privato, i segreti e la cronologia non sono pubblicati. [Qui trovi il confronto completo](JOURNEY.md).

Il codice ha 16 prove automatiche. Le verifiche includono soglia esatta, treno sbagliato, letture diverse, controlli contemporanei, invio incerto, avvio del bot, stop e file unico per la presentazione. [Il resoconto delle verifiche](QA.md) ne spiega i limiti.

**Il valore del progetto è il percorso intero: partire da un bisogno, cercare senza lavoro manuale continuo e avvisare solo quando c’è qualcosa su cui agire.**
