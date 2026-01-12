import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";
import path from "path";

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  // Vite build will use root: "client" and build.outDir: "dist/public" from vite.config.ts
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  
  // Basic list of dependencies that are safe to bundle
  const allowlist = [
    "express",
    "express-session",
    "pg",
    "drizzle-orm",
    "drizzle-zod",
    "zod",
    "date-fns",
    "clsx",
    "tailwind-merge"
  ];

  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: [...externals, "pg-native"],
    logLevel: "info",
  });
  
  console.log("Build complete!");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
