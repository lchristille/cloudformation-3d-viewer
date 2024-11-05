import * as vscode from 'vscode';

export enum WorkspaceMode {
    Folder = "folder",
    SingleFile = "singleFile",
    Unknown = "unknown"
}

export enum CFTemplateLanguage {
    Yaml = 'yaml',
    Json = 'json'
}

export enum CFSymbolKind {
		File = 0,
		Module = 1, // used
		Namespace = 2,
		Package = 3,
		Class = 4,
		Method = 5,
		Property = 6,
		Field = 7,
		Constructor = 8,
		Enum = 9,
		Interface = 10,
		Function = 11,
		Variable = 12,
		Constant = 13,
		String = 14, // used
		Number = 15,
		Boolean = 16,
		Array = 17, //used
		Object = 18,
		Key = 19,
		Null = 20,
		EnumMember = 21,
		Struct = 22,
		Event = 23,
		Operator = 24,
		TypeParameter = 25,
        Other = 99
}

export function fromVSCodeSymbolKind(kind: vscode.SymbolKind): CFSymbolKind {
    return (CFSymbolKind[kind] !== undefined) ? kind as unknown as CFSymbolKind : CFSymbolKind.Other;
}