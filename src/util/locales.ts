/** Locale metadata shared by routes and the language switcher. */
export const LOCALE_METADATA = {
  en: { label: "English", hreflang: "en", dir: "ltr" },
  ar: { label: "العربية", hreflang: "ar", dir: "rtl" },
  es: { label: "Español", hreflang: "es", dir: "ltr" },
  fr: { label: "Français", hreflang: "fr", dir: "ltr" },
  ja: { label: "日本語", hreflang: "ja", dir: "ltr" },
  ko: { label: "한국어", hreflang: "ko", dir: "ltr" },
  "pt-br": { label: "Português (Brasil)", hreflang: "pt-BR", dir: "ltr" },
  ru: { label: "Русский", hreflang: "ru", dir: "ltr" },
  zh: { label: "中文", hreflang: "zh", dir: "ltr" },
} as const;

export type LocaleCode = keyof typeof LOCALE_METADATA;

export interface NotTranslatedNotice {
  label: string;
  title: string;
  message: string;
}

const NOT_TRANSLATED: Partial<Record<LocaleCode, NotTranslatedNotice>> = {
  ar: { label: "ملاحظة", title: "لم تُترجم بعد", message: "هذه الصفحة لم تُترجم بعد؛ يتم عرض النسخة الإنجليزية." },
  es: { label: "Nota", title: "Aún no traducida", message: "Esta página aún no está traducida; se muestra la versión en inglés." },
  fr: { label: "Remarque", title: "Pas encore traduit", message: "Cette page n'est pas encore traduite ; la version anglaise est affichée." },
  ja: { label: "注記", title: "未翻訳", message: "このページはまだ翻訳されていません。英語版を表示しています。" },
  ko: { label: "참고", title: "아직 번역되지 않음", message: "이 페이지는 아직 번역되지 않았습니다. 영어 버전이 표시됩니다." },
  "pt-br": { label: "Observação", title: "Ainda não traduzida", message: "Esta página ainda não foi traduzida; a versão em inglês é exibida." },
  ru: { label: "Примечание", title: "Перевод пока недоступен", message: "Эта страница ещё не переведена; показана английская версия." },
  zh: { label: "注意", title: "尚未翻译", message: "此页面尚未翻译，显示的是英文版本。" },
};

export function localeInfo(locale: string) {
  return LOCALE_METADATA[locale.toLowerCase() as LocaleCode] ?? LOCALE_METADATA.en;
}

export function notTranslatedNotice(locale: string): NotTranslatedNotice {
  return NOT_TRANSLATED[locale.toLowerCase() as LocaleCode] ?? {
    label: "Note",
    title: "Not translated yet",
    message: "This page is not translated yet; the English version is shown.",
  };
}

/** Canonical locale segment used by the deployed Mintlify documentation. */
export function localeRouteName(locale: string): string {
  const code = locale.toLowerCase();
  return code === "pt-br" ? "pt-BR" : code;
}

/** Convert a documentation path between English and a locale-prefixed route. */
export function localePath(pathname: string, locale: string): string {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const code = locale.toLowerCase();
  // English has no URL prefix. Be defensive about a stale client-side route
  // carrying `/en` during a language switch; `/docs/en` is not a real page.
  const documentPath = normalized === "/en" ? "/" : normalized.replace(/^\/en\//, "/");
  return code === "en" ? documentPath : `/${localeRouteName(code)}${documentPath === "/" ? "" : documentPath}`;
}
