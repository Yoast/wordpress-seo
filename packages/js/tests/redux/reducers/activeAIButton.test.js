import { SET_ACTIVE_AI_FIXES_BUTTON } from "../../../src/redux/actions/activeAIButton";
import activeAIButton from "../../../src/redux/reducers/activeAIButton";

describe( "activeAIButton on receiving the SET_ACTIVE_AI_FIXES_BUTTON action", () => {
	it( "should set the message in the warning state", () => {
		const state = null;
		const action = {
			type: SET_ACTIVE_AI_FIXES_BUTTON,
			activeAIButton: "keyphraseDensityAIFixes",
		};
		const expected = "keyphraseDensityAIFixes";
		const actual = activeAIButton( state, action );

		expect( actual ).toEqual( expected );
	} );
} );
