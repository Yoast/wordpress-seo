/* External dependencies */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import HowTo from "./HowTo";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default () => {
	registerBlockType( "yoast/how-to", {
		title: __( "How to", "wordpress-seo" ),
		description: __( "", "wordpress-seo" ),
		icon: "",
		category: "yoast-structured-data-blocks",
		keywords: [],

		supports: {
			multiple: true,
		},

		attributes: {},

		edit: HowTo,
		save: HowTo.Content,
	} );
};
