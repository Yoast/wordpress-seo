import get from "lodash/get";
import { facebookInitialState, twitterInitialState } from "./socialAppearance";
import { advancedSettingsInitialState } from "./advancedSettings";
export * from "./socialAppearance";

const initialState = {
	facebookEditor: facebookInitialState,
	twitterEditor: twitterInitialState,
	advancedSettings: advancedSettingsInitialState,
	focusKeyword: get( window, "wpseoScriptData.metabox.metadata.focuskw", "" ),
	isCornerstone: get( window, "wpseoScriptData.metabox.metadata.is_cornerstone", 0 ) === "1",
};

export default initialState;
