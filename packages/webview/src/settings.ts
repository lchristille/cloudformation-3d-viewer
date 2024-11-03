export let PUBLIC_URI: URL | null;
export let TEXTURE_URI: URL | null;

let initialized = false;

export function InitSettings() {
  if (!initialized) {
    const metaConfig: HTMLMetaElement | null = document.querySelector(
      'meta[name="webview-config"]'
    );
    PUBLIC_URI = new URL(metaConfig?.dataset.publicUri ?? "");
    TEXTURE_URI = new URL("textures/", PUBLIC_URI);
  }
}
