import * as vscode from "vscode";
import YAML, { Pair } from "yaml";
import {
  CloudformationDocument,
  SymbolNode,
  CFTemplateLanguage,
  CFSymbolKind,
  SymbolValue,
  SymbolRange,
  DocumentSymbols
} from "cloudformation-3d-shared";
import path from "path";

export default class CloudformationDocumentProvider {
  public async getCloudformationDocument(
    uri: vscode.Uri
  ): Promise<CloudformationDocument> {
    const result = {} as CloudformationDocument;
    try {
      const document = await vscode.workspace.openTextDocument(uri);

      result.fileName = path.basename(document.fileName);
      result.relativePath = vscode.workspace.asRelativePath(uri);
      result.uri = uri;

      const documentText = document.getText();

      if (["yaml", "json"].includes(document.languageId)) {
        result.templateLanguage = document.languageId as CFTemplateLanguage;

        switch (result.templateLanguage) {
          case CFTemplateLanguage.Yaml:
            const lineCounter = new YAML.LineCounter();
            const customTags = [
              {
                identify: (value: any) => typeof value === "string",
                tag: "!Ref",
                resolve: (str: String) => ({ Ref: str }),
              },
            ];
            result.parsedDocument = YAML.parseDocument(documentText, {
              keepSourceTokens: true,
              stringKeys: true,
              lineCounter: lineCounter,
              customTags: customTags,
            });
            result.content = result.parsedDocument.toJS();

            /* Symbols.... probably useful to handle a unified structure between YAML and JSON? */
            const symbols = this.parseSymbolsFromYaml(result.parsedDocument, lineCounter);
            result.documentSymbols = {} as DocumentSymbols;
            const resourcesSymbols = symbols.find(x => x.name === "Resources");
            if (!resourcesSymbols) {
              throw new Error(`The document ${uri} has no resources section (The Resources section is a required top-level section in a CloudFormation template).`);
            }
            result.documentSymbols.Resources = resourcesSymbols;
            result.documentSymbols.AWSTemplateFormatVersion = symbols.find(x => x.name === "AWSTemplateFormatVersion");
            result.documentSymbols.Description = symbols.find(x => x.name === "Description");
            result.documentSymbols.Metadata = symbols.find(x => x.name === "Metadata");
            result.documentSymbols.Parameters = symbols.find(x => x.name === "Parameters");
            result.documentSymbols.Rules = symbols.find(x => x.name === "Rules");
            result.documentSymbols.Mappings = symbols.find(x => x.name === "Mappings");
            result.documentSymbols.Conditions = symbols.find(x => x.name === "Conditions");
            result.documentSymbols.Transform = symbols.find(x => x.name === "Transform");
            result.documentSymbols.Outputs = symbols.find(x => x.name === "Outputs");
        }
      } else {
        vscode.window.showInformationMessage(
          "No symbols found in the document."
        );
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        `Error fetching document symbols: ${error}`
      );
    }
    return result;
  }

  /* YAML PARSING */
  private parseSymbolsFromYaml(
    doc: YAML.Document,
    lineCounter: YAML.LineCounter
  ): SymbolNode[] {
    const symbols: SymbolNode[] = [];
    if (doc.contents && YAML.isMap(doc.contents)) {
      doc.contents?.items.forEach((item: unknown) => {
        if (YAML.isPair(item)) {
          const node = this.parseYamlPair(item, lineCounter);
          if (node) symbols.push(node);
        }
      });
    }
    return symbols;
  }

  private parseYamlPair(
    node: YAML.Pair,
    lineCounter: YAML.LineCounter
  ): SymbolNode | undefined {
    let symbolNode: SymbolNode | undefined = undefined;
    const keyNode = node.key;
    if (YAML.isScalar<string>(keyNode) && keyNode.range) {
      const startPos = lineCounter.linePos(keyNode.range[0]);
      const endPos = lineCounter.linePos(keyNode.range[1]);
      symbolNode = {
        name: keyNode.value,
        keyRange: {
          start: {
            line: startPos.line,
            column: startPos.col,
          },
          end: {
            line: endPos.line,
            column: endPos.col,
          },
        },
      } as SymbolNode;
    }

    if (symbolNode !== undefined) {
      const valueNode = node.value;
      if (YAML.isNode(valueNode)) {
        if (YAML.isScalar(valueNode)) {
          symbolNode.value = this.parseYamlScalar(valueNode, lineCounter);
        }

        if (YAML.isMap(valueNode)) {
          symbolNode.kind == CFSymbolKind.Object;
          symbolNode.children = valueNode.items
            .map((x) => this.parseYamlPair(x, lineCounter))
            .filter((x) => !!x);
        }

        if (YAML.isSeq(valueNode)) {
          symbolNode.kind == CFSymbolKind.Array;
          symbolNode.value = valueNode.items.map((x) => {
            if (YAML.isScalar(x)) {
              return this.parseYamlScalar(x, lineCounter);
            }
          }).filter(x => !!x);
        }
      }

      return symbolNode;
    }
  }

  private parseYamlScalar(
    node: YAML.Scalar,
    lineCounter: YAML.LineCounter
  ): SymbolValue | undefined {
    if (!node.range) return undefined;

    const startPos = lineCounter.linePos(node.range[0]);
    const endPos = lineCounter.linePos(node.range[1]);

    const valueRange: SymbolRange = {
      start: {
        line: startPos.line,
        column: startPos.col,
      },
      end: {
        line: endPos.line,
        column: endPos.col,
      },
    };

    if (typeof node.value === "number") {
      return {
        kind: CFSymbolKind.Number,
        value: node.value,
        range: valueRange,
      };
    }
    if (typeof node.value === "string") {
      return {
        kind: CFSymbolKind.String,
        value: node.value,
        range: valueRange,
      };
    }
    if (typeof node.value === "boolean") {
      return {
        kind: CFSymbolKind.Boolean,
        value: node.value,
        range: valueRange,
      };
    }
  }
}
