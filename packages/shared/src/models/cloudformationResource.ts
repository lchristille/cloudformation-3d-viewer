import { CFResourceType } from "./cloudformationResourceType";

export interface CFSpecs {
  DataTypeName: string;
  ResourceTypeIdentifier: string;
  ServiceHumanReadableName: string;
  ServiceName: string;
  ServiceProvider: string;
  ServiceTypeIdentifier: string;
  specification: any;
}

export interface CFResource {
  Type: CFResourceType;
  LogicalName: string;
  Properties: any;
  Specs?: CFSpecs;
}

export type CFResources = { [key: string]: any };
