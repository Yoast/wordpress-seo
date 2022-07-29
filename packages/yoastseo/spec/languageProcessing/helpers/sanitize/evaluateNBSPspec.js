import evaluateNBSP from "../../../../src/languageProcessing/helpers/sanitize/evaluateNBSP";

describe( "A test for the evaluateNBSP helper", () => {
	it( "should return a string with all &nbsp; replaced with the actual character `\u00A0`", () => {
		expect( evaluateNBSP( "Honeycomb metal rainboot planter are&nbsp;perfect for indoors or outdoors." ) ).toEqual(
			"Honeycomb metal rainboot planter are\u00A0perfect for indoors or outdoors." );
		// eslint-disable-next-line max-len
		expect( evaluateNBSP( "&nbsp;Honeycomb&nbsp;metal&nbsp;rainboot&nbsp;planter&nbsp;are&nbsp;perfect&nbsp;for&nbsp;indoors&nbsp;or&nbsp;outdoors.&nbsp;" ) ).toEqual(
			"\u00A0Honeycomb\u00A0metal\u00A0rainboot\u00A0planter\u00A0are\u00A0perfect\u00A0for\u00A0indoors\u00A0or\u00A0outdoors.\u00A0" );
	} );
} );
