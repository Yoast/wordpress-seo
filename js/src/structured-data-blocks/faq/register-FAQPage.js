/* External dependencies */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import FAQPage from "./FAQPage";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default () => {
	registerBlockType( "yoast/faq-page", {
		title: __( "FAQ", "wordpress-seo" ),
		description: __( "", "wordpress-seo" ),
		icon: "",
		category: "yoast-structured-data-blocks",
		keywords: [],

		supports: {
			multiple: true,
		},

		attributes: {},

		edit: FAQPage,
		save: FAQPage.Content,
	} );
};
