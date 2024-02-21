import { registerProductEditorBlockType } from "@woocommerce/product-editor";
import block from "./block.json";
import { Edit } from "./edit";

const { name, ...metadata } = block;

/**
 * Registers the SEO block to the product editor.
 *
 * @link https://github.com/woocommerce/woocommerce/blob/trunk/packages/js/product-editor/src/utils/register-product-editor-block-type.ts
 * @link https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerProductEditorBlockType( {
	name,
	metadata,
	settings: {
		example: {},
		edit: Edit,
	},
} );
