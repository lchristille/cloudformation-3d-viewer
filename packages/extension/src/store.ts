import * as vscode from 'vscode';
import MessageHandler from './messages/messageHandler';
import MessageSender from './messages/messageSender';
import SymbolsProvider from './document/documentProvider';
import { WorkspaceMode } from 'cloudformation-3d-shared';

class Store {
    messageHandler: MessageHandler = new MessageHandler();
    messageSender: MessageSender = new MessageSender();
    symbolsProvider: SymbolsProvider = new SymbolsProvider();

    document?: vscode.TextDocument;
    webViewPanel?: vscode.WebviewPanel;
    context?: vscode.ExtensionContext;

    webviewReady: Boolean = false;

    private _workspaceMode?: WorkspaceMode;

    getWorkspaceMode() {
        if (!this._workspaceMode) {
            if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
                this._workspaceMode = WorkspaceMode.Folder;
            } else if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document) {
                this._workspaceMode = WorkspaceMode.SingleFile;
            } else {
                this._workspaceMode = WorkspaceMode.Unknown;
            }
        }

        return this._workspaceMode;
    }

}

export const store = new Store();