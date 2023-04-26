import getWritingDirection from "../../src/analysis/getWritingDirection";

describe( "a test to get the information on the writing direction of a page", () => {
	it( "should return 'RTL' when isRtl is true", () => {
		window.wpseoScriptData = {
			metabox: {
				isRtl: true,
			},
		};
		expect( getWritingDirection() ).toEqual( "RTL" );
	} );

	it( "should return 'LTR' when isRtl is false", () => {
		window.wpseoScriptData = {
			metabox: {
				isRtl: false,
			},
		};
		expect( getWritingDirection() ).toEqual( "LTR" );
	} );
} );
