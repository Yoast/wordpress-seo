import { registerBlockType } from "@wordpress/blocks";
import { Edit } from "./edit";
import block from "./block.json";

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( block, {
	example: {},
	edit: Edit,
} );
