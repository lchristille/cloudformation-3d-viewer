import { makeAutoObservable, runInAction } from 'mobx';
import * as vscode from 'vscode';

class VsCodeStore {
    vscode: ReturnType<typeof acquireVsCodeApi>;
    pendingRequests: Map<string, (value: any) => void>;

    documentUri?: string;
    workspaceMode?: number;

    constructor() {
        makeAutoObservable(this, {
            vscode: false,
            pendingRequests: false
        });
        this.vscode = acquireVsCodeApi();
        this.pendingRequests = new Map();

        window.addEventListener('message', this.handleMessage.bind(this));
        this.sendReadySignal();
    }

    showInformationMessage(content: string) {
        this.callExtensionHandler('showInformationMessage', {content});
    }

    sendReadySignal(value: Boolean = true) {
        this.vscode.postMessage({type: 'ready', ready: value});
    }

    async getMainDocumentUri(): Promise<any> {
        return this.sendAsyncMessage('getMainDocumentUri');
    }

    async getMainDocumentSymbols(): Promise<any> {
        return this.sendAsyncMessage('getMainDocumentSymbols');
    }

    private handleMessage(event: MessageEvent) {
        const message = event.data;

        if (message.type === 'response' && this.pendingRequests.has(message.requestId)) {
            const resolve = this.pendingRequests.get(message.requestId);
            if (resolve) {
                resolve(message.payload);
                this.pendingRequests.delete(message.requestId);
            }
        } else if (message.type === 'set') {
            const propertyName = message.property;
            const value = message.value;
            if (propertyName in this) {
                (this as any)[propertyName] = value;
                console.info(`Set property ${propertyName} with value ${value}`);
            } else {
                console.warn(`Property "${propertyName} does not exist in VsCodeStore.`);
            }
        }
    }

    private callExtensionHandler(functionName: string, parameters: Record<string, any>) {
        this.vscode.postMessage({type: 'call', functionName, parameters});
    }

    private async sendAsyncMessage(functionName: string, payload: any = {}): Promise<any> {
        const requestId = this.generateRequestId();

        this.vscode.postMessage({ type: 'async', requestId, functionName, payload});

        return new Promise((resolve) => {
            this.pendingRequests.set(requestId, resolve);
        })
    }

    private generateRequestId(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    dispose() {
        window.removeEventListener('message', this.handleMessage);
    }
}

export const vsCodeStore = new VsCodeStore();