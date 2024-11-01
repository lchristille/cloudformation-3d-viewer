import { InitSettings } from "./settings";
InitSettings()

export function AppendURL(
  baseUrl: URL | string,
  path: string | string[]
): string {
    if (typeof path === "string") {
      return new URL(path, baseUrl).href;
    } else if (Array.isArray(path)) {
      const combinedPath = path.join("/");
      return new URL(combinedPath, baseUrl).href;
    }
    throw new Error("AppendURL: error appending the path")
}
