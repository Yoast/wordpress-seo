import { getActiveAIFixesButton } from "../../../src/redux/selectors";

const testState = {
	AIButton: {
		activeAIButton: "keyphraseInSubheadingAIFixes",
	},
};

describe( "getActiveAIFixesButton", () => {
	it( "returns the id of the active AI Assessment Fixes button", () => {
		const actual = getActiveAIFixesButton( testState );

		expect( actual ).toEqual( "keyphraseInSubheadingAIFixes" );
	} );
} );
