import HowTo from "./components/HowTo";

const { __ } = window.wp.i18n;
const { registerBlockType } = window.wp.blocks;

export default () => {
	registerBlockType( "yoast/how-to-block", {
		// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
		title: __( "How-to", "wordpress-seo" ),
		icon: "editor-ol",
		category: "yoast-structured-data-blocks",
		keywords: [
			__( "How-to", "wordpress-seo" ),
			__( "How to", "wordpress-seo" ),
		],
		// Block attributes - decides what to save and how to parse it from and to HTML.
		attributes: {
			title: {
				type: "array",
				source: "children",
				selector: ".schema-how-to-title",
			},
			jsonTitle: {
				type: "string",
			},
			hasDuration: {
				type: "boolean",
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
		edit: ( { attributes, setAttributes, className } ) => {
			// Because setAttributes is quite slow right after a block has been added we fake having a single step.
			if ( ! attributes.steps || attributes.steps.length === 0 ) {
				attributes.steps = [ { id: HowTo.generateId( "how-to-step" ), contents: [] } ];
			}

			return <HowTo { ...{ attributes, setAttributes, className } }/>;
		},

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
			return <HowTo.Content { ...attributes }/>;
		},
	} );
};
