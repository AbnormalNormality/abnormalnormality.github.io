import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { minify } from "terser";
import chokidar from "chokidar";

const args = process.argv.slice(2);
const watch = args.includes("--watch");
const files = args.filter((a) => a.endsWith(".ts"));

async function buildFile(file) {
  try {
    const tsCode = await fs.readFile(file, "utf8");

    const result = ts.transpileModule(tsCode, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.ESNext,
      },
      fileName: path.basename(file),
    });

    const minified = await minify(result.outputText);
    if (!minified.code) return;

    const outFile = file.replace(/\.ts$/, ".js");
    await fs.writeFile(outFile, minified.code);

    console.log(`✓ built ${file}`);
  } catch (err) {
    console.error(`✗ failed ${file}`, err.message);
  }
}

async function buildAll() {
  for (const file of files) {
    await buildFile(file);
  }
}

if (watch) {
  console.log("Watching for file changes");
  chokidar.watch(files).on("change", buildFile).on("add", buildFile);
} else {
  await buildAll();
}
