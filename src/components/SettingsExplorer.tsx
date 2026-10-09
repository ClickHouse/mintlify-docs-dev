import { useEffect, useMemo, useState } from "react";

type Setting = { name: string; href: string; default?: string };
type Group = { label: string; count: number; settings: Setting[] };
type Index = { schemaVersion: 1; clickhouseVersion: string; displayPath: string; groups: Group[] };

function withDocsBase(value: string) {
  if (typeof window === "undefined" || !window.location.pathname.startsWith("/docs")) return value;
  // Snapshot artifacts served through the website worker already include the
  // production base path. Generated Head indexes do not.
  return value === "/docs" || value.startsWith("/docs/") ? value : `/docs${value}`;
}

function terms(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().split(/[^a-z0-9]+/)
    .filter((term) => term.length > 1).map((term) => term.length > 3 && term.endsWith("s") ? term.slice(0, -1) : term);
}

function matches(value: string, query: string, queryTerms: string[]) {
  if (!query) return true;
  const candidate = value.toLowerCase();
  if (!query.includes("%")) return queryTerms.every((term) => terms(value).some((candidateTerm) => candidateTerm.startsWith(term)));
  const parts = query.split("%");
  let position = 0;
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (!part) continue;
    const match = candidate.indexOf(part, position);
    if (match < 0 || (index === 0 && !query.startsWith("%") && match !== 0)) return false;
    position = match + part.length;
  }
  const last = parts.at(-1);
  return query.endsWith("%") || !last || position === candidate.length;
}

export function SettingsExplorer({ indexUrl }: { indexUrl: string }) {
  const [index, setIndex] = useState<Index>();
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(withDocsBase(indexUrl), { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(String(response.status))))
      .then((payload: Index) => {
        if (payload.schemaVersion !== 1 || !Array.isArray(payload.groups)) throw new Error("Unsupported settings explorer index");
        setIndex(payload);
      })
      .catch((reason: unknown) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) setFailed(true);
      });
    return () => controller.abort();
  }, [indexUrl]);

  const normalized = search.trim().toLowerCase();
  const queryTerms = useMemo(() => terms(search), [search]);
  const searching = normalized.includes("%") ? normalized.replaceAll("%", "").trim().length > 0 : queryTerms.length > 0;
  const groups = useMemo(() => !index ? [] : (searching
    ? index.groups.map((group) => {
      const settings = group.settings.filter((setting) => matches(setting.name, normalized, queryTerms));
      return { ...group, settings, count: settings.length };
    }).filter((group) => group.count > 0)
    : index.groups), [index, normalized, searching, queryTerms]);
  const count = groups.reduce((total, group) => total + group.count, 0);
  const allExpanded = groups.length > 0 && groups.every((group) => expanded.has(group.label));

  if (!index) return <div className="not-prose my-6 text-sm text-gray-500 dark:text-gray-400">{failed ? "Settings explorer could not be loaded." : "Loading settings explorer…"}</div>;

  const toggleAll = () => setExpanded(allExpanded ? new Set() : new Set(index.groups.map((group) => group.label)));

  return <div className="not-prose my-6 w-full">
    <div className="relative w-full">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-3 h-4 w-4 text-gray-500 dark:text-gray-400" style={{ top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      <input aria-label="Search settings" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search settings, e.g. parallel replicas or %materialized%" className="w-full rounded-lg border border-gray-500 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-600 focus:border-gray-600 focus:outline-0 focus-visible:outline-0 dark:border-white/30 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#fdff75]" />
    </div>
    {searching && <div className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">{count} matching {count === 1 ? "setting" : "settings"}</div>}
    <div className="mt-3 w-full overflow-x-auto rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 font-mono text-sm leading-6 dark:border-white/10 dark:bg-transparent">
      <div className="flex min-w-full items-center justify-between gap-4"><div className="min-w-max font-semibold">{index.displayPath}</div><button type="button" aria-label={allExpanded ? "Collapse all" : "Expand all"} aria-pressed={allExpanded} disabled={searching} onClick={toggleAll} className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded border-0 bg-transparent px-1 py-0.5 font-sans text-xs font-medium text-gray-600 hover:text-gray-900 focus:outline-0 focus-visible:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-[#fdff75] dark:focus-visible:text-[#fdff75]"><span aria-hidden="true">{allExpanded ? "⌄" : "›"}</span><span>{allExpanded ? "Collapse all" : "Expand all"}</span></button></div>
      {groups.length ? groups.map((group, groupIndex) => {
        const open = searching || expanded.has(group.label);
        const lastGroup = groupIndex === groups.length - 1;
        return <div key={group.label} className="min-w-max">
          <button type="button" aria-expanded={open} disabled={searching} onClick={() => setExpanded((current) => { const next = new Set(current); if (next.has(group.label)) next.delete(group.label); else next.add(group.label); return next; })} className="flex min-w-max items-baseline whitespace-nowrap text-left disabled:cursor-default" style={{ appearance: "none", background: "transparent", border: 0, color: "inherit", cursor: searching ? "default" : "pointer", font: "inherit", lineHeight: "inherit", padding: 0 }}><span aria-hidden="true" className="inline-block w-4">{open ? "▾" : "▸"}</span><span className="font-medium">{group.label}</span><span className="ml-3 text-xs text-gray-500 dark:text-gray-400">{group.count} {group.count === 1 ? "setting" : "settings"}</span></button>
          {open && group.settings.map((setting, settingIndex) => <div key={setting.name} className="grid min-w-max items-start gap-x-3 whitespace-nowrap" style={{ gridTemplateColumns: "44ch max-content" }}><span className="flex min-w-0 items-start"><span aria-hidden="true" className="w-4 shrink-0" /><span aria-hidden="true" className="shrink-0 select-none text-gray-400 dark:text-gray-600">{lastGroup && settingIndex === group.settings.length - 1 ? "└─ " : "├─ "}</span><a href={withDocsBase(setting.href)} className="min-w-0 whitespace-normal no-underline hover:underline" style={{ overflowWrap: "anywhere" }}>{setting.name}</a></span>{setting.default !== undefined && <span title="Default value" className="whitespace-nowrap text-gray-500 dark:text-gray-400">(default: {setting.default})</span>}</div>)}
        </div>;
      }) : <div className="py-2 text-gray-500 dark:text-gray-400">No matching settings</div>}
    </div>
  </div>;
}
