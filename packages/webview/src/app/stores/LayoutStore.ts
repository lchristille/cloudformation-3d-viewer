import { makeAutoObservable } from "mobx";

class LayoutStore {
    showStats = false;
    showOutliner = false;

    constructor() {
        makeAutoObservable(this);
    }

    toggleStatsVisibility() {
        this.showStats = !this.showStats;
    }

    toggleOutlinerVisibility() {
        this.showOutliner = !this.showOutliner;
    }
}

export const layoutStore = new LayoutStore();