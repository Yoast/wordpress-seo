import get from "lodash/get";
import { facebookInitialState, twitterInitialState } from "./socialAppearance";
import { advancedSettingsInitialState } from "./advancedSettings";
export * from "./socialAppearance";
import primaryTaxonomies from "./primaryTaxonomies";

const initialState = {
	facebookEditor: facebookInitialState,
	twitterEditor: twitterInitialState,
	advancedSettings: advancedSettingsInitialState,
	focusKeyword: get( window, "wpseoScriptData.metabox.metadata.focuskw", "" ),
	isCornerstone: get( window, "wpseoScriptData.metabox.metadata.is_cornerstone", 0 ) === "1",
	primaryTaxonomies,
};

export default initialState;
