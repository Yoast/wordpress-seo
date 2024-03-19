import { facebookInitialState, twitterInitialState } from "./socialAppearance";
export * from "./socialAppearance";

const initialState = {
	facebookEditor: facebookInitialState,
	twitterEditor: twitterInitialState,
};

export default initialState;
