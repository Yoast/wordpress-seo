/**
 * Plugin to parse reusable blocks in the content before it is analyzed.
 */
class YoastReusableBlocksPlugin {
	/**
	 * Instantiates the YoastReusableBlocksPlugin.
	 *
	 * @param {Function} registerPlugin        Function to register this plugin.
	 * @param {Function} registerModification  Function to register a modification of this plugin.
	 * @param {Object}   blockEditorDataModule The WordPress block editor data module. E.g. `window.wp.data.select("core/block-editor")`
	 */
	constructor( registerPlugin, registerModification, blockEditorDataModule ) {
		this._registerPlugin = registerPlugin;
		this._registerModification = registerModification;
		this.blockEditorDataModule = blockEditorDataModule;
	}

	/**
	 * Registers the plugin and modification with YoastSEO.js
	 *
	 * @returns {void}
	 */
	register() {
		this._registerPlugin( "YoastReusableBlocksPlugin", { status: "ready" } );
		this._registerModification( "content", this.parseReusableBlocks.bind( this ), "YoastReusableBlocksPlugin", 1 );
	}

	/**
	 * The modification that parses the reusable blocks in the content.
	 *
	 * @param {string} content The content to parse.
	 *
	 * @returns {string} The parsed content
	 */
	parseReusableBlocks( content ) {
		const reusableBlockRegex = /<!-- wp:block {"ref":(\d+)} \/-->/g;

		if ( ! content.match( reusableBlockRegex ) ) {
			return content;
		}

		const { __experimentalReusableBlocks } = this.blockEditorDataModule.getSettings();

		if ( ! __experimentalReusableBlocks ) {
			return content;
		}

		return content.replace( reusableBlockRegex, ( match, blockId ) => {
			const reusableBlockId = parseInt( blockId, 10 );
			const reusableBlock = __experimentalReusableBlocks.find( item => item.id === reusableBlockId );

			if ( reusableBlock ) {
				return reusableBlock.content.raw;
			}
		} );
	}
}

export default YoastReusableBlocksPlugin;
