import {
	setActiveAIFixesButton,
	SET_ACTIVE_AI_FIXES_BUTTON,
	setDisabledAIFixesButtons,
	SET_DISABLED_AI_FIXES_BUTTONS,
} from "../../../src/redux/actions";

describe( "AIButton", () => {
	it( "setActiveAIFixesButton should return an action with the SET_ACTIVE_AI_FIXES_BUTTON type and the id of the active AI assessment fixes button", () => {
		const activeAIButton = "keyphraseInIntroductionAIFixes";

		const expected = {
			type: SET_ACTIVE_AI_FIXES_BUTTON,
			activeAIButton,
		};

		expect( setActiveAIFixesButton( activeAIButton ) ).toEqual( expected );
	} );
	it( "setDisabledAIFixesButtons should return an action with the SET_DISABLED_AI_FIXES_BUTTONS type and the ids of the disabled buttons", () => {
		const disabledAIButtons = { keyphraseInIntroductionAIFixes: "Your text is too long." };

		const expected = {
			type: SET_DISABLED_AI_FIXES_BUTTONS,
			disabledAIButtons,
		};

		expect( setDisabledAIFixesButtons( disabledAIButtons ) ).toEqual( expected );
	} );
} );
