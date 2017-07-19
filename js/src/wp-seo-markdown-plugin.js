import marked from "marked";

/**
 * Plugin to parse markdown in the content before it is analyzed.
 */
class YoastMarkdownPlugin {
	constructor( app ) {
		this._app = app;
	}

	/**
	 * Registers the plugin and modification with YoastSEO.js
	 *
	 * @returns {void}
	 */
	register() {
		this._app.registerPlugin( "YoastMarkdownPlugin", { status: "ready" } );
		this._app.registerModification( "content", this.parseMarkdown.bind( this ), "YoastMarkdownPlugin", 1 );
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
