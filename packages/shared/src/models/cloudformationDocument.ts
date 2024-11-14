import * as vscode from "vscode";
import * as YAML from "yaml";
import { CFSymbolKind, CFTemplateLanguage } from "./enums";

export interface CloudformationDocument {
  fileName: string;
  relativePath: string;
  uri: vscode.Uri;
  templateLanguage: CFTemplateLanguage
  parsedDocument: YAML.Document;
  documentSymbols: DocumentSymbols;
  content: any
}

export interface DocumentSymbols {
  AWSTemplateFormatVersion?: SymbolNode;
  Description?: SymbolNode;
  Metadata?: SymbolNode;
  Parameters?: SymbolNode;
  Rules?: SymbolNode;
  Mappings?: SymbolNode;
  Conditions?: SymbolNode;
  Transform?: SymbolNode;
  Resources: SymbolNode;
  Outputs?: SymbolNode;
}

export interface SymbolNode {
  name: string;
  kind: CFSymbolKind;
  value?: SymbolValue | SymbolValue[]
  keyRange: SymbolRange;
  children: SymbolNode[];
}

export interface SymbolValue {
  kind: CFSymbolKind;
  value: number | string | boolean | null | undefined;
  range: SymbolRange
}

export interface SymbolRange {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  }
}
