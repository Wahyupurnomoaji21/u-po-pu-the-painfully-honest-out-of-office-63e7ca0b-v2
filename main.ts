import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The Painfully Honest Out-of-Office — v2.
// New angle: this auto-reply is the most honest thing the sender has
// written all year. No pretending to keep up with email while away —
// the sender is resting, not reading, and will reply only once back
// and human again.

const ENTRY =
  "I am out of office, and this auto-reply is the most honest thing I have written all year: I am resting, I am not reading email, and I will reply when I am back and human again.";

function fail(message: string): never {
  throw new Error(`entry rejected: ${message}`);
}

function checkEntry(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    fail(`length ${chars} is outside the 1-200 character limit`);
  }
  if (/[\r\n]/.test(text)) {
    fail("entry must be exactly one line");
  }
  if (text !== text.trim()) {
    fail("entry must not start or end with whitespace");
  }
  const terminators = (text.match(/[.!?]/g) ?? []).length;
  if (terminators !== 1) {
    fail(`expected one sentence, found ${terminators} sentence terminators`);
  }
  if (!/[.!?]$/.test(text)) {
    fail("entry must end with sentence punctuation");
  }
}

function outputDir(): string {
  const configured = process.env.MAKEFUN_OUTPUT_DIR;
  if (configured !== undefined && configured.length > 0) {
    return resolve(configured);
  }
  return join(dirname(fileURLToPath(import.meta.url)), "output");
}

checkEntry(ENTRY);

const dir = outputDir();
mkdirSync(dir, { recursive: true });
const target = join(dir, "entry.txt");
writeFileSync(target, ENTRY, "utf8");
console.log(`entry.txt written (${[...ENTRY].length} characters) -> ${target}`);
