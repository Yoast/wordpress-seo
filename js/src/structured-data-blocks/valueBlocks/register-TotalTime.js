/* External dependencies */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/* Internal dependencies */
import TotalTime from "./TotalTime";
import { CATEGORY } from "../constants";

// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!

export default () => {
	registerBlockType( "yoast/total-time", {
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

		edit: TotalTime,
		save: TotalTime.Content,
	} );
};
