/* External dependencies */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import Question from "./Question";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default () => {
	registerBlockType( "yoast/question", {
		title: __( "Question", "wordpress-seo" ),
		description: __( "", "wordpress-seo" ),
		icon: "",
		category: "yoast-structured-data-blocks",
		keywords: [],

		supports: {
			multiple: true,
		},

		attributes: {},

		edit: Question,
		save: Question.Content,
	} );
};
