import { getActiveAIFixesButton } from "../../../src/redux/selectors/activeAIButton";

const testState = {
	activeAIButton: "keyphraseInSubheadingAIFixes",
};

describe( "getActiveAIFixesButton", () => {
	it( "returns the id of the active AI Assessment Fixes button", () => {
		const actual = getActiveAIFixesButton( testState );

		expect( actual ).toEqual( "keyphraseInSubheadingAIFixes" );
	} );
} );
