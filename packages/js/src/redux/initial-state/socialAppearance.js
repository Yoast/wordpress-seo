import { get } from "lodash";
import { selectors } from "@yoast/externals/redux";

const {
	getSocialTitleTemplate,
	getSocialDescriptionTemplate,
} = selectors;

export const facebookInitialState = {
	title: get( window, "wpseoScriptData.metabox.metadata.opengraph-title", "" ) || getSocialTitleTemplate(),
	description: get( window, "wpseoScriptData.metabox.metadata.opengraph-description", "" ) || getSocialDescriptionTemplate(),
	warnings: [],
	image: {
		url: get( window, "wpseoScriptData.metabox.metadata.opengraph-image", "" ),
		id: get( window, "wpseoScriptData.metabox.metadata.opengraph-image-id", "" ),
		alt: "",
	},
};

export const twitterInitialState = {
	title: get( window, "wpseoScriptData.metabox.metadata.twitter-title", "" ) || getSocialTitleTemplate(),
	description: get( window, "wpseoScriptData.metabox.metadata.twitter-description", "" ) || getSocialDescriptionTemplate(),
	warnings: [],
	image: {
		url: get( window, "wpseoScriptData.metabox.metadata.twitter-image", "" ),
		id: get( window, "wpseoScriptData.metabox.metadata.twitter-image-id", "" ),
		alt: "",
	},
};
