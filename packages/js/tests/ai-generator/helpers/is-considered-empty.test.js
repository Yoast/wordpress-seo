import { isConsideredEmpty } from "../../../src/ai-generator/helpers";

describe( "isConsideredEmpty", () => {
	it( "should return true for an empty string", () => {
		expect( isConsideredEmpty( "" ) ).toBe( true );
	} );

	it( "should return true for a string with only spaces", () => {
		expect( isConsideredEmpty( "   " ) ).toBe( true );
	} );

	it( "should return true for a string with only punctuation", () => {
		expect( isConsideredEmpty( ".:" ) ).toBe( true );
	} );

	it( "should return true for a string with only symbols", () => {
		expect( isConsideredEmpty( "€@$" ) ).toBe( true );
	} );

	it( "should return true for a string combining spacing, punctuation, and symbols", () => {
		expect( isConsideredEmpty( " .^*\t:()<>±§~#+\n?!？ " ) ).toBe( true );
	} );

	it( "should return false for a non-empty string", () => {
		expect( isConsideredEmpty( "test" ) ).toBe( false );
	} );

	it( "should return false for a string with spaces and characters", () => {
		expect( isConsideredEmpty( " test " ) ).toBe( false );
	} );

	it( "should return false for a string with characters and punctuation", () => {
		expect( isConsideredEmpty( "test." ) ).toBe( false );
	} );
} );
