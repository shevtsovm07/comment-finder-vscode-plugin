"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
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
        }
        else {
            vscode.window.showInformationMessage('Nothing found');
        }
    });
    context.subscriptions.push(command);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map