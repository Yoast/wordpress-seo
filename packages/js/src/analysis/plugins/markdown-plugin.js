import marked from "marked";

/**
 * Plugin to parse markdown in the content before it is analyzed.
 */
class YoastMarkdownPlugin {
	/**
	 * Instantiates the YoastMarkdownPlugin.
	 *
	 * @param {Function} registerPlugin       Function to register this plugin.
	 * @param {Function} registerModification Function to register a modification of this plugin.
	 */
	constructor( registerPlugin, registerModification ) {
		this._registerPlugin = registerPlugin;
		this._registerModification = registerModification;
	}

	/**
	 * Registers the plugin and modification with YoastSEO.js
	 *
	 * @returns {void}
	 */
	register() {
		this._registerPlugin( "YoastMarkdownPlugin", { status: "ready" } );
		this._registerModification( "content", this.parseMarkdown.bind( this ), "YoastMarkdownPlugin", 1 );
	}

	/**
	 * The modification that parses the markdown in the content.
	 *
	 * @param {string} content The content to parse.
	 *
	 * @returns {string} The parsed content
	 */
	parseMarkdown( content ) {
		return marked( content );
	}
}

export default YoastMarkdownPlugin;
