# Dependency license inventory

This file is generated. Run `node scripts/audit-licenses.mjs` to rebuild it from the
installed packages and the committed lockfile. It covers everything installed locally,
dev tools included. Some optional packages are platform specific, so another machine
might show a slightly different list. Those keep their own upstream licenses.

What's bundled that isn't code: the Mona Sans font, shipped through
`@fontsource-variable/mona-sans` under the SIL Open Font License 1.1. No third-party
photos or videos. The screenshots in `public/screens` and `docs` are of this app. Lucide icons are ISC and the shadcn style button pattern is MIT.

Our MIT license only covers our own source and the original diagram. Every
dependency keeps its own license, so keep their notices if you redistribute.
Next.js pulls in optional Sharp/libvips binaries under Apache-2.0 and LGPL terms.
This repo ships our source, not those binaries. npm installs them with their own
notices. If you redistribute the binaries, you have to follow the LGPL rules,
including making the corresponding source available.

Installed packages: 493. Missing license declarations: 0.

| Package | Version | License | Scope |
|---|---|---|---|
| @alloc/quick-lru | 5.3.0 | MIT | development |
| @babel/code-frame | 7.29.7 | MIT | development |
| @babel/compat-data | 7.29.7 | MIT | development |
| @babel/core | 7.29.7 | MIT | development |
| @babel/generator | 7.29.8 | MIT | development |
| @babel/helper-compilation-targets | 7.29.7 | MIT | development |
| @babel/helper-globals | 7.29.7 | MIT | development |
| @babel/helper-module-imports | 7.29.7 | MIT | development |
| @babel/helper-module-transforms | 7.29.7 | MIT | development |
| @babel/helper-string-parser | 7.29.7 | MIT | development |
| @babel/helper-validator-identifier | 7.29.7 | MIT | development |
| @babel/helper-validator-option | 7.29.7 | MIT | development |
| @babel/helpers | 7.29.10 | MIT | development |
| @babel/parser | 7.29.9 | MIT | development |
| @babel/template | 7.29.7 | MIT | development |
| @babel/traverse | 7.29.10 | MIT | development |
| @babel/types | 7.29.8 | MIT | development |
| @emnapi/runtime | 1.11.3 | MIT | runtime / transitive |
| @eslint-community/eslint-utils | 4.10.1 | MIT | development |
| @eslint-community/eslint-utils | 4.9.1 | MIT | development |
| @eslint-community/regexpp | 4.12.2 | MIT | development |
| @eslint/config-array | 0.21.2 | Apache-2.0 | development |
| @eslint/config-helpers | 0.4.2 | Apache-2.0 | development |
| @eslint/core | 0.17.0 | Apache-2.0 | development |
| @eslint/eslintrc | 3.3.7 | MIT | development |
| @eslint/js | 9.39.5 | MIT | development |
| @eslint/object-schema | 2.1.7 | Apache-2.0 | development |
| @eslint/plugin-kit | 0.4.1 | Apache-2.0 | development |
| @fontsource-variable/mona-sans | 5.3.0 | OFL-1.1 | runtime / transitive |
| @google/genai | 1.52.0 | Apache-2.0 | runtime / transitive |
| @humanfs/core | 0.19.2 | Apache-2.0 | development |
| @humanfs/node | 0.16.8 | Apache-2.0 | development |
| @humanfs/types | 0.15.0 | Apache-2.0 | development |
| @humanwhocodes/module-importer | 1.0.1 | Apache-2.0 | development |
| @humanwhocodes/retry | 0.4.3 | Apache-2.0 | development |
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
| @next/eslint-plugin-next | 16.4.2 | MIT | development |
| @next/swc-linux-x64-gnu | 16.4.2 | MIT | runtime / transitive |
| @next/swc-linux-x64-musl | 16.4.2 | MIT | runtime / transitive |
| @nodelib/fs.scandir | 2.1.5 | MIT | development |
| @nodelib/fs.stat | 2.0.5 | MIT | development |
| @nodelib/fs.walk | 1.2.8 | MIT | development |
| @nolyfill/is-core-module | 1.0.39 | MIT | development |
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
| @rtsao/scc | 1.1.0 | MIT | development |
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
| @types/json-schema | 7.0.15 | MIT | development |
| @types/json5 | 0.0.29 | MIT | development |
| @types/node | 22.20.5 | MIT | runtime / transitive |
| @types/react | 19.3.0 | MIT | runtime / transitive |
| @types/react-dom | 19.3.0 | MIT | runtime / transitive |
| @types/retry | 0.12.0 | MIT | runtime / transitive |
| @types/use-sync-external-store | 0.0.6 | MIT | runtime / transitive |
| @typescript-eslint/eslint-plugin | 8.72.0 | MIT | development |
| @typescript-eslint/parser | 8.72.0 | MIT | development |
| @typescript-eslint/project-service | 8.72.0 | MIT | development |
| @typescript-eslint/scope-manager | 8.72.0 | MIT | development |
| @typescript-eslint/tsconfig-utils | 8.72.0 | MIT | development |
| @typescript-eslint/type-utils | 8.72.0 | MIT | development |
| @typescript-eslint/types | 8.72.0 | MIT | development |
| @typescript-eslint/typescript-estree | 8.72.0 | MIT | development |
| @typescript-eslint/utils | 8.72.0 | MIT | development |
| @typescript-eslint/visitor-keys | 8.72.0 | MIT | development |
| @unrs/resolver-binding-linux-x64-gnu | 1.12.2 | MIT | development |
| @vitest/mocker | 5.0.5 | MIT | development |
| @vitest/spy | 5.0.5 | MIT | development |
| @xyflow/react | 12.12.0 | MIT | runtime / transitive |
| @xyflow/system | 0.0.83 | MIT | runtime / transitive |
| acorn | 8.19.0 | MIT | development |
| acorn-jsx | 5.3.2 | MIT | development |
| agent-base | 7.1.4 | MIT | runtime / transitive |
| ajv | 6.15.0 | MIT | development |
| ansi-styles | 4.3.0 | MIT | development |
| argparse | 2.0.1 | Python-2.0 | development |
| aria-query | 5.3.2 | Apache-2.0 | development |
| array-buffer-byte-length | 1.0.2 | MIT | development |
| array-includes | 3.2.0 | MIT | development |
| array.prototype.findlast | 1.2.5 | MIT | development |
| array.prototype.findlastindex | 1.2.6 | MIT | development |
| array.prototype.flat | 1.3.3 | MIT | development |
| array.prototype.flatmap | 1.3.3 | MIT | development |
| array.prototype.tosorted | 1.1.4 | MIT | development |
| arraybuffer.prototype.slice | 1.0.4 | MIT | development |
| assertion-error | 2.0.1 | MIT | development |
| ast-types-flow | 0.0.8 | MIT | development |
| async-function | 1.0.0 | MIT | development |
| available-typed-arrays | 1.0.7 | MIT | development |
| axe-core | 4.14.0 | MPL-2.0 | development |
| axobject-query | 4.1.0 | Apache-2.0 | development |
| balanced-match | 4.0.4 | MIT | development |
| balanced-match | 1.0.2 | MIT | development |
| base64-js | 1.5.1 | MIT | runtime / transitive |
| baseline-browser-mapping | 2.11.30 | Apache-2.0 | runtime / transitive |
| bignumber.js | 9.3.1 | MIT | runtime / transitive |
| brace-expansion | 5.0.12 | MIT | development |
| brace-expansion | 1.1.21 | MIT | development |
| braces | 3.0.3 | MIT | development |
| browserslist | 4.29.4 | MIT | development |
| buffer-equal-constant-time | 1.0.1 | BSD-3-Clause | runtime / transitive |
| call-bind | 1.0.9 | MIT | development |
| call-bind-apply-helpers | 1.0.2 | MIT | development |
| call-bound | 1.0.4 | MIT | development |
| callsites | 3.1.0 | MIT | development |
| caniuse-lite | 1.0.30001817 | CC-BY-4.0 | runtime / transitive |
| chai | 6.3.0 | MIT | development |
| chalk | 4.1.2 | MIT | development |
| class-variance-authority | 0.7.1 | Apache-2.0 | runtime / transitive |
| classcat | 5.0.5 | MIT | runtime / transitive |
| client-only | 0.0.1 | MIT | runtime / transitive |
| clsx | 2.1.1 | MIT | runtime / transitive |
| color-convert | 2.0.1 | MIT | development |
| color-name | 1.1.4 | MIT | development |
| concat-map | 0.0.1 | MIT | development |
| convert-source-map | 2.0.0 | MIT | development |
| cross-spawn | 7.0.6 | MIT | development |
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
| damerau-levenshtein | 1.0.8 | BSD-2-Clause | development |
| data-uri-to-buffer | 4.0.1 | MIT | runtime / transitive |
| data-view-buffer | 1.0.2 | MIT | development |
| data-view-byte-length | 1.0.2 | MIT | development |
| data-view-byte-offset | 1.0.1 | MIT | development |
| debug | 4.4.3 | MIT | runtime / transitive |
| debug | 3.2.7 | MIT | development |
| debug | 3.2.7 | MIT | development |
| debug | 3.2.7 | MIT | development |
| decimal.js-light | 2.5.1 | MIT | runtime / transitive |
| deep-is | 0.1.4 | MIT | development |
| define-data-property | 1.1.4 | MIT | development |
| define-properties | 1.2.1 | MIT | development |
| detect-libc | 2.1.2 | Apache-2.0 | runtime / transitive |
| doctrine | 2.1.0 | Apache-2.0 | development |
| dunder-proto | 1.0.1 | MIT | development |
| ecdsa-sig-formatter | 1.0.11 | Apache-2.0 | runtime / transitive |
| electron-to-chromium | 1.5.461 | ISC | development |
| emoji-regex | 9.2.2 | MIT | development |
| enhanced-resolve | 5.26.0 | MIT | development |
| es-abstract | 1.24.2 | MIT | development |
| es-abstract-get | 1.0.0 | MIT | development |
| es-define-property | 1.0.1 | MIT | development |
| es-errors | 1.3.0 | MIT | development |
| es-iterator-helpers | 1.4.0 | MIT | development |
| es-module-lexer | 2.3.2 | MIT | development |
| es-object-atoms | 1.1.2 | MIT | development |
| es-set-tostringtag | 2.1.0 | MIT | development |
| es-shim-unscopables | 1.1.0 | MIT | development |
| es-to-primitive | 1.3.4 | MIT | development |
| es-toolkit | 1.52.0 | MIT | runtime / transitive |
| escalade | 3.2.0 | MIT | development |
| escape-string-regexp | 4.0.0 | MIT | development |
| eslint | 9.39.5 | MIT | development |
| eslint-config-next | 16.4.2 | MIT | development |
| eslint-import-resolver-node | 0.3.10 | MIT | development |
| eslint-import-resolver-typescript | 3.10.1 | ISC | development |
| eslint-module-utils | 2.14.0 | MIT | development |
| eslint-plugin-import | 2.32.0 | MIT | development |
| eslint-plugin-jsx-a11y | 6.10.2 | MIT | development |
| eslint-plugin-react | 7.37.5 | MIT | development |
| eslint-plugin-react-hooks | 7.1.1 | MIT | development |
| eslint-scope | 8.4.0 | BSD-2-Clause | development |
| eslint-visitor-keys | 3.4.3 | Apache-2.0 | development |
| eslint-visitor-keys | 3.4.3 | Apache-2.0 | development |
| eslint-visitor-keys | 5.0.1 | Apache-2.0 | development |
| eslint-visitor-keys | 4.2.1 | Apache-2.0 | development |
| espree | 10.4.0 | BSD-2-Clause | development |
| esquery | 1.7.0 | BSD-3-Clause | development |
| esrecurse | 4.3.0 | BSD-2-Clause | development |
| estraverse | 5.3.0 | BSD-2-Clause | development |
| estree-walker | 3.0.3 | MIT | development |
| esutils | 2.0.3 | BSD-2-Clause | development |
| eventemitter3 | 5.0.4 | MIT | runtime / transitive |
| expect-type | 1.4.0 | Apache-2.0 | development |
| extend | 3.0.2 | MIT | runtime / transitive |
| fast-deep-equal | 3.1.3 | MIT | development |
| fast-glob | 3.3.1 | MIT | development |
| fast-json-stable-stringify | 2.1.0 | MIT | development |
| fast-levenshtein | 2.0.6 | MIT | development |
| fastq | 1.20.3 | ISC | development |
| fdir | 6.5.0 | MIT | development |
| fetch-blob | 3.2.0 | MIT | runtime / transitive |
| file-entry-cache | 8.0.0 | MIT | development |
| fill-range | 7.1.1 | MIT | development |
| find-up | 5.0.0 | MIT | development |
| flat-cache | 4.0.1 | MIT | development |
| flatted | 3.4.4 | ISC | development |
| for-each | 0.3.5 | MIT | development |
| formdata-polyfill | 4.0.10 | MIT | runtime / transitive |
| function-bind | 1.1.2 | MIT | development |
| function.prototype.name | 1.2.0 | MIT | development |
| functions-have-names | 1.2.3 | MIT | development |
| gaxios | 7.3.1 | Apache-2.0 | runtime / transitive |
| gcp-metadata | 8.1.2 | Apache-2.0 | runtime / transitive |
| generator-function | 2.0.1 | MIT | development |
| gensync | 1.0.0-beta.2 | MIT | development |
| get-intrinsic | 1.3.0 | MIT | development |
| get-proto | 1.0.1 | MIT | development |
| get-symbol-description | 1.1.0 | MIT | development |
| get-tsconfig | 4.14.3 | MIT | development |
| glob-parent | 5.1.2 | ISC | development |
| glob-parent | 6.0.2 | ISC | development |
| globals | 16.4.0 | MIT | development |
| globals | 14.0.0 | MIT | development |
| globalthis | 1.0.4 | MIT | development |
| google-auth-library | 10.9.1 | Apache-2.0 | runtime / transitive |
| google-logging-utils | 1.1.3 | Apache-2.0 | runtime / transitive |
| gopd | 1.2.0 | MIT | development |
| graceful-fs | 4.2.11 | ISC | development |
| has-bigints | 1.1.0 | MIT | development |
| has-flag | 4.0.0 | MIT | development |
| has-property-descriptors | 1.0.2 | MIT | development |
| has-proto | 1.2.0 | MIT | development |
| has-symbols | 1.1.0 | MIT | development |
| has-tostringtag | 1.0.2 | MIT | development |
| hasown | 2.0.4 | MIT | development |
| hermes-estree | 0.25.1 | MIT | development |
| hermes-parser | 0.25.1 | MIT | development |
| html-to-image | 1.11.13 | MIT | runtime / transitive |
| https-proxy-agent | 7.0.6 | MIT | runtime / transitive |
| ignore | 7.0.13 | MIT | development |
| ignore | 5.3.2 | MIT | development |
| immer | 11.1.21 | MIT | runtime / transitive |
| import-fresh | 3.3.1 | MIT | development |
| imurmurhash | 0.1.4 | MIT | development |
| internal-slot | 1.1.0 | MIT | development |
| internmap | 2.0.3 | ISC | runtime / transitive |
| is-array-buffer | 3.0.5 | MIT | development |
| is-async-function | 2.1.1 | MIT | development |
| is-bigint | 1.1.0 | MIT | development |
| is-boolean-object | 1.2.2 | MIT | development |
| is-bun-module | 2.0.0 | MIT | development |
| is-callable | 1.2.7 | MIT | development |
| is-core-module | 2.17.0 | MIT | development |
| is-data-view | 1.0.2 | MIT | development |
| is-date-object | 1.1.0 | MIT | development |
| is-document.all | 1.0.0 | MIT | development |
| is-extglob | 2.1.1 | MIT | development |
| is-finalizationregistry | 1.1.1 | MIT | development |
| is-generator-function | 1.1.2 | MIT | development |
| is-glob | 4.0.3 | MIT | development |
| is-map | 2.0.3 | MIT | development |
| is-negative-zero | 2.0.3 | MIT | development |
| is-number | 7.0.0 | MIT | development |
| is-number-object | 1.1.1 | MIT | development |
| is-regex | 1.2.1 | MIT | development |
| is-set | 2.0.3 | MIT | development |
| is-shared-array-buffer | 1.0.4 | MIT | development |
| is-string | 1.1.1 | MIT | development |
| is-symbol | 1.1.1 | MIT | development |
| is-typed-array | 1.1.15 | MIT | development |
| is-weakmap | 2.0.2 | MIT | development |
| is-weakref | 1.1.1 | MIT | development |
| is-weakset | 2.0.4 | MIT | development |
| isarray | 2.0.5 | MIT | development |
| isexe | 2.0.0 | ISC | development |
| iterator.prototype | 1.1.5 | MIT | development |
| jiti | 2.7.0 | MIT | development |
| js-tokens | 4.0.0 | MIT | development |
| js-yaml | 4.3.2 | MIT | development |
| jsesc | 3.1.0 | MIT | development |
| json-bigint | 1.0.0 | MIT | runtime / transitive |
| json-buffer | 3.0.1 | MIT | development |
| json-schema-traverse | 0.4.1 | MIT | development |
| json-stable-stringify-without-jsonify | 1.0.1 | MIT | development |
| json5 | 2.2.3 | MIT | development |
| json5 | 1.0.2 | MIT | development |
| jsx-ast-utils | 3.3.5 | MIT | development |
| jwa | 2.0.1 | MIT | runtime / transitive |
| jws | 4.0.1 | MIT | runtime / transitive |
| keyv | 4.5.4 | MIT | development |
| language-subtag-registry | 0.3.23 | CC0-1.0 | development |
| language-tags | 1.0.9 | MIT | development |
| levn | 0.4.1 | MIT | development |
| lightningcss | 1.32.0 | MPL-2.0 | development |
| lightningcss | 1.33.0 | MPL-2.0 | development |
| lightningcss-linux-x64-gnu | 1.32.0 | MPL-2.0 | development |
| lightningcss-linux-x64-gnu | 1.33.0 | MPL-2.0 | development |
| lightningcss-linux-x64-musl | 1.32.0 | MPL-2.0 | development |
| lightningcss-linux-x64-musl | 1.33.0 | MPL-2.0 | development |
| locate-path | 6.0.0 | MIT | development |
| lodash.merge | 4.6.2 | MIT | development |
| long | 5.3.2 | Apache-2.0 | runtime / transitive |
| loose-envify | 1.4.0 | MIT | development |
| lru-cache | 5.1.1 | ISC | development |
| lucide-react | 0.468.0 | ISC | runtime / transitive |
| magic-string | 1.4.3 | MIT | development |
| magic-string | 0.30.21 | MIT | development |
| magic-string | 1.4.3 | MIT | development |
| math-intrinsics | 1.1.0 | MIT | development |
| merge2 | 1.4.1 | MIT | development |
| micromatch | 4.0.8 | MIT | development |
| minimatch | 10.2.6 | BlueOak-1.0.0 | development |
| minimatch | 3.1.5 | ISC | development |
| minimist | 1.2.8 | MIT | development |
| ms | 2.1.3 | MIT | runtime / transitive |
| nanoid | 3.3.20 | MIT | runtime / transitive |
| napi-postinstall | 0.3.5 | MIT | development |
| natural-compare | 1.4.0 | MIT | development |
| next | 16.4.2 | MIT | runtime / transitive |
| node-domexception | 1.0.0 | MIT | runtime / transitive |
| node-exports-info | 1.6.2 | MIT | development |
| node-fetch | 3.3.2 | MIT | runtime / transitive |
| node-releases | 2.0.59 | MIT | development |
| object-assign | 4.1.1 | MIT | development |
| object-inspect | 1.13.4 | MIT | development |
| object-keys | 1.1.1 | MIT | development |
| object.assign | 4.1.7 | MIT | development |
| object.entries | 1.1.9 | MIT | development |
| object.fromentries | 2.0.8 | MIT | development |
| object.groupby | 1.0.3 | MIT | development |
| object.values | 1.2.1 | MIT | development |
| obug | 3.0.0 | MIT | development |
| optionator | 0.9.4 | MIT | development |
| own-keys | 1.0.2 | MIT | development |
| p-limit | 3.1.0 | MIT | development |
| p-locate | 5.0.0 | MIT | development |
| p-retry | 4.6.2 | MIT | runtime / transitive |
| parent-module | 1.0.1 | MIT | development |
| path-exists | 4.0.0 | MIT | development |
| path-key | 3.1.1 | MIT | development |
| path-parse | 1.0.7 | MIT | development |
| picocolors | 1.1.1 | ISC | runtime / transitive |
| picomatch | 2.3.2 | MIT | development |
| picomatch | 4.0.7 | MIT | development |
| playwright | 1.64.1 | Apache-2.0 | runtime / transitive |
| playwright-core | 1.64.1 | Apache-2.0 | runtime / transitive |
| possible-typed-array-names | 1.1.0 | MIT | development |
| postcss | 8.5.23 | MIT | runtime / transitive |
| postcss | 8.5.31 | MIT | development |
| prelude-ls | 1.2.1 | MIT | development |
| prop-types | 15.8.1 | MIT | development |
| protobufjs | 7.6.6 | BSD-3-Clause | runtime / transitive |
| punycode | 2.3.1 | MIT | development |
| queue-microtask | 1.2.3 | MIT | development |
| react | 19.3.1 | MIT | runtime / transitive |
| react-dom | 19.3.1 | MIT | runtime / transitive |
| react-is | 16.13.1 | MIT | development |
| react-is | 19.3.1 | MIT | runtime / transitive |
| react-redux | 9.3.0 | MIT | runtime / transitive |
| recharts | 3.10.1 | MIT | runtime / transitive |
| redux | 5.0.1 | MIT | runtime / transitive |
| redux-thunk | 3.1.0 | MIT | runtime / transitive |
| reflect.getprototypeof | 1.0.10 | MIT | development |
| regexp.prototype.flags | 1.5.4 | MIT | development |
| reselect | 5.2.0 | MIT | runtime / transitive |
| resolve | 2.0.0-next.7 | MIT | development |
| resolve-from | 4.0.0 | MIT | development |
| resolve-pkg-maps | 1.0.0 | MIT | development |
| retry | 0.13.1 | MIT | runtime / transitive |
| reusify | 1.1.0 | MIT | development |
| rolldown | 1.2.14 | MIT | development |
| run-parallel | 1.2.0 | MIT | development |
| safe-array-concat | 1.1.4 | MIT | development |
| safe-buffer | 5.2.1 | MIT | runtime / transitive |
| safe-push-apply | 1.0.0 | MIT | development |
| safe-regex-test | 1.1.0 | MIT | development |
| scheduler | 0.28.0 | MIT | runtime / transitive |
| semver | 6.3.1 | ISC | development |
| semver | 6.3.1 | ISC | development |
| semver | 6.3.1 | ISC | development |
| semver | 6.3.1 | ISC | development |
| semver | 6.3.1 | ISC | development |
| semver | 7.8.5 | ISC | runtime / transitive |
| set-function-length | 1.2.2 | MIT | development |
| set-function-name | 2.0.2 | MIT | development |
| set-proto | 1.0.0 | MIT | development |
| sharp | 0.35.5 | Apache-2.0 | runtime / transitive |
| shebang-command | 2.0.0 | MIT | development |
| shebang-regex | 3.0.0 | MIT | development |
| side-channel | 1.1.1 | MIT | development |
| side-channel-list | 1.0.1 | MIT | development |
| side-channel-map | 1.0.1 | MIT | development |
| side-channel-weakmap | 1.0.2 | MIT | development |
| source-map-js | 1.2.2 | BSD-3-Clause | runtime / transitive |
| stable-hash | 0.0.5 | MIT | development |
| std-env | 4.3.0 | MIT | development |
| stop-iteration-iterator | 1.1.0 | MIT | development |
| string.prototype.includes | 2.0.1 | MIT | development |
| string.prototype.matchall | 4.1.0 | MIT | development |
| string.prototype.repeat | 1.0.0 | MIT | development |
| string.prototype.trim | 1.2.11 | MIT | development |
| string.prototype.trimend | 1.0.10 | MIT | development |
| string.prototype.trimstart | 1.0.8 | MIT | development |
| strip-bom | 3.0.0 | MIT | development |
| strip-json-comments | 3.1.1 | MIT | development |
| styled-jsx | 5.1.6 | MIT | runtime / transitive |
| supports-color | 7.2.0 | MIT | development |
| supports-preserve-symlinks-flag | 1.0.0 | MIT | development |
| tailwind-merge | 3.7.0 | MIT | runtime / transitive |
| tailwindcss | 4.3.3 | MIT | development |
| tapable | 2.3.3 | MIT | development |
| tiny-invariant | 1.3.3 | MIT | runtime / transitive |
| tinybench | 6.2.2 | MIT | development |
| tinyexec | 1.3.1 | MIT | development |
| tinyglobby | 0.2.17 | MIT | development |
| to-regex-range | 5.0.1 | MIT | development |
| ts-api-utils | 2.5.0 | MIT | development |
| tsconfig-paths | 3.15.0 | MIT | development |
| tslib | 2.8.1 | 0BSD | runtime / transitive |
| type-check | 0.4.0 | MIT | development |
| typed-array-buffer | 1.0.3 | MIT | development |
| typed-array-byte-length | 1.0.3 | MIT | development |
| typed-array-byte-offset | 1.0.5 | MIT | development |
| typed-array-length | 1.0.8 | MIT | development |
| typescript | 5.9.3 | Apache-2.0 | development |
| typescript-eslint | 8.72.0 | MIT | development |
| unbox-primitive | 1.1.0 | MIT | development |
| undici-types | 6.21.0 | MIT | runtime / transitive |
| unrs-resolver | 1.12.2 | MIT | development |
| update-browserslist-db | 1.3.4 | MIT | development |
| uri-js | 4.4.1 | BSD-2-Clause | development |
| use-sync-external-store | 1.7.0 | MIT | runtime / transitive |
| victory-vendor | 37.3.6 | MIT AND ISC | runtime / transitive |
| vite | 8.3.4 | MIT | development |
| vitest | 5.0.5 | MIT | development |
| web-streams-polyfill | 3.3.3 | MIT | runtime / transitive |
| which | 2.0.2 | ISC | development |
| which-boxed-primitive | 1.1.1 | MIT | development |
| which-builtin-type | 1.2.1 | MIT | development |
| which-collection | 1.0.2 | MIT | development |
| which-typed-array | 1.1.24 | MIT | development |
| why-is-node-running | 3.2.1 | MIT | development |
| word-wrap | 1.2.5 | MIT | development |
| ws | 8.22.0 | MIT | runtime / transitive |
| yallist | 3.1.1 | ISC | development |
| yocto-queue | 0.1.0 | MIT | development |
| zod | 4.6.7 | MIT | runtime / transitive |
| zod-validation-error | 4.0.2 | MIT | development |
| zustand | 4.5.7 | MIT | runtime / transitive |
