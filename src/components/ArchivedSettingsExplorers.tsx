import { useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { SettingsExplorer } from "./SettingsExplorer";

/** Mount the current explorer UI into versioned data placeholders in an archived body. */
export function ArchivedSettingsExplorers() {
  useEffect(() => {
    const roots = new Map<HTMLElement, Root>();

    const mount = () => {
      const placeholders = document.querySelectorAll<HTMLElement>("[data-reference-settings-explorer][data-reference-settings-index-url]");
      const active = new Set(placeholders);
      roots.forEach((root, element) => {
        if (active.has(element)) return;
        root.unmount();
        roots.delete(element);
      });
      placeholders.forEach((element) => {
        if (roots.has(element)) return;
        const indexUrl = element.dataset.referenceSettingsIndexUrl;
        if (!indexUrl) return;
        const root = createRoot(element);
        roots.set(element, root);
        root.render(<SettingsExplorer indexUrl={indexUrl} />);
      });
    };

    mount();
    document.addEventListener("reference:body-loaded", mount);
    return () => {
      document.removeEventListener("reference:body-loaded", mount);
      roots.forEach((root) => root.unmount());
      roots.clear();
    };
  }, []);

  return null;
}
