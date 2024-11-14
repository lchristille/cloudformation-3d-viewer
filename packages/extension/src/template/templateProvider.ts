import * as vscode from "vscode";
import {
  CloudformationDocument,
  CFResources,
  CFResource,
  SymbolNode,
  SymbolValue,
  getResourceTypeDefinition,
} from "cloudformation-3d-shared";
import { store } from "../store";
import CloudformationDocumentProvider from "../document/documentProvider";

export class TemplateProvider {
  private provider: CloudformationDocumentProvider =
    new CloudformationDocumentProvider();
  private documents: CloudformationDocument[] = [];

  public async addDocument(uri: vscode.Uri) {
    const cloudformationDocument =
      await this.provider.getCloudformationDocument(uri);
    this.documents.push(cloudformationDocument);
    store.messageSender.sendNotification("template.addedDocument", {
      fileName: cloudformationDocument.fileName,
      relativePath: cloudformationDocument.relativePath,
    });
  }

  public async getResources(): Promise<CFResources> {
    const result: CFResources = {} as CFResources;
    for (const doc of this.documents) {
      const resources = doc.content.hasOwnProperty("Resources")
        ? doc.content["Resources"]
        : [];
      for (const logicalName in resources) {
        const rawResource = resources[logicalName];
        result[logicalName] = {
          LogicalName: logicalName,
          Type: rawResource.hasOwnProperty("Type")
            ? rawResource["Type"]
            : "Local::Unknown::Unknown",
          Properties: rawResource.hasOwnProperty("Type")
            ? rawResource["Properties"]
            : {},
        } as CFResource;
        if (!!rawResource["Type"]) {
          result[logicalName]['Specs'] = getResourceTypeDefinition(
            "eu-central-1",
            rawResource["Type"]
          );
        }
      }
    }
    return result;
  }
}
