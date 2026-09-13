import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const typography = await readFile(
  new URL("../public/team-brand.css", import.meta.url),
  "utf8",
);

test("upper labels and entry screen use the original display typeface", () => {
  assert.match(typography, /Cormorant Garamond/);
  assert.match(typography, /\.eyebrow,\s*\.instagram-heading \.eyebrow/);
  assert.match(typography, /font-weight: 500/);
  assert.match(typography, /\.entry-content h2 \{/);
});
