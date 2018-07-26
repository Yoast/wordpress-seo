const { __ } = window.wp.i18n;
const { registerBlockType } = window.wp.blocks;

import HowTo from "./components/HowTo";

registerBlockType( "structured-data-block/how-to-block", {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( "How-to" ),
	icon: "editor-ol",
	category: "common",
	keywords: [
		__( "How-to" ),
		__( "How to" ),
	],
	// Block attributes - decides what to save and how to parse it from and to HTML.
	attributes: {
		title: {
			type: "array",
			source: "children",
			selector: ".schema-how-to-title",
		},
		hours: {
			type: "number",
		},
		minutes: {
			type: "number",
		},
		description: {
			type: "array",
			source: "children",
			selector: ".schema-how-to-description",
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
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 * @returns {Component} The editor component.
	 */
	edit: HowTo,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 * @returns {Component} The display component.
	 */
	save: function( { attributes, className } ) {
		return HowTo.getContent( attributes, className );
	},
} );
