import { getActiveAIFixesButton, getDisabledAIFixesButtons } from "../../../src/redux/selectors";

describe( "AIButton", () => {
	const state = {
		AIButton: {
			activeAIButton: "keyphraseInSubheadingAIFixes",
			disabledAIButtons: { keyphraseDensityAIFixes: "Your text is too long." },
		},
	};

	it( "returns the id of the active AI Assessment Fixes button", () => {
		expect( getActiveAIFixesButton( state ) ).toEqual( "keyphraseInSubheadingAIFixes" );
	} );
	it( "returns the ids of the disabled AI Assessment Fixes buttons", () => {
		expect( getDisabledAIFixesButtons( state ) ).toEqual( { keyphraseDensityAIFixes: "Your text is too long." } );
	} );
} );
