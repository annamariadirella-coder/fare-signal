# Come raccontare Fare Signal in tre minuti

Apri la [storia con l’esempio Telegram](https://annamariadirella-coder.github.io/fare-signal/#story). Parti dal problema, prima dei pulsanti.

## 1. Il problema: il prezzo saliva

«Dovevo comprare un biglietto del treno. Il prezzo della partenza che seguivo stava aumentando. Volevo spendere meno di 40 €, senza tornare sul sito tutto il giorno.»

## 2. La scelta: guardare anche le partenze successive

«Mi andavano bene anche altri treni, purché diretti e dopo le 12:30, nella stessa data e sulla stessa tratta. Ho costruito un sistema che li cercasse per me.»

## 3. Il risultato utile: un messaggio, non un’altra pagina

Mostra l’immagine Telegram, visibile prima della demo.

«Il sistema originale controllava circa ogni due ore. Se ritrovava lo stesso treno e prezzo in due letture, e il prezzo era sotto il budget, il bot mi avvisava su Telegram. Questa immagine usa un treno inventato a 34,90 €: mostra il tipo di risultato, non il biglietto che abbiamo comprato.»

## 4. Mostra come funziona

1. Premi **Make a pretend bot**, poi **Press Start — pretend chat**.
2. Premi **Start the pretend watch**, poi **Jump 2 hours & check**.
3. Indica le due notifiche nella chat finta e apri **Open the notebook**.
4. Fai un altro salto di due ore. La chat non riceve doppioni.

«Il quaderno ricorda i treni già segnalati. Se i due prezzi sono diversi, o non sappiamo se un invio è riuscito, il sistema aspetta invece di dare una risposta poco sicura.»

## 5. Il finale: comprare e fermare il monitor

Premi **I bought a ticket — stop**.

«Abbiamo trovato una partenza successiva adatta e comprato il biglietto sul sito. Poi abbiamo spento le notifiche. Il programma non comprava nulla al posto nostro.»

## 6. Spiega cosa è reale e cosa è simulato

«Il sistema originale privato aveva ricerca ferroviaria reale, timer, doppia verifica, memoria degli avvisi e Telegram. Questo repository pubblico mostra il percorso completo con dati e messaggi inventati. Le regole sono codice eseguibile, ma qui non si cercano prezzi reali e non si inviano notifiche al telefono.»

Se qualcuno vuole vedere il codice, mostra `src/monitor.mjs` e lancia `npm test`: le 16 prove verificano prezzi, treni, doppioni, invii incerti, avvio, stop e file unico. [Qui sono spiegati i controlli](QA.md).

## Prima di presentarlo

Premi **Start over** per ripartire. Lascia visibili le etichette dei dati inventati. Mostra solo immagini pubbliche della demo. Non attribuire all’esempio un risparmio o un prezzo pagato: non sono pubblicati.

## Descrizione breve

> Ho trasformato una ricerca manuale di biglietti in un monitor con avvisi Telegram: controlla i diretti dopo l’orario scelto, verifica due volte il prezzo e non ripete lo stesso messaggio. La demo pubblica racconta l’intero percorso con dati inventati.
