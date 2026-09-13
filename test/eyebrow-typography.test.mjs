import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const typography = await readFile(
  new URL("../public/team-brand.css", import.meta.url),
  "utf8",
);

test("upper labels and entry screen use the clean interface typeface", () => {
  assert.doesNotMatch(typography, /Cormorant Garamond/);
  assert.match(typography, /\.eyebrow,\s*\.instagram-heading \.eyebrow/);
  assert.match(typography, /font-family: Arial, "Helvetica Neue", sans-serif/);
  assert.match(typography, /\.entry-content h2,/);
  assert.match(typography, /font-style: normal/);
});
