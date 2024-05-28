import { setActiveAIFixesButton, SET_ACTIVE_AI_FIXES_BUTTON } from "../../../src/redux/actions";

describe( "setActiveAIFixesButton", () => {
	it( "setActiveAIFixesButton should return an action with the SET_ACTIVE_AI_FIXES_BUTTON type and the id of the active AI assessment fixes button", () => {
		const activeAIButton = "keyphraseInIntroductionAIFixes";

		const expected = {
			type: SET_ACTIVE_AI_FIXES_BUTTON,
			activeAIButton,

		};
		const actual = setActiveAIFixesButton( activeAIButton );

		expect( actual ).toEqual( expected );
	} );
} );
