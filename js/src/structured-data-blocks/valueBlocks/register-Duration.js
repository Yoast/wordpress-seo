/* External dependencies */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import Duration from "./Duration";
import { CATEGORY } from "../constants";

export default () => {
	registerBlockType( "yoast/duration", {
		title: __( "Total time", "wordpress-seo" ),
		description: __( "", "wordpress-seo" ),
		icon: "",
		category: CATEGORY,
		keywords: [],

		attributes: {
			days: {
				type: "string",
			},
			hours: {
				type: "string",
			},
			minutes: {
				type: "string",
			},
			legend: {
				type: "string",
			},
		},

		edit: Duration,
		save: Duration.Content,
	} );
};
