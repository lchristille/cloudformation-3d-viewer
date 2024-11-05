import * as vscode from "vscode";
import { getNonce } from "./helpers/util";
import { CspBuilder, CspDirective } from "./helpers/cspBuilder";
import { store } from "./store";

/**
 * Provider for cat scratch editors.
 *
 * Cat scratch editors are used for `.cscratch` files, which are just json files.
 * To get started, run this extension and open an empty `.cscratch` file in VS Code.
 *
 * This provider demonstrates:
 *
 * - Setting up the initial webview for a custom editor.
 * - Loading scripts and styles in a custom editor.
 * - Synchronizing changes between a text document and a custom editor.
 */
export class CloudFormation3DViewerProvider
  implements vscode.CustomTextEditorProvider
{
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new CloudFormation3DViewerProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      CloudFormation3DViewerProvider.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: true,
      }
    );
    return providerRegistration;
  }

  public static readonly viewType = "cloudformation3d.viewer";

  constructor(private readonly context: vscode.ExtensionContext) {
    store.context = context;
  }

  /**
   * Called when our custom editor is opened.
   *
   *
   */
  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Setup initial content for the webview
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(
          this.context.extensionUri,
          "..",
          "webview",
          "public"
        ),
        vscode.Uri.joinPath(this.context.extensionUri, "..", "webview", "dist"),
      ],
    };

    store.webViewPanel = webviewPanel;
    store.document = document;

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    // Hook up event handlers so that we can synchronize the webview with the text document.
    //
    // The text document acts as our model, so we have to sync change in the document to our
    // editor and sync changes in the editor back to the document.
    //
    // Remember that a single text document can also be shared between multiple custom
    // editors (this happens for example when you split a custom editor)

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
      (e) => {
        if (e.document.uri.toString() === document.uri.toString()) {
          //updateWebview();
        }
      }
    );

    // Make sure we get rid of the listener when our editor is closed.
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage(store.messageHandler.handleMessage.bind(store.messageHandler));

  }

  /**
   * Get the static html used for the editor webviews.
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
    // Local path to script and css for the webview
    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    const isDevelopment = process.env.NODE_ENV === "development";
    const cspBuilder = new CspBuilder(isDevelopment);
    const csp = cspBuilder
      .addSource(CspDirective.ImgSrc, webview.cspSource)
      .addSource(CspDirective.ImgSrc, "data:", true)
      .addSource(CspDirective.StyleSrc, webview.cspSource)
      .addSource(CspDirective.StyleSrc, `'unsafe-inline'`, true)
      .addSource(CspDirective.StyleSrc, "https://*.vscode-cdn.net", true)
      .addSource(CspDirective.ScriptSrc, `'nonce-${nonce}'`)
      .addSource(CspDirective.ScriptSrc, `'wasm-unsafe-eval'`, true)
      .addSource(CspDirective.ScriptSrc, "http://localhost:9900", true)
      .addSource(CspDirective.ScriptSrc, "http://localhost:8097", true)
      .addSource(CspDirective.ScriptSrc, "blob:", true)
      .addSource(CspDirective.ConnectSrc, webview.cspSource)
      .addSource(CspDirective.ConnectSrc, "https://www.gstatic.com/draco/")
      .addSource(CspDirective.ConnectSrc, "http://localhost:9900", true)
      .addSource(CspDirective.ConnectSrc, "ws://localhost:9900", true)
      .addSource(CspDirective.ConnectSrc, "ws://localhost:8097", true)
      .addSource(CspDirective.ConnectSrc, "data:", true)
      .addSource(CspDirective.WorkerSrc, "blob:", true)
      .addSource(CspDirective.FontSrc, webview.cspSource)
      .addSource(CspDirective.FontSrc, "data:", true)
      .build();

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "..",
        "webview",
        "dist",
        "bundle.js"
      )
    );

    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "..",
        "webview",
        "public",
        "styles",
        "reset.css"
      )
    );

    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "..",
        "webview",
        "public",
        "styles",
        "vscode.css"
      )
    );

    const publicUri =
      webview.asWebviewUri(
        vscode.Uri.joinPath(
          this.context.extensionUri,
          "..",
          "webview",
          "public"
        )
      ) + "/";

    return /* html */ `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="${csp}">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

        <meta name="webview-config" data-public-uri="${publicUri}">

				<link href="${styleResetUri}" rel="stylesheet" />
				<link href="${styleVSCodeUri}" rel="stylesheet" />

				<title>CloudFormation 3D Viewer</title>
			</head>
			<body>
        <div id="root"></div>
        ${
          isDevelopment
            ? `<script nonce="${nonce}" src="http://localhost:8097"></script><script nonce="${process.env.NONCE}" src="http://localhost:9900/bundle.js"></script>`
            : `<script nonce="${nonce}" src="${scriptUri}"></script>`
        }
			</body>
			</html>`;
  }
}