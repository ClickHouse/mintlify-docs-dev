export type RouteContractEntry = {
  route: string;
  disposition: "snapshot" | "redirect" | "snapshot-omitted" | "feature-gated" | "derived" | "retained-historical" | "retained-template";
  snapshotEntity?: { type: string; name: string };
  redirectFrom?: string[];
  redirectTo?: string;
  feature?: string;
  note: string;
};

// Transitional source metadata. The snapshot-metadata generator writes this
// contract into each release snapshot; renderers consume that copy exclusively.
export const ROUTE_CONTRACT_ENTRIES: RouteContractEntry[] = [
  { route: "/reference/statements/select/order-by", disposition: "snapshot", snapshotEntity: { type: "Statement", name: "ORDER BY" }, note: "Public route is nested beneath SELECT rather than derived from the statement name." },
  { route: "/reference/statements/create/dictionary/sources/executable-file", disposition: "snapshot", snapshotEntity: { type: "Dictionary Source", name: "executable" }, note: "The historical URL is more descriptive than the factory record name." },
  { route: "/reference/statements/create/dictionary/sources/local-file", disposition: "snapshot", snapshotEntity: { type: "Dictionary Source", name: "file" }, note: "The historical URL is more descriptive than the factory record name." },
  { route: "/reference/system-tables/delta_metadata_log", disposition: "snapshot", snapshotEntity: { type: "System Table", name: "delta_lake_metadata_log" }, redirectFrom: ["/reference/system-tables/delta_lake_metadata_log"], note: "Retain the older public URL while documenting the current table name." },
  { route: "/reference/system-tables/delta_lake_metadata_log", disposition: "redirect", snapshotEntity: { type: "System Table", name: "delta_lake_metadata_log" }, redirectTo: "/reference/system-tables/delta_metadata_log", note: "Redirect this alternate legacy URL to /reference/system-tables/delta_metadata_log." },
  { route: "/reference/formats/DWARF", disposition: "feature-gated", feature: "USE_DWARF_PARSER on ELF", note: "Current master registers format documentation only in builds that include the DWARF parser." },
  { route: "/reference/system-tables/instrumentation", disposition: "feature-gated", feature: "USE_XRAY", note: "The table and its system.documentation record exist only in XRay-enabled builds." },
  { route: "/reference/system-tables/information_schema", disposition: "derived", note: "INFORMATION_SCHEMA is a database of views, not a system table catalog record." },
  { route: "/reference/system-tables/models", disposition: "retained-historical", note: "system.models was removed; the page is intentionally historical." },
  { route: "/reference/system-tables/histogram_metric_log", disposition: "retained-template", note: "Current master does not emit a system.documentation record for this page; it needs source metadata before it can become snapshot-owned." },
  { route: "/reference/functions/regular-functions/embedded-dict-functions", disposition: "retained-template", note: "A collection-level explanatory page; it is not one direct snapshot entity." },
  { route: "/reference/functions/regular-functions/uniqtheta-functions", disposition: "retained-template", note: "A collection-level explanatory page; it is not one direct snapshot entity." },
  ...[
    "beta-and-experimental-features",
    "merge-tree-settings/in-memory",
    "merge-tree-settings/kill-delay-period",
    "merge-tree-settings/max-part",
    "merge-tree-settings/write-ahead",
    "server-settings/settings/access-control",
    "server-settings/settings/custom",
    "server-settings/settings/graphite",
    "server-settings/settings/query",
    "server-settings/settings/remote",
    "server-settings/settings/tcp-port",
    "server-settings/settings/user-defined",
    "server-settings/settings/workload",
    "server-settings/settings/zookeeper",
  ].map((relativePath): RouteContractEntry => ({
    route: `/reference/settings/${relativePath}`,
    disposition: "snapshot-omitted",
    note: "This group is absent from this snapshot. Do not render or redirect it: versioned reference routes and navigation reflect only the records present in the snapshot.",
  })),
];
