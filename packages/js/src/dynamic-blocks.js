/* External dependencies */
import { useBlockProps } from "@wordpress/block-editor";
import { registerBlockType } from "@wordpress/blocks";
import ServerSideRender from "@wordpress/server-side-render";
import { UserGroupIcon, CollectionIcon } from "@heroicons/react/outline";

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
		save: () => null,
	} );

	// Temporary placeholders for Siblings and Sub-pages blocks so they can be inserted from the Yoast menu.
	// These will be replaced with proper implementations later.
	registerBlockType( "yoast-seo/siblings", {
		title: "Yoast Siblings",
		category: "yoast-internal-linking-blocks",
		icon: UserGroupIcon,
		supports: { multiple: true },
		edit: () => {
			const blockProps = useBlockProps();
			return (
				<div { ...blockProps }>
					<p>Yoast Siblings block</p>
				</div>
			);
		},
		save: () => null,
	} );

	registerBlockType( "yoast-seo/sub-pages", {
		title: "Yoast Sub-pages",
		category: "yoast-internal-linking-blocks",
		icon: CollectionIcon,
		supports: { multiple: true },
		edit: () => {
			const blockProps = useBlockProps();
			return (
				<div { ...blockProps }>
					<p>Yoast Sub-pages block</p>
				</div>
			);
		},
		save: () => null,
	} );
};

registerDynamicBlocks();
