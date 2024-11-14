import { NotificationKind } from 'cloudformation-3d-shared';
import { store } from '../store';

export default class MessageSender {

  setWebviewStoreValue(property: string, value: any = undefined) {
    this.postMessage({ type: "set", property, value });
  }

  sendResponse(requestId: string, payload: any = {}) {
    this.postMessage({ type: "response", requestId, payload});
  }

  sendNotification(kind: NotificationKind, payload: any = {}) {
    this.postMessage({ type: "notification", kind, payload});
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
