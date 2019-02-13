/* External dependencies */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import Steps from "./Steps";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default () => {
	registerBlockType( "yoast/steps", {
		title: __( "Steps", "wordpress-seo" ),
		description: __( "", "wordpress-seo" ),
		icon: "",
		category: "yoast-structured-data-blocks",
		keywords: [],

		supports: {
			multiple: true,
		},

		attributes: {},

		edit: Steps,
		save: Steps.Content,
	} );
};
