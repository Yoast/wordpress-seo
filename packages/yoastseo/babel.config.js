/**
 * Maps a `lodash` import path to its `lodash-es` version.
 * `lodash-es` has no `exports` map, so Node ESM needs the `.js` extension on subpaths. `lodash/fp` has no
 * `lodash-es` version, so it stays unchanged.
 *
 * @param {string} source The import path.
 *
 * @returns {string} The `lodash-es` path, or the unchanged path.
 */
const toLodashEs = ( source ) => {
	if ( source === "lodash" ) {
		return "lodash-es";
	}
	if ( source.startsWith( "lodash/" ) && ! source.startsWith( "lodash/fp" ) ) {
		const subpath = source.slice( "lodash/".length );
		return `lodash-es/${ subpath }${ subpath.endsWith( ".js" ) ? "" : ".js" }`;
	}
	return source;
};

/**
 * Rewrites `import … from "lodash"`, `export … from "lodash"` and `lodash/<x>` subpaths to `lodash-es`.
 * `lodash` is CommonJS, so Node ESM can't load its named exports; the ESM build uses `lodash-es` instead.
 *
 * @returns {Object} The Babel plugin.
 */
const lodashToLodashEs = () => {
	/**
	 * Rewrites the source of an import or export declaration.
	 *
	 * @param {Object} path The Babel path of the declaration.
	 *
	 * @returns {void}
	 */
	const rewriteSource = ( path ) => {
		if ( path.node.source ) {
			path.node.source.value = toLodashEs( path.node.source.value );
		}
	};

	return {
		visitor: {
			ImportDeclaration: rewriteSource,
			ExportNamedDeclaration: rewriteSource,
			ExportAllDeclaration: rewriteSource,
		},
	};
};

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
