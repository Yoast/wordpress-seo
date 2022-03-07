import { __unstableSerializeAndClean, isReusableBlock } from "@wordpress/blocks";
import { select, subscribe } from "@wordpress/data";
import { isFunction } from "lodash";

/**
 * Plugin to parse reusable blocks in the content before it is analyzed.
 */
class YoastReusableBlocksPlugin {
	/**
	 * Instantiates the YoastReusableBlocksPlugin.
	 *
	 * @param {Function} registerPlugin        Function to register this plugin.
	 * @param {Function} registerModification  Function to register a modification of this plugin.
	 * @param {Function} refreshAnalysis       Function to refresh the analysis.
	 */
	constructor( registerPlugin, registerModification, refreshAnalysis ) {
		this._registerPlugin = registerPlugin;
		this._registerModification = registerModification;
		this._refreshAnalysis = refreshAnalysis;

		this._reusableBlocks = {};
		this._selectCore = select( "core" );
		this._selectCoreEditor = select( "core/editor" );

		this.reusableBlockChangeListener = this.reusableBlockChangeListener.bind( this );
		this.parseReusableBlocks = this.parseReusableBlocks.bind( this );
	}

	/**
	 * Registers listeners: the plugin modifications and store subscriber.
	 *
	 * @returns {void}
	 */
	register() {
		this._registerPlugin( "YoastReusableBlocksPlugin", { status: "ready" } );
		this._registerModification( "content", this.parseReusableBlocks, "YoastReusableBlocksPlugin", 1 );
		subscribe( this.reusableBlockChangeListener );
	}

	/**
	 * Checks the store for any reusable block changes, and requests a new analysis when so.
	 */
	reusableBlockChangeListener() {
		const { blocks } = this._selectCoreEditor.getPostEdits();

		if ( ! blocks ) {
			return;
		}

		let hasChanged = false;
		blocks.forEach( block => {
			if ( ! isReusableBlock( block ) ) {
				return;
			}

			const content = this.getBlockContent( block.attributes.ref );
			if ( ! this._reusableBlocks[ block.attributes.ref ] ) {
				this._reusableBlocks[ block.attributes.ref ] = {
					id: block.attributes.ref,
					clientId: block.clientId,
					content,
				};
				hasChanged = true;
			} else if ( this._reusableBlocks[ block.attributes.ref ].content !== content ) {
				this._reusableBlocks[ block.attributes.ref ].content = content;
				hasChanged = true;
			}
		} );

		if ( hasChanged ) {
			this._refreshAnalysis();
		}
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

		return content.replace( reusableBlockRegex, ( match, blockId ) => {
			if ( this._reusableBlocks[ blockId ] && this._reusableBlocks[ blockId ].content ) {
				return this._reusableBlocks[ blockId ].content;
			}
			return content;
		} );
	}

	/**
	 * Retrieves the (reusable) block content.
	 *
	 * Workaround the static ref block of reusable blocks that the `getEditedPostContent` returns.
	 * Based on the editor selector: `getEditedPostContent`.
	 *
	 * @param {number} blockId The block ID.
	 * @returns {string} The block content.
	 */
	getBlockContent( blockId ) {
		const record = this._selectCore.getEditedEntityRecord( "postType", "wp_block", blockId );

		if ( record ) {
			if ( isFunction( record.content ) ) {
				return record.content( record );
			} else if ( record.blocks ) {
				return __unstableSerializeAndClean( record.blocks );
			} else if ( record.content ) {
				return record.content;
			}
		}

		return "";
	}
}

export default YoastReusableBlocksPlugin;
