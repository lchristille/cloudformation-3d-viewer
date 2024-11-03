import * as vscode from "vscode";
import { CloudFormation3DViewerProvider } from "./cloudformation-3d-viewer";

export function activate(context: vscode.ExtensionContext) {
  // Register our custom editor providers
  context.subscriptions.push(CloudFormation3DViewerProvider.register(context));
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "cloudformation3d.openCustomEditorInSideGroup",
      async (uri: vscode.Uri) => {
        // Get the active editor and its URI
        const activeEditor = vscode.window.activeTextEditor;
        if (
          activeEditor &&
          (activeEditor.document.languageId === "yaml" ||
            activeEditor.document.languageId === "json")
        ) {
          const uri = activeEditor.document.uri;

          await checkAwsToolkitExtension();

          // Open the custom editor in the side view
          await vscode.commands.executeCommand(
            "vscode.openWith",
            uri,
            "cloudformation3d.viewer",
            vscode.ViewColumn.Beside,
            {
            }
          );
        } else {
          vscode.window.showErrorMessage(
            "No supported file open in the editor."
          );
        }
      }
    )
  );
}

async function checkAwsToolkitExtension() {
  const awsToolkitExtensions = vscode.extensions.getExtension(
    "amazonwebservices.aws-toolkit-vscode"
  );
  if (!awsToolkitExtensions) {
    vscode.window.showErrorMessage(
      "AWS Toolkit extension is not installed. Please install it to enable CloudFormation Templates parsing features."
    );
    return;
  }

  // Activate the extension if it's not already activated
  await awsToolkitExtensions.activate();
}
