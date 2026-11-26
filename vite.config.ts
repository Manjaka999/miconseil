import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/** Injecte dans dist/sw.js la liste des fichiers produits par le build (précache hors ligne) et une version dérivée de leur contenu. */
function precache(): Plugin {
  let fichiers: string[] = [];
  let hash = "";
  let outDir = "dist";
  return {
    name: "miconseil-precache",
    apply: "build",
    configResolved(c) { outDir = join(c.root, c.build.outDir); },
    generateBundle(_o, bundle) {
      fichiers = Object.keys(bundle).filter((f) => !f.endsWith(".map") && f !== "index.html").map((f) => "/" + f);
      hash = createHash("sha1").update(Object.keys(bundle).sort().join("|")).digest("hex").slice(0, 10);
    },
    closeBundle() {
      const sw = join(outDir, "sw.js");
      if (!existsSync(sw)) return;
      const liste = ["/", "/icon.svg", "/manifest.webmanifest", ...fichiers];
      writeFileSync(sw, readFileSync(sw, "utf8").replace('"__PRECACHE__"', liste.map((f) => JSON.stringify(f)).join(", ")).replace("__VERSION__", hash));
    },
  };
}

export default defineConfig({ plugins: [react(), precache()] });
