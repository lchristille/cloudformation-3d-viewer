import { makeAutoObservable } from "mobx";

class LayoutStore {
    showStats = false;

    constructor() {
        makeAutoObservable(this);
    }

    toggleStatsVisibility() {
        this.showStats = !this.showStats;
    }
}

export const layoutStore = new LayoutStore();