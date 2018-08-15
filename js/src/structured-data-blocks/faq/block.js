import React from "react";

import FAQ from "./components/FAQ";

const { __ } = window.wp.i18n;
const { registerBlockType } = window.wp.blocks;

export default () => {
	registerBlockType( "yoast/faq-block", {
		// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
		title: __( "FAQ", "wordpress-seo" ),
		icon: "editor-ul",
		category: "yoast-structured-data-blocks",
		keywords: [
			__( "FAQ", "wordpress-seo" ),
			__( "Frequently Asked Questions", "wordpress-seo" ),
		],
		// Block attributes - decides what to save and how to parse it from and to HTML.
		attributes: {
			title: {
				type: "array",
				source: "children",
				selector: ".schema-faq-title",
			},
			jsonTitle: {
				type: "string",
			},
			questions: {
				type: "array",
			},
			additionalListCssClasses: {
				type: "string",
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
			if ( ! attributes.questions || attributes.questions.length === 0 ) {
				attributes.questions = [ { id: FAQ.generateId( "faq-question" ), question: [], answer: [] } ];
			}

			return <FAQ { ...{ attributes, setAttributes, className } }/>;
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
			return <FAQ.Content { ...attributes } />;
		},
	} );
};
