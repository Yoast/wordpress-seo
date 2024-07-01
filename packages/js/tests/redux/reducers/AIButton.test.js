import { SET_ACTIVE_AI_FIXES_BUTTON } from "../../../src/redux/actions";
import AIButton from "../../../src/redux/reducers/AIButton";

describe( "AIButton", () => {
	it( "should set the active AI fixes button on receiving the SET_ACTIVE_AI_FIXES_BUTTON action", () => {
		const state = {
			activeAIButton: null,
			disabledAIButtons: [],
		};
		const action = {
			type: SET_ACTIVE_AI_FIXES_BUTTON,
			activeAIButton: "keyphraseDensityAIFixes",
		};
		const expected = {
			activeAIButton: "keyphraseDensityAIFixes",
			disabledAIButtons: [],
		};

		// eslint-disable-next-line new-cap
		expect( AIButton( state, action ) ).toEqual( expected );
	} );
} );
