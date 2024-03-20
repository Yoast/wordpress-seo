import { facebookInitialState, twitterInitialState } from "./socialAppearance";
import { advancedSettingsInitialState } from "./advancedSettings";
export * from "./socialAppearance";

const initialState = {
	facebookEditor: facebookInitialState,
	twitterEditor: twitterInitialState,
	advancedSettings: advancedSettingsInitialState,
};

export default initialState;
