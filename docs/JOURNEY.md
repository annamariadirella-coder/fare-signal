# Dal prezzo che saliva al messaggio sul telefono

Il problema era concreto: volevo un biglietto sotto i 40 €, ma il prezzo del treno che seguivo aumentava. Controllare il sito continuamente richiedeva attenzione. Ho scelto di cercare anche i diretti successivi dopo le 12:30, nella stessa data e sulla stessa tratta.

![La storia in sei passaggi](../assets/problem-to-solution.svg)

## Il percorso del sistema originale

1. **Scelgo il viaggio e il budget.** Il programma sa quali partenze sono accettabili.
2. **Il timer avvia un controllo.** GitHub Actions lo eseguiva circa ogni due ore. Il PC di casa poteva restare spento. Gli orari programmati possono subire ritardi.
3. **Il lettore cerca treni e prezzi.** Controlla percorso, data, orari, collegamento diretto e dettagli della tariffa. Se non può confermarli, non inventa un prezzo.
4. **Una seconda lettura verifica il risultato.** Deve essere lo stesso treno, con lo stesso prezzo.
5. **Il programma guarda il budget e il quaderno.** Il prezzo deve essere meno di 40 €. Se ha già segnalato quel treno, non ripete l’avviso.
6. **Telegram mi raggiunge.** Il bot invia il viaggio e il prezzo alla mia chat. Posso aprire il sito e decidere se comprare. La chiave del bot rimane fuori dal codice.
7. **Compro il biglietto e spengo il monitor.** È quello che abbiamo fatto dopo aver trovato una partenza successiva adatta. Il programma non ha comprato nulla.

## Come appare il risultato

<p align="center"><img src="../assets/telegram-example.svg" width="520" alt="Esempio inventato di avviso Telegram: un treno diretto costa 34,90 euro, meno del budget di 40 euro. Due letture concordanti."></p>

Questo è un disegno con dati inventati. Non mostra la chat privata, il prezzo pagato o una cifra risparmiata.

## Cosa puoi provare nel repository pubblico

| Parte | Demo pubblica | Sistema originale privato |
|---|---|---|
| Viaggio | Esempio inventato, budget regolabile | Viaggio configurato |
| Timer | Pulsante che fa passare due ore finte | GitHub Actions, ora spento |
| Prezzi | Due letture inventate | Visite reali al sito ferroviario |
| Regole e quaderno | Codice usato anche dai test, memoria nella pagina | Doppia verifica e stato delle notifiche salvato |
| Telegram | Bot, Start, chat e ricevute simulati | Bot e avvisi reali, ora fermi |
| Acquisto e stop | Pulsante finto che ferma la demo | Acquisto fatto da noi, poi monitor disattivato |

Il codice pubblico non contiene il lettore ferroviario privato. Puoi installare e presentare la demo completa; non puoi usarla da sola per cercare prezzi reali o mandare messaggi al telefono.

## Come dirlo con chiarezza

«Ho costruito un monitor dei prezzi dei treni con controlli programmati, doppia verifica, protezione dai messaggi ripetuti e avvisi Telegram. Lo abbiamo usato per trovare un biglietto e poi spento. Questa versione pubblica permette di provare tutto il percorso con dati e messaggi simulati.»

Chiavi, numeri di chat, biglietti e messaggi privati restano fuori da questo progetto.
