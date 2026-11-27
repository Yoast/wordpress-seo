/**
 * Jest resolver that falls back to Node's resolution.
 *
 * Jest 27 ignores package.json `exports`, which is the only way Storybook 8 exposes modules like
 * `storybook/internal/preview-api` (used by `@storybook/react` in tests/stories.test.js).
 * Node's `require.resolve` honours `exports`, so use it when Jest's own resolver fails.
 *
 * @param {string} request The module to resolve.
 * @param {Object} options The Jest resolver options.
 * @returns {string} The resolved path.
 */
module.exports = ( request, options ) => {
	try {
		return options.defaultResolver( request, options );
	} catch ( error ) {
		try {
			return require.resolve( request, { paths: [ options.basedir ] } );
		} catch {
			throw error;
		}
	}
};
