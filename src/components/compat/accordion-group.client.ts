import { mount } from "@cloudflare/nimbus-docs/client";

let groupSequence = 0;

function initAccordionGroup(root: HTMLElement): () => void {
  const accordions = Array.from(root.querySelectorAll<HTMLDetailsElement>("details.ch-accordion"))
    .filter((accordion) => accordion.closest<HTMLElement>("[data-ch-accordion-group]") === root);

  if (accordions.length < 2) return () => {};

  const groupName = `ch-accordion-group-${++groupSequence}`;
  accordions.forEach((accordion) => accordion.setAttribute("name", groupName));

  // `name` gives modern browsers native exclusive disclosure behavior. Keep
  // the toggle handler as a small compatibility layer for older engines.
  const onToggle = (event: Event) => {
    const opened = event.target;
    if (!(opened instanceof HTMLDetailsElement) || !opened.open || !accordions.includes(opened)) return;

    accordions.forEach((accordion) => {
      if (accordion !== opened) accordion.open = false;
    });
  };

  root.addEventListener("toggle", onToggle, true);

  // Invalid authored state should still settle on a single expanded item.
  accordions.filter((accordion) => accordion.open).slice(1).forEach((accordion) => {
    accordion.open = false;
  });

  return () => {
    root.removeEventListener("toggle", onToggle, true);
    accordions.forEach((accordion) => {
      if (accordion.getAttribute("name") === groupName) accordion.removeAttribute("name");
    });
  };
}

mount("[data-ch-accordion-group]", initAccordionGroup);
