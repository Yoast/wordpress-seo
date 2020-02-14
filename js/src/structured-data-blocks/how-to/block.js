/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import HowTo from "./components/HowTo";
import legacy from "./legacy";

const { registerBlockType } = window.wp.blocks;

const attributes = {
	hasDuration: {
		type: "boolean",
	},
	days: {
		type: "string",
	},
	hours: {
		type: "string",
	},
	minutes: {
		type: "string",
	},
	description: {
		type: "array",
		source: "children",
		selector: ".schema-how-to-description",
	},
	jsonDescription: {
		type: "string",
	},
	steps: {
		type: "array",
	},
	additionalListCssClasses: {
		type: "string",
	},
	unorderedList: {
		type: "boolean",
	},
	durationText: {
		type: "string",
	},
	defaultDurationText: {
		type: "string",
	},
};

export default () => {
	registerBlockType( "yoast/how-to-block", {
		title: __( "How-to", "wordpress-seo" ),
		description: __( "Create a How-to guide in an SEO-friendly way. You can only use one How-to block per post.", "wordpress-seo" ),
		icon: "editor-ol",
		category: "yoast-structured-data-blocks",
		keywords: [
			__( "How-to", "wordpress-seo" ),
			__( "How to", "wordpress-seo" ),
			__( "Schema", "wordpress-seo" ),
		],
		// Allow only one How-To block per post.
		supports: {
			multiple: false,
		},
		// Block attributes - decides what to save and how to parse it from and to HTML.
		attributes,

		/**
		 * The edit function describes the structure of your block in the context of the editor.
		 * This represents what the editor will render when the block is used.
		 *
		 * The "edit" property must be a valid function.
		 *
		 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
		 * @returns {Component} The editor component.
		 */
		edit: ( { attributes, setAttributes, className } ) => {
			// Because setAttributes is quite slow right after a block has been added we fake having a single step.
			if ( ! attributes.steps || attributes.steps.length === 0 ) {
				attributes.steps = [ { id: HowTo.generateId( "how-to-step" ), name: [], text: [] } ];
			}

			return <HowTo { ...{ attributes, setAttributes, className } } />;
		},

		/* eslint-disable react/display-name */
		/**
		 * The save function defines the way in which the different attributes should be combined
		 * into the final markup, which is then serialized by Gutenberg into post_content.
		 *
		 * The "save" property must be specified and must be a valid function.
		 *
		 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
		 * @returns {Component} The display component.
		 */
		save: function( { attributes } ) {
			return <HowTo.Content { ...attributes } />;
		},
		/* eslint-enable react/display-name */

		deprecated: [
			{
				attributes,
				save: legacy.v11_4,
			},
			{
				attributes,
				save: legacy.v8_2,
			},
		],
	} );
};
