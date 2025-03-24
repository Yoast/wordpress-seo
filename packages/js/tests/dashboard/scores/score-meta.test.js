import { describe, expect, it } from "@jest/globals";
import { SCORE_DESCRIPTIONS, SCORE_META } from "../../../src/dashboard/scores/score-meta";

describe( "SCORE_META", () => {
	it.each( [
		"good",
		"ok",
		"bad",
		"notAnalyzed",
	] )( "score type \"%s\" should contain a label, color, hex and an optional tooltip", ( scoreType ) => {
		expect( SCORE_META[ scoreType ] ).toBeDefined();
		expect( SCORE_META[ scoreType ] ).toEqual( expect.any( Object ) );
		expect( SCORE_META[ scoreType ].label ).toEqual( expect.any( String ) );
		expect( SCORE_META[ scoreType ].color ).toEqual( expect.any( String ) );
		expect( SCORE_META[ scoreType ].hex ).toEqual( expect.any( String ) );
		if ( SCORE_META[ scoreType ].tooltip !== undefined ) {
			// When present, the tooltip should be a string.
			expect( SCORE_META[ scoreType ].tooltip ).toEqual( expect.any( String ) );
		}
	} );
} );

describe( "SCORE_DESCRIPTIONS", () => {
	it.each( [
		"seo",
		"readability",
	] )( "analysis type \"%s\" should contain descriptions for good, ok, bad and notAnalyzed", ( analysisType ) => {
		expect( SCORE_DESCRIPTIONS[ analysisType ] ).toBeDefined();
		expect( SCORE_DESCRIPTIONS[ analysisType ] ).toEqual( expect.any( Object ) );
		expect( SCORE_DESCRIPTIONS[ analysisType ].good ).toEqual( expect.any( String ) );
		expect( SCORE_DESCRIPTIONS[ analysisType ].ok ).toEqual( expect.any( String ) );
		expect( SCORE_DESCRIPTIONS[ analysisType ].bad ).toEqual( expect.any( String ) );
		expect( SCORE_DESCRIPTIONS[ analysisType ].notAnalyzed ).toEqual( expect.any( String ) );
	} );
} );
