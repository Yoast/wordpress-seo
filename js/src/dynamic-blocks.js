import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import ServerSideRender from "@wordpress/server-side-render";

/**
 * Registers the dynamic blocks.
 *
 * @returns {void}
 */
const registerDynamicBlocks = () => {
	/* eslint-disable react/display-name */
	/* eslint-disable react/prop-types */
	registerBlockType( "yoast-seo/breadcrumbs", {
		title: __( "Yoast Breadcrumbs", "wordpress-seo" ),
		icon: "admin-links",
		category: "yoast-internal-linking-blocks",
		description: __( "Adds the Yoast SEO breadcrumbs to your template or content.", "wordpress-seo" ),
		keywords: [
			__( "seo", "wordpress-seo" ),
			__( "breadcrumbs", "wordpress-seo" ),
			__( "internal linking", "wordpress-seo" ),
			__( "site structure", "wordpress-seo" ),
		],
		example: {
			attributes: {},
		},
		/**
		 * Renders the block in the editor.
		 *
		 * @param {object} props The Props.
		 * @returns {wp.Element} The component.
		 */
		edit: function( props ) {
			return (
				<ServerSideRender
					block="yoast-seo/breadcrumbs"
					attributes={ props.attributes }
				/>
			);
		},
		/**
		 * Saves nothing.
		 *
		 * @returns {null} Nothing.
		 */
		save: function() {
			return null;
		},
	} );

	/* eslint-enable react/display-name */
	/* eslint-enable react/prop-type */
};

registerDynamicBlocks();
