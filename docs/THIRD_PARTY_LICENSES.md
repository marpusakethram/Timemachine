# Dependency license inventory

This file is generated. Run `node scripts/audit-licenses.mjs` to rebuild it from the
installed packages and the committed lockfile. It covers everything installed locally,
dev tools included. Some optional packages are platform specific, so another machine
might show a slightly different list. Those keep their own upstream licenses.

What's bundled that isn't code: the Inter font, shipped through
`@fontsource-variable/inter` under the SIL Open Font License 1.1. No third-party
photos or videos. Lucide icons are ISC and the shadcn style button pattern is MIT.

Our MIT license only covers our own source and the original diagram. Every
dependency keeps its own license, so keep their notices if you redistribute.
Next.js pulls in optional Sharp/libvips binaries under Apache-2.0 and LGPL terms.
This repo ships our source, not those binaries. npm installs them with their own
notices. If you redistribute the binaries, you have to follow the LGPL rules,
including making the corresponding source available.

Installed packages: 186. Missing license declarations: 0.

| Package | Version | License | Scope |
|---|---|---|---|
| @alloc/quick-lru | 5.3.0 | MIT | development |
| @emnapi/runtime | 1.11.3 | MIT | runtime / transitive |
| @fontsource-variable/inter | 5.3.0 | OFL-1.1 | runtime / transitive |
| @google/genai | 1.52.0 | Apache-2.0 | runtime / transitive |
| @img/colour | 1.1.0 | MIT | runtime / transitive |
| @img/sharp-libvips-linux-x64 | 1.3.4 | LGPL-3.0-or-later | runtime / transitive |
| @img/sharp-libvips-linuxmusl-x64 | 1.3.4 | LGPL-3.0-or-later | runtime / transitive |
| @img/sharp-linux-x64 | 0.35.5 | Apache-2.0 | runtime / transitive |
| @img/sharp-linuxmusl-x64 | 0.35.5 | Apache-2.0 | runtime / transitive |
| @img/sharp-wasm32 | 0.35.5 | Apache-2.0 AND LGPL-3.0-or-later AND MIT | runtime / transitive |
| @jridgewell/gen-mapping | 0.3.13 | MIT | development |
| @jridgewell/remapping | 2.3.5 | MIT | development |
| @jridgewell/resolve-uri | 3.1.2 | MIT | development |
| @jridgewell/sourcemap-codec | 1.6.0 | MIT | development |
| @jridgewell/trace-mapping | 0.3.31 | MIT | development |
| @next/env | 16.4.2 | MIT | runtime / transitive |
| @next/swc-linux-x64-gnu | 16.4.2 | MIT | runtime / transitive |
| @next/swc-linux-x64-musl | 16.4.2 | MIT | runtime / transitive |
| @oxc-project/types | 0.154.0 | MIT | development |
| @playwright/test | 1.64.1 | Apache-2.0 | runtime / transitive |
| @protobufjs/aspromise | 1.1.2 | BSD-3-Clause | runtime / transitive |
| @protobufjs/base64 | 1.1.2 | BSD-3-Clause | runtime / transitive |
| @protobufjs/codegen | 2.0.5 | BSD-3-Clause | runtime / transitive |
| @protobufjs/eventemitter | 1.1.1 | BSD-3-Clause | runtime / transitive |
| @protobufjs/fetch | 1.1.1 | BSD-3-Clause | runtime / transitive |
| @protobufjs/float | 1.0.2 | BSD-3-Clause | runtime / transitive |
| @protobufjs/path | 1.1.2 | BSD-3-Clause | runtime / transitive |
| @protobufjs/pool | 1.1.0 | BSD-3-Clause | runtime / transitive |
| @protobufjs/utf8 | 1.1.2 | BSD-3-Clause | runtime / transitive |
| @radix-ui/react-compose-refs | 1.1.5 | MIT | runtime / transitive |
| @radix-ui/react-slot | 1.5.0 | MIT | runtime / transitive |
| @reduxjs/toolkit | 2.13.0 | MIT | runtime / transitive |
| @rolldown/binding-linux-x64-gnu | 1.2.14 | MIT | development |
| @rolldown/binding-linux-x64-musl | 1.2.14 | MIT | development |
| @rolldown/pluginutils | 1.0.1 | MIT | development |
| @standard-schema/spec | 1.1.0 | MIT | runtime / transitive |
| @standard-schema/utils | 0.3.0 | MIT | runtime / transitive |
| @swc/helpers | 0.5.23 | Apache-2.0 | runtime / transitive |
| @tailwindcss/node | 4.3.3 | MIT | development |
| @tailwindcss/oxide | 4.3.3 | MIT | development |
| @tailwindcss/oxide-linux-x64-gnu | 4.3.3 | MIT | development |
| @tailwindcss/oxide-linux-x64-musl | 4.3.3 | MIT | development |
| @tailwindcss/postcss | 4.3.3 | MIT | development |
| @types/chai | 5.2.3 | MIT | development |
| @types/d3-array | 3.2.2 | MIT | runtime / transitive |
| @types/d3-color | 3.1.3 | MIT | runtime / transitive |
| @types/d3-drag | 3.0.7 | MIT | runtime / transitive |
| @types/d3-ease | 3.0.2 | MIT | runtime / transitive |
| @types/d3-interpolate | 3.0.4 | MIT | runtime / transitive |
| @types/d3-path | 3.1.1 | MIT | runtime / transitive |
| @types/d3-scale | 4.0.9 | MIT | runtime / transitive |
| @types/d3-selection | 3.0.12 | MIT | runtime / transitive |
| @types/d3-shape | 3.2.0 | MIT | runtime / transitive |
| @types/d3-time | 3.0.4 | MIT | runtime / transitive |
| @types/d3-timer | 3.0.2 | MIT | runtime / transitive |
| @types/d3-transition | 3.0.9 | MIT | runtime / transitive |
| @types/d3-zoom | 3.0.9 | MIT | runtime / transitive |
| @types/deep-eql | 4.0.2 | MIT | development |
| @types/estree | 1.0.9 | MIT | development |
| @types/node | 22.20.5 | MIT | runtime / transitive |
| @types/react | 19.3.0 | MIT | runtime / transitive |
| @types/react-dom | 19.3.0 | MIT | runtime / transitive |
| @types/retry | 0.12.0 | MIT | runtime / transitive |
| @types/use-sync-external-store | 0.0.6 | MIT | runtime / transitive |
| @vitest/mocker | 5.0.5 | MIT | development |
| @vitest/spy | 5.0.5 | MIT | development |
| @xyflow/react | 12.12.0 | MIT | runtime / transitive |
| @xyflow/system | 0.0.83 | MIT | runtime / transitive |
| agent-base | 7.1.4 | MIT | runtime / transitive |
| assertion-error | 2.0.1 | MIT | development |
| base64-js | 1.5.1 | MIT | runtime / transitive |
| baseline-browser-mapping | 2.11.30 | Apache-2.0 | runtime / transitive |
| bignumber.js | 9.3.1 | MIT | runtime / transitive |
| buffer-equal-constant-time | 1.0.1 | BSD-3-Clause | runtime / transitive |
| caniuse-lite | 1.0.30001817 | CC-BY-4.0 | runtime / transitive |
| chai | 6.3.0 | MIT | development |
| class-variance-authority | 0.7.1 | Apache-2.0 | runtime / transitive |
| classcat | 5.0.5 | MIT | runtime / transitive |
| client-only | 0.0.1 | MIT | runtime / transitive |
| clsx | 2.1.1 | MIT | runtime / transitive |
| csstype | 3.2.3 | MIT | runtime / transitive |
| d3-array | 3.2.4 | ISC | runtime / transitive |
| d3-color | 3.1.0 | ISC | runtime / transitive |
| d3-dispatch | 3.0.1 | ISC | runtime / transitive |
| d3-drag | 3.0.0 | ISC | runtime / transitive |
| d3-ease | 3.0.1 | BSD-3-Clause | runtime / transitive |
| d3-format | 3.1.2 | ISC | runtime / transitive |
| d3-interpolate | 3.0.1 | ISC | runtime / transitive |
| d3-path | 3.1.0 | ISC | runtime / transitive |
| d3-scale | 4.0.2 | ISC | runtime / transitive |
| d3-selection | 3.0.0 | ISC | runtime / transitive |
| d3-shape | 3.2.0 | ISC | runtime / transitive |
| d3-time | 3.1.0 | ISC | runtime / transitive |
| d3-time-format | 4.1.0 | ISC | runtime / transitive |
| d3-timer | 3.0.1 | ISC | runtime / transitive |
| d3-transition | 3.0.1 | ISC | runtime / transitive |
| d3-zoom | 3.0.0 | ISC | runtime / transitive |
| data-uri-to-buffer | 4.0.1 | MIT | runtime / transitive |
| debug | 4.4.3 | MIT | runtime / transitive |
| decimal.js-light | 2.5.1 | MIT | runtime / transitive |
| detect-libc | 2.1.2 | Apache-2.0 | runtime / transitive |
| ecdsa-sig-formatter | 1.0.11 | Apache-2.0 | runtime / transitive |
| enhanced-resolve | 5.26.0 | MIT | development |
| es-module-lexer | 2.3.2 | MIT | development |
| es-toolkit | 1.52.0 | MIT | runtime / transitive |
| estree-walker | 3.0.3 | MIT | development |
| eventemitter3 | 5.0.4 | MIT | runtime / transitive |
| expect-type | 1.4.0 | Apache-2.0 | development |
| extend | 3.0.2 | MIT | runtime / transitive |
| fdir | 6.5.0 | MIT | development |
| fetch-blob | 3.2.0 | MIT | runtime / transitive |
| formdata-polyfill | 4.0.10 | MIT | runtime / transitive |
| gaxios | 7.3.1 | Apache-2.0 | runtime / transitive |
| gcp-metadata | 8.1.2 | Apache-2.0 | runtime / transitive |
| google-auth-library | 10.9.1 | Apache-2.0 | runtime / transitive |
| google-logging-utils | 1.1.3 | Apache-2.0 | runtime / transitive |
| graceful-fs | 4.2.11 | ISC | development |
| html-to-image | 1.11.13 | MIT | runtime / transitive |
| https-proxy-agent | 7.0.6 | MIT | runtime / transitive |
| immer | 11.1.21 | MIT | runtime / transitive |
| internmap | 2.0.3 | ISC | runtime / transitive |
| jiti | 2.7.0 | MIT | development |
| json-bigint | 1.0.0 | MIT | runtime / transitive |
| jwa | 2.0.1 | MIT | runtime / transitive |
| jws | 4.0.1 | MIT | runtime / transitive |
| lightningcss | 1.32.0 | MPL-2.0 | development |
| lightningcss | 1.33.0 | MPL-2.0 | development |
| lightningcss-linux-x64-gnu | 1.32.0 | MPL-2.0 | development |
| lightningcss-linux-x64-gnu | 1.33.0 | MPL-2.0 | development |
| lightningcss-linux-x64-musl | 1.32.0 | MPL-2.0 | development |
| lightningcss-linux-x64-musl | 1.33.0 | MPL-2.0 | development |
| long | 5.3.2 | Apache-2.0 | runtime / transitive |
| lucide-react | 0.468.0 | ISC | runtime / transitive |
| magic-string | 1.4.3 | MIT | development |
| magic-string | 0.30.21 | MIT | development |
| magic-string | 1.4.3 | MIT | development |
| ms | 2.1.3 | MIT | runtime / transitive |
| nanoid | 3.3.20 | MIT | runtime / transitive |
| next | 16.4.2 | MIT | runtime / transitive |
| node-domexception | 1.0.0 | MIT | runtime / transitive |
| node-fetch | 3.3.2 | MIT | runtime / transitive |
| obug | 3.0.0 | MIT | development |
| p-retry | 4.6.2 | MIT | runtime / transitive |
| picocolors | 1.1.1 | ISC | runtime / transitive |
| picomatch | 4.0.7 | MIT | development |
| playwright | 1.64.1 | Apache-2.0 | runtime / transitive |
| playwright-core | 1.64.1 | Apache-2.0 | runtime / transitive |
| postcss | 8.5.23 | MIT | runtime / transitive |
| postcss | 8.5.31 | MIT | development |
| protobufjs | 7.6.6 | BSD-3-Clause | runtime / transitive |
| react | 19.3.1 | MIT | runtime / transitive |
| react-dom | 19.3.1 | MIT | runtime / transitive |
| react-is | 19.3.1 | MIT | runtime / transitive |
| react-redux | 9.3.0 | MIT | runtime / transitive |
| recharts | 3.10.1 | MIT | runtime / transitive |
| redux | 5.0.1 | MIT | runtime / transitive |
| redux-thunk | 3.1.0 | MIT | runtime / transitive |
| reselect | 5.2.0 | MIT | runtime / transitive |
| retry | 0.13.1 | MIT | runtime / transitive |
| rolldown | 1.2.14 | MIT | development |
| safe-buffer | 5.2.1 | MIT | runtime / transitive |
| scheduler | 0.28.0 | MIT | runtime / transitive |
| semver | 7.8.5 | ISC | runtime / transitive |
| sharp | 0.35.5 | Apache-2.0 | runtime / transitive |
| source-map-js | 1.2.2 | BSD-3-Clause | runtime / transitive |
| std-env | 4.3.0 | MIT | development |
| styled-jsx | 5.1.6 | MIT | runtime / transitive |
| tailwind-merge | 3.7.0 | MIT | runtime / transitive |
| tailwindcss | 4.3.3 | MIT | development |
| tapable | 2.3.3 | MIT | development |
| tiny-invariant | 1.3.3 | MIT | runtime / transitive |
| tinybench | 6.2.2 | MIT | development |
| tinyexec | 1.3.1 | MIT | development |
| tinyglobby | 0.2.17 | MIT | development |
| tslib | 2.8.1 | 0BSD | runtime / transitive |
| typescript | 5.9.3 | Apache-2.0 | development |
| undici-types | 6.21.0 | MIT | runtime / transitive |
| use-sync-external-store | 1.7.0 | MIT | runtime / transitive |
| victory-vendor | 37.3.6 | MIT AND ISC | runtime / transitive |
| vite | 8.3.4 | MIT | development |
| vitest | 5.0.5 | MIT | development |
| web-streams-polyfill | 3.3.3 | MIT | runtime / transitive |
| why-is-node-running | 3.2.1 | MIT | development |
| ws | 8.22.0 | MIT | runtime / transitive |
| zod | 4.6.7 | MIT | runtime / transitive |
| zustand | 4.5.7 | MIT | runtime / transitive |
