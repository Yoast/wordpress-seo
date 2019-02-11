/* External dependencies */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import HowToSection from "./HowToSection";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default () => {
	registerBlockType( "yoast/how-to-section", {
		title: __( "HowToSection", "wordpress-seo" ),
		description: __( "", "wordpress-seo" ),
		icon: "",
		category: "yoast-structured-data-blocks",
		keywords: [],

		supports: {
			multiple: true,
		},

		attributes: {},

		edit: HowToSection,
		save: HowToSection.Content,
	} );
};
