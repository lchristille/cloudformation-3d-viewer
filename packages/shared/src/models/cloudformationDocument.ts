import * as vscode from "vscode";
import { CFSymbolKind, CFTemplateLanguage } from "./enums";

export interface CloudformationDocument {
  fileName: string;
  relativePath: string;
  uri: vscode.Uri;
  templateLanguage: CFTemplateLanguage
  symbols: SymbolNode[];
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
