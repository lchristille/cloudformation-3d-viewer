import { makeAutoObservable, runInAction } from "mobx";
import { notifier } from "./Notifier";
import {
  CFResource,
  CFResources,
  Notification,
} from "cloudformation-3d-shared";
import { store } from "./Store";
import { OutlinerTreeNode } from "../types/OutlinerTreeNode";
import { Children } from "react";

class SceneStore {
  templateResources: CFResources = new Map();

  outlinerTreeNodes: OutlinerTreeNode[] = [];

  constructor() {
    makeAutoObservable(this);
    notifier.subscribe("template.addedDocument", this.onTemplateAddedDocument);
  }

  private onTemplateAddedDocument = async (n: Notification) => {
    console.info("Received onTemplateAddedDocument", n);
    const templateResources = await store.vsCodeStore.getTemplateResources();
    console.log(templateResources);
    runInAction(() => {
      Object.keys(templateResources.resources).forEach((key: string) => {
        this.templateResourceToOutlinerTreeNode(templateResources.resources[key]);
      });
      this.outlinerTreeNodes.sort((a, b) => a.label.localeCompare(b.label))
    });
  }

  private templateResourceToOutlinerTreeNode = (resource: CFResource) => {
    console.log(resource);
    const serviceTypeIdentifier = resource.Specs?.ServiceTypeIdentifier ?? "Other";
    let serviceTypeIdentifierNode = this.outlinerTreeNodes.find(
      (x) => x.label === serviceTypeIdentifier
    );
    if (!serviceTypeIdentifierNode) {
      serviceTypeIdentifierNode = {
        itemId: serviceTypeIdentifier.toLowerCase(),
        label: serviceTypeIdentifier,
        children: [],
      };
      this.outlinerTreeNodes.push(serviceTypeIdentifierNode);
    }

    serviceTypeIdentifierNode.children!.push({
      itemId: `${
        resource.LogicalName.toLowerCase()
      }`,
      label: resource.LogicalName,
    });
    serviceTypeIdentifierNode.children!.sort((a, b) => a.label.localeCompare(b.label));
  }

  dispose() {
    notifier.unsubscribe(
      "template.addedDocument",
      this.onTemplateAddedDocument
    );
  }
}

export const sceneStore = new SceneStore();
