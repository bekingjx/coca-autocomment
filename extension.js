const vscode = require('vscode');

const commentMap = {
    'html':             { open: '<!--', close: '-->' },
    'xml':              { open: '<!--', close: '-->' },
    'css':              { open: '/*',   close: ' */' },
    'scss':             { open: '/*',   close: ' */' },
    'sass':             { open: '/*',   close: ' */' },
    'javascript':       { open: '//',   close: '' },
    'javascriptreact':  { open: '//',   close: '' },
    'typescript':       { open: '//',   close: '' },
    'typescriptreact':  { open: '//',   close: '' },
    'yaml':             { open: '#',    close: '' },
    'smarty':           { open: '{*',   close: ' *}' }
};

/**
 * Funzione che formatta data e ora nel formato DD,MM,YY HH:mm
 * @returns {string} La data e ora formattata
 */
function getFormattedDateTime() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2); // Solo le ultime due cifre
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${year} - ${hours}:${minutes}`;
}

/**
 * Funzione asincrona che recupera il nome utente dalla configurazione di Git.
 * @returns {Promise<string|null>} Il nome utente o null se non trovato.
 */
async function getGitUserName() {
    try {
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (!gitExtension?.isActive) {
            // Se l'estensione Git non è attiva, prova ad attivarla.
            // Questo potrebbe accadere in rari casi all'avvio di VS Code.
            await gitExtension?.activate();
        }

        const api = gitExtension?.exports.getAPI(1);

        if (api && api.repositories.length > 0) {
            // Usiamo il primo repository trovato. In un workspace multi-root,
            // si potrebbe implementare una logica più complessa, ma per ora è sufficiente.
            const repo = api.repositories[0];
            const userName = await repo.getGlobalConfig('user.name');
            return userName || null; // Ritorna il nome o null se è vuoto
        }
    } catch (error) {
        console.error("Errore nel recupero del nome utente Git:", error);
        return null; // In caso di errore, non mostrare nulla
    }
    return null;
}

function activate(context) {
    console.log('Congratulazioni, l\'estensione "ucomment-inserter" è ora attiva!');

    const trigger = 'COCA';

    const provider = vscode.languages.registerCompletionItemProvider(
        [
            'html', 'css', 'javascript', 'javascriptreact', 'typescript',
            'typescriptreact', 'smarty', 'yaml', 'xml', 'scss', 'sass'
        ],
        {
            // La funzione ora è ASINCRONA per attendere il nome utente
            async provideCompletionItems(document, position) {
                
                const linePrefix = document.lineAt(position).text.substr(0, position.character);
                if (!linePrefix.endsWith(trigger)) {
                    return undefined;
                }

                const languageId = document.languageId;
                const commentSyntax = commentMap[languageId];

                if (!commentSyntax) {
                    return undefined;
                }
                
                // Ottieni data e ora formattate
                const dateTime = getFormattedDateTime();

                // Ottieni il nome utente da Git (await perché è asincrono)
                const gitUserName = await getGitUserName();

                // Costruisci la stringa del commento
                let userPart = '';
                if (gitUserName) {
                    userPart = ` - ${gitUserName}`; // Aggiungi il nome solo se esiste
                }

                const textToInsert = `${commentSyntax.open} ${dateTime}${userPart}${commentSyntax.close ? ' ' + commentSyntax.close.trim() : ''}`;

                const completion = new vscode.CompletionItem(trigger, vscode.CompletionItemKind.Snippet);
                completion.insertText = textToInsert;
                completion.documentation = new vscode.MarkdownString(`Inserisce un commento con data, ora e utente Git:\n\`\`\`\n${textToInsert}\n\`\`\``);

                const startPos = position.translate(0, -trigger.length);
                completion.range = new vscode.Range(startPos, position);
                
                // Ritorna una Promise che si risolve con l'array di completamenti
                return [completion];
            }
        }
    );

    context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}