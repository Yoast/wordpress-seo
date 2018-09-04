import regex from "./../../../../src/researches/german/passiveVoice/regex.js";
let verbsBeginningWithGe = regex().verbsBeginningWithGe;
let	verbsBeginningWithErVerEntBeZerHerUber = regex().verbsBeginningWithErVerEntBeZerHerUber;
let verbsWithGeInMiddle = regex().verbsWithGeInMiddle;
let verbsWithErVerEntBeZerHerUberInMiddle = regex().verbsWithErVerEntBeZerHerUberInMiddle;
let verbsEndingWithIert = regex().verbsEndingWithIert;
let exceptions = regex().exceptions;

describe( "Matches verbs with the verb regexes for German.", function() {
	it( "returns the matched verb beginning with ge-", function() {
		expect( verbsBeginningWithGe( "gebraucht" ) ).toEqual( [ "gebraucht" ] );
	} );

	it( "returns the matched verb beginning with ent-", function() {
		expect( verbsBeginningWithErVerEntBeZerHerUber( "enterbt" ) ).toEqual( [ "enterbt" ] );
	} );

	it( "returns the matched verb with -ge- in the middle", function() {
		expect( verbsWithGeInMiddle( "abgearbeitet" ) ).toEqual( [ "abgearbeitet" ] );
	} );

	it( "returns the matched verb with -be- in the middle", function() {
		expect( verbsWithErVerEntBeZerHerUberInMiddle( "aufbereitet" ) ).toEqual( [ "aufbereitet" ] );
	} );

	it( "returns the matched verb ending with -iert", function() {
		expect( verbsEndingWithIert( "funktioniert" ) ).toEqual( [ "funktioniert" ] );
	} );

	it( "returns the matched verb ending with -dienst", function() {
		expect( exceptions( "geheimdienst" ) ).toEqual( [ "geheimdienst" ] );
	} );

	it( "returns an empty array when nothing is matched with the verbsBeginningWithGe regex", function() {
		expect( verbsBeginningWithGe( "funktioniert" ) ).toEqual( [ ] );
	} );

	it( "returns an empty array when nothing is matched with the verbsBeginningWithErVerEntBeZerHerUber regex", function() {
		expect( verbsBeginningWithErVerEntBeZerHerUber( "funktioniert" ) ).toEqual( [ ] );
	} );

	it( "returns an empty array when nothing is matched with the verbsWithGeInMiddle regex", function() {
		expect( verbsWithGeInMiddle( "funktioniert" ) ).toEqual( [ ] );
	} );

	it( "an empty array when nothing is matched with the verbsWithErVerEntBeZerHerUberInMiddle regex", function() {
		expect( verbsWithErVerEntBeZerHerUberInMiddle( "funktioniert" ) ).toEqual( [ ] );
	} );

	it( "an empty array when nothing is matched with the verbsEndingWithIert regex", function() {
		expect( verbsEndingWithIert( "gebraucht" ) ).toEqual( [ ] );
	} );

	it( "returns an empty array when nothing is matched with the exception regex.", function() {
		expect( exceptions( "funktioniert" ) ).toEqual( [ ] );
	} );
} );
