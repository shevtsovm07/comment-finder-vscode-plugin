import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Plugin started');

    let command = vscode.commands.registerCommand('comment-finder.findComments', () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('Open file first');
            return;
        }

        const doc = editor.document;
        const allText = doc.getText();
        
        const patterns = [
            /\/\/\s*(TODO|FIXME):?\s*(.*)/gi,
            /\/\*[\s\S]*?(TODO|FIXME)[\s\S]*?\*\//gi
        ];
        
        const results = [];
        
        for (let i = 0; i < patterns.length; i++) {
            let found;
            while ((found = patterns[i].exec(allText)) !== null) {
                const start = doc.positionAt(found.index);
                const end = doc.positionAt(found.index + found[0].length);
                results.push(new vscode.Range(start, end));
            }
        }

        const style = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'yellow',
            opacity: '0.3'
        });
        
        editor.setDecorations(style, results);
        
        if (results.length > 0) {
            vscode.window.showInformationMessage('Found: ' + results.length);
        } else {
            vscode.window.showInformationMessage('Nothing found');
        }
    });

    context.subscriptions.push(command);
}

export function deactivate() {}