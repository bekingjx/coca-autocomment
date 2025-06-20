# UComment Date Inserter

Inserisce rapidamente un commento formattato con la data, l'ora e il tuo nome utente Git.

## Caratteristiche

Basta digitare `COCA` in un file supportato e premere Invio per inserire un commento formattato in base al linguaggio del file.

Il formato del commento è: `DD MM YY HH:mm - NomeUtenteGit`

**Esempio in JavaScript:**
`// 27 10 23 16:10 - Mario Rossi`

**Esempio in HTML:**
`<!-- 27 10 23 16:11 - Mario Rossi -->`

Se il nome utente Git non è configurato, viene inserita solo la data e l'ora.

## Linguaggi Supportati

*   HTML (`.html`, `.htm`)
*   CSS (`.css`)
*   JavaScript (`.js`, `.jsx`)
*   TypeScript (`.ts`, `.tsx`)
*   SCSS (`.scss`)
*   SASS (`.sass`)
*   YAML (`.yaml`, `.yml`)
*   XML (`.xml`)
*   Smarty (`.tpl`)

## Requisiti

L'estensione Git integrata in VS Code è necessaria per recuperare il nome utente.

---

**Enjoy!**