import { get } from "lodash";

const advancedValue = get( window, "wpseoScriptData.metabox.metadata.meta-robots-adv", "" );
const advancedList = typeof advancedValue === "string" ? advancedValue.split( "," ) : [];
const termNoIndex = get( window, "wpseoScriptData.metabox.metadata.noindex", "" );

/**
 * Initial state
 */
export const advancedSettingsInitialState = {
	noIndex: get( window, "wpseoScriptData.metabox.metadata.meta-robots-noindex", termNoIndex ),
	noFollow: get( window, "wpseoScriptData.metabox.metadata.meta-robots-nofollow", "0" ),
	advanced: advancedList,
	breadcrumbsTitle: get( window, "wpseoScriptData.metabox.metadata.bctitle", "" ),
	canonical: get( window, "wpseoScriptData.metabox.metadata.canonical", "" ),
	wordproofTimestamp: get( window, "wpseoScriptData.metabox.metadata.wordproof_timestamp", "" ) === "1",
};


