/* External dependencies */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import Description from "./Description";
import { CATEGORY } from "../constants";

export default () => {
	registerBlockType( "yoast/description", {
		title: __( "Description", "wordpress-seo" ),
		description: __( "", "wordpress-seo" ),
		icon: "",
		category: CATEGORY,
		keywords: [],

		attributes: {
			jsonStringValue: {
				type: "string",
			},
		},
		edit: Description,
		save: Description.Content,
	} );
};
