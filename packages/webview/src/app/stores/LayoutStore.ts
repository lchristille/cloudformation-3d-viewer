import { makeAutoObservable } from "mobx";

class LayoutStore {
    showStats = false;
    showSidebar = true;

    constructor() {
        makeAutoObservable(this);
    }

    toggleStatsVisibility() {
        this.showStats = !this.showStats;
    }

    toggleSidebarVisibility() {
        this.showSidebar = !this.showSidebar;
    }
}

export const layoutStore = new LayoutStore();