import { layoutStore } from "./LayoutStore";
import { vsCodeStore } from "./VsCodeStore";

class Store {
    layoutStore = layoutStore;
    vsCodeStore = vsCodeStore;
}

export const store = new Store();