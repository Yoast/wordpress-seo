/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import Component from "./Component";

import { registerBlockType } from "@wordpress/blocks";

export default () => {
	registerBlockType( "", {
		title: __( "", "wordpress-seo" ),
		description: __( "", "wordpress-seo" ),
		icon: "",
		category: "",
		keywords: [],
		// Allow only one How-To block per post.
		supports: {
			multiple: false,
		},

		// Block attributes - decides what to save and how to parse it from and to HTML.
		attributes: {},

		edit: Component,
		save: Component.Content,
	} );
};
