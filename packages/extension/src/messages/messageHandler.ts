import * as vscode from "vscode";
import { store } from "../store";
import { CloudformationDocument } from "cloudformation-3d-shared";

type HandlerFunction = (payload: any) => void;

type BaseMessage = {
  type: string;
};

type ReadyMessage = {
  type: "ready";
  ready: Boolean;
};

function isReadyMessage(message: Message): message is ReadyMessage {
  return message.type === "ready";
}

type CallMessage = {
  type: "call";
  functionName: string;
  parameters?: Record<string, any>;
};

function isCallMessage(message: Message): message is CallMessage {
  return message.type === "call";
}

type AsyncMessage = {
  type: "async";
  requestId: string;
  functionName: string;
  parameters?: Record<string, any>;
};

function isAsyncMessage(message: Message): message is AsyncMessage {
  return message.type === "async";
}

type Message = BaseMessage | ReadyMessage | CallMessage | AsyncMessage;

export default class MessageHandler {
  [key: string]: HandlerFunction | any;

  private onReady: Array<Function> = [];

  constructor() {
    this.onReady.push(() => {
      store.messageSender.setWebviewStoreValue("workspaceMode", store.getWorkspaceMode());
      console.info("Sent workspaceMode", store.getWorkspaceMode());
    })
    console.log("onReady constructor", this.onReady);
  }

  handleMessage(message: Message) {
    if (isReadyMessage(message)) {
      store.webviewReady = message.ready;
      console.info(
        `The webview has signaled that is ${message.ready ? "" : "not "}ready`
      );
      console.log("onReady", this.onReady);
      this.onReady.forEach((handlerFunction) => handlerFunction.call(store.messageHandler, {}));
    }

    if (isCallMessage(message) && message.functionName !== "handleMessage") {
      const handlerFunction = store.messageHandler[message.functionName];
      if (typeof handlerFunction === "function") {
        handlerFunction.call(store.messageHandler, message.parameters);
      } else {
        console.warn(
          `No handler found for message type: ${message.functionName}`
        );
      }
    }

    if (isAsyncMessage(message) && message.functionName !== "handleMessage") {
      const asyncFunctionName = message.functionName + "Async";
      const handlerFunction = store.messageHandler[asyncFunctionName];
      if (typeof handlerFunction === "function") {
        handlerFunction.call(store.messageHandler, {
          requestId: message.requestId,
          ...message.parameters,
        });
      } else {
        console.warn(
          `No async handler found for message type: ${message.functionName} (looking for ${asyncFunctionName}) (RequestId: ${message.requestId})`
        );
      }
    }
  }

  showInformationMessage({ content }: { content: string }) {
    vscode.window.showInformationMessage(`${content}`);
  }

  getMainDocumentUriAsync({ requestId }: {requestId: string}) {
    store.messageSender.sendResponse(requestId, {
      mainDocumentUri: store.document?.uri
    });
  }

  getMainDocumentSymbolsAsync({ requestId }: {requestId: string}) {
    if (store.document) {
    store.symbolsProvider.getCloudformationDocument(store.document.uri).then((document: CloudformationDocument) => {
      store.messageSender.sendResponse(requestId, {
        document
      })
    })
    }
  }
}
