declare namespace App {
  interface Locals {
    /** Original versioned route retained by the local archive rewrite. */
    archivedReference?: {
      version: string;
      path: string;
    };
  }
}
