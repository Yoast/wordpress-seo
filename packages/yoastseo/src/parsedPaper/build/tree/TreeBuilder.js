import buildTree from "./buildTree";

/**
 * Builds a tree representation of a source text.
 *
 * Currently supported languages:
 *  - HTML (`"html"`)
 *
 * @memberOf module:parsedPaper/builder;
 */
class TreeBuilder {
	/**
	 * Creates a new TreeBuilder.
	 */
	constructor() {
		this._buildFunctions = {
			html: buildTree,
		};
	}

	/**
	 * Parses the given source text to a tree representation.
	 *
	 * Chooses the right parser depending on the given formatting language in which the text has been written (defaults to HTML).
	 *
	 * @param {string} sourceText                The source text that needs to be parsed to a tree representation.
	 * @param {Object} [options]			     Parse options.
	 * @param {string} [options.language="html"] The formatting language in which the source text has been written, e.g. `"html"` for HTML.
	 *
	 * @returns {module:parsedPaper/structure.Node} The tree representation as parsed from the source text.
	 */
	build( sourceText, options ) {
		if ( ! options ) {
			// Default options.
			options = {
				language: "html",
			};
		}
		return this._buildFunctions[ options.language ]( sourceText );
	}

	/**
	 * Registers a build function for the given formatting language.
	 *
	 * Call this method if you want to add support for another formatting language.
	 *
	 * @example
	 *   // Create a new build function.
	 *   const myBuilder = sourceText => new StructuredNode( "root" );
	 *   // Register the build function under "my-language".
	 *   treeBuilder.register( "my-language", myBuilder );
	 *
	 * @param {string}                                                            language      The language to register.
	 * @param {function( sourceText: string ): module:parsedPaper/structure.Node} buildFunction The build function for the given language.
	 *
	 * @returns {void}
	 */
	register( language, buildFunction ) {
		this._buildFunctions[ language ] = buildFunction;
	}
}

export default TreeBuilder;
