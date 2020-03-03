/* External dependencies */
import React from "react";
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import Faq from "./components/FAQ";
import legacy from "./legacy";

const { registerBlockType } = window.wp.blocks;

const attributes = {
	questions: {
		type: "array",
	},
	additionalListCssClasses: {
		type: "string",
	},
};

export default () => {
	registerBlockType( "yoast/faq-block", {
		title: __( "FAQ", "wordpress-seo" ),
		description: __( "List your Frequently Asked Questions in an SEO-friendly way. You can only use one FAQ block per post.", "wordpress-seo" ),
		icon: "editor-ul",
		category: "yoast-structured-data-blocks",
		keywords: [
			__( "FAQ", "wordpress-seo" ),
			__( "Frequently Asked Questions", "wordpress-seo" ),
			__( "Schema", "wordpress-seo" ),
		],
		// Allow only one FAQ block per post.
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
				attributes,
				save: legacy.v13_1,
			},
		],
	} );
};
