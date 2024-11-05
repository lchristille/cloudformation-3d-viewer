import { store } from '../store';

export default class MessageSender {

  setWebviewStoreValue(property: string, value: any) {
    this.postMessage({ type: "set", property, value });
  }

  sendResponse(requestId: string, payload: any) {
    this.postMessage({ type: "response", requestId, payload});
  }

  private postMessage(message: any) {
    if (store.webViewPanel) {
      store.webViewPanel.webview.postMessage(message);
    } else {
      console.warn(
        `The webviewPanel was not set when trying to send a message`, message
      );
    }
  }
}
