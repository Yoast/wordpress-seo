/**
 * Rewrites `import … from "lodash"` to `"lodash-es"`.
 * `lodash` is CommonJS, so Node ESM can't load its named exports; the ESM build uses `lodash-es` instead.
 *
 * @returns {Object} The Babel plugin.
 */
const lodashToLodashEs = () => ( {
	visitor: {
		ImportDeclaration( path ) {
			if ( path.node.source.value === "lodash" ) {
				path.node.source.value = "lodash-es";
			}
		},
	},
} );

module.exports = {
	presets: [ "@babel/preset-env" ],
	env: {
		// Used by `build:esm`: keep ES modules and map lodash to lodash-es. `build/` stays CommonJS with lodash.
		esm: {
			presets: [ [ "@babel/preset-env", { modules: false } ] ],
			plugins: [ lodashToLodashEs ],
		},
	},
};
