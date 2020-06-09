import isGutenbergDataAvailable from "./isGutenbergDataAvailable";
import { get } from "lodash";

/**
 * Returns the source of the first image found in the content.
 *
 * @param {func} select The select function.
 *
 * @returns {string} The source of the first content image.
 */
const getContentImage = ( select ) => {
	if ( isGutenbergDataAvailable() ) {
		// Get the first image from the Block editor.
		const {
			getBlocks,
		} = select( "core/block-editor" );
		return get( getBlocks().find( block => block.name === "core/image" ), "attributes.url", "" );
	}
	// Get the first image from TinyMCE
};

export default getContentImage;
