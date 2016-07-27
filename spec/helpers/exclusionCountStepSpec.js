var ExclusionCountStep = require( "../../js/helpers/exclusionCountStep.js" );

describe( "Creates a syllable counter for an exclusion", function() {
	it( "returns a syllable count step", function() {
		var mockConfig = {
			exclusionParts: [
				{
					word: "test",
					syllables: 1
				}
			],
			matchBeginning: true,
			matchEnd: true
		};

		var step = new ExclusionCountStep( mockConfig );
		expect( step.createRegex( "test" ) ).toEqual( /(^test|test$)/ );
		expect( step.countSyllables( "teststring" ).syllableCount ).toBe ( 1 );
		expect( step.countSyllables( "teststring" ).word ).toBe ( " string" );
	} );

	it( "returns a syllable count step", function() {
		var mockConfig = {
			exclusionParts: [
				{
					word: "foo",
					syllables: 1
				}
			],
			matchBeginning: true,
			regexBeginLetters: [ "s", "t", "n" ]
		};
		var step = new ExclusionCountStep( mockConfig );

		expect( step.createRegex( "foo" ) ).toEqual( /(^foos|^foot|^foon)/ );
		expect( step.countSyllables( "foobar" ).syllableCount ).toBe( 0 );
		expect( step.countSyllables( "foonbar" ).syllableCount ).toBe( 1 );
	} );

	it( "returns a syllable count step with default regex", function() {
		var mockConfig = {
			exclusionParts: [
				{
					word: "bar",
					syllables: 1
				}
			]
		};
		var step = new ExclusionCountStep( mockConfig );

		expect( step.createRegex( "bar" ) ).toEqual( /bar/ );
		expect( step.countSyllables( "foobar" ).syllableCount ).toBe( 1 );
	} );
} );
