// import { registerBlockType } from "@wordpress/blocks";
import { registerProductEditorBlockType } from "@woocommerce/product-editor";
import block from "./block.json";
import { Edit } from "./edit";

const { name, ...metadata } = block;

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerProductEditorBlockType( {
	name,
	metadata,
	settings: {
		example: {},
		edit: Edit,
	},
} );
