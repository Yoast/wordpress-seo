/* External dependencies */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import Title from "./Title";
import { CATEGORY } from "../constants";

export default () => {
	registerBlockType( "yoast/title", {
		title: __( "Title", "wordpress-seo" ),
		description: __( "", "wordpress-seo" ),
		icon: "",
		category: CATEGORY,
		keywords: [],

		attributes: {
			jsonTitle: {
				type: "string",
			},
		},
		edit: Title,
		save: Title.Content,
	} );
};
