import { SET_ACTIVE_AI_FIXES_BUTTON, SET_DISABLED_AI_FIXES_BUTTONS } from "../../../src/redux/actions";
import AIButton from "../../../src/redux/reducers/AIButton";

describe( "AIButton", () => {
	const state = {
		activeAIButton: null,
		disabledAIButtons: {},
	};

	it( "should set the active AI fixes button on receiving the SET_ACTIVE_AI_FIXES_BUTTON action", () => {
		const action = {
			type: SET_ACTIVE_AI_FIXES_BUTTON,
			activeAIButton: "keyphraseDensityAIFixes",
		};
		const expected = {
			activeAIButton: "keyphraseDensityAIFixes",
			disabledAIButtons: {},
		};

		// eslint-disable-next-line new-cap
		expect( AIButton( state, action ) ).toEqual( expected );
	} );
	it( "should set the disabled AI fixes buttons on receiving the SET_DISABLED_AI_FIXES_BUTTONS action", () => {
		const action = {
			type: SET_DISABLED_AI_FIXES_BUTTONS,
			disabledAIButtons: { keyphraseDensityAIFixes: "too short", keyphraseDistributionAIFixes: "too long" },
		};
		const expected = {
			activeAIButton: null,
			disabledAIButtons: { keyphraseDensityAIFixes: "too short", keyphraseDistributionAIFixes: "too long" },
		};

		// eslint-disable-next-line new-cap
		expect( AIButton( state, action ) ).toEqual( expected );
	} );
} );
