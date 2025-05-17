/* External dependencies */
import { useBlockProps } from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";
import ServerSideRender from "@wordpress/server-side-render";

/* Internal dependencies */
import block from "./dynamic-blocks/breadcrumbs/block.json";

/**
 * Registers the dynamic blocks.
 *
 * @returns {void}
 */
const registerDynamicBlocks = () => {
	registerBlockType( block, {
		/**
		 * Renders the block in the editor.
		 *
		 * @param {object} props The Props.
		 * @returns {wp.Element} The component.
		 */
		edit: ( props ) => {
			const blockProps = useBlockProps();

			return (
				<div { ...blockProps }>
					<ServerSideRender
						block="yoast-seo/breadcrumbs"
						attributes={ props.attributes }
					/>
				</div>
			);
		},
		/**
		 * Saves nothing.
		 *
		 * @returns {null} Nothing.
		 */
		save: () => {
			return null;
		},
	} );
};

registerDynamicBlocks();
