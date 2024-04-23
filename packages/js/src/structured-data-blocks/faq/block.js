/* External dependencies */
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import block from "./block.json";
import Faq from "./components/FAQ";
import legacy from "./legacy";

registerBlockType( block, {
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
		if ( ! attributes.questions || attributes.questions.length === 0 ) {
			attributes.questions = [ { id: Faq.generateId( "faq-question" ), question: [], answer: [] } ];
		}

		return <Faq { ...{ attributes, setAttributes, className } } />;
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
		return <Faq.Content { ...attributes } />;
	},
	/* eslint-enable react/display-name */

	deprecated: [
		{
			attributes: block.attributes,
			save: legacy.v13_1,
		},
	],
} );

