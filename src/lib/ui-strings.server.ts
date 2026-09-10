import fs from "node:fs";
import path from "node:path";

import { localeRouteName } from "@/util/locales";

const translationRoot = path.join(process.cwd(), "i18n");
const sourceFile = path.join(translationRoot, "en", "ui.json");
const source = JSON.parse(fs.readFileSync(sourceFile, "utf8")) as UiStrings;
const cache = new Map<string, UiStrings>([["en", source]]);

export type UiStrings = {
  account: {
    clickHouseOnGitHub: string;
    getStarted: string;
    signIn: string;
  };
  actions: {
    choosePath: string;
    copied: string;
    copyFailed: string;
    copyPage: string;
    editPage: string;
    reportIssue: string;
    setupDocsMcp: string;
    updated: string;
    view: string;
    viewMarkdown: string;
  };
  navigation: {
    breadcrumb: string;
    chooseLanguage: string;
    close: string;
    documentationTools: string;
    home: string;
    homeAria: string;
    navigation: string;
    next: string;
    open: string;
    pages: string;
    pagination: string;
    previous: string;
    primary: string;
    site: string;
    toggleSection: string;
  };
  search: {
    ask: string;
    askAi: string;
    askAiAboutClickHouse: string;
    filter: string;
    filterNavigation: string;
    search: string;
    searchDocumentation: string;
    searchShort: string;
  };
  status: {
    draft: string;
    forHumans: string;
    loading: string;
  };
  theme: {
    dark: string;
    light: string;
    preference: string;
    system: string;
  };
  toc: {
    jumpToSection: string;
    onThisPage: string;
    overview: string;
    tableOfContents: string;
  };
};

/** Load GT's checked-in UI dictionary for a locale, or English before its first translation run. */
export function uiStrings(locale = "en"): UiStrings {
  const key = localeRouteName(locale);
  const cached = cache.get(key);
  if (cached) return cached;

  const localizedFile = path.join(translationRoot, key, "ui.json");
  const messages = fs.existsSync(localizedFile)
    ? (JSON.parse(fs.readFileSync(localizedFile, "utf8")) as UiStrings)
    : source;
  cache.set(key, messages);
  return messages;
}
