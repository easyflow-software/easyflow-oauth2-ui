/** @type {import("lint-staged").Configuration} */

const config = {
  "**/*.{ts,tsx}": "biome check --fix",
  "**/*.ts?(x)": () => "tsc --noEmit",
};

export default config;
