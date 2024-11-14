import { layoutStore } from "./LayoutStore";
import { notifier } from "./Notifier";
import { sceneStore } from "./SceneStore";
import { vsCodeStore } from "./VsCodeStore";

class Store {
    layoutStore = layoutStore;
    vsCodeStore = vsCodeStore;
    sceneStore = sceneStore;
    notifier = notifier;
}

export const store = new Store();