import specialCharacterMappings from "../../js/stringProcessing/specialCharacterMappings";

describe( "a test for substituting Turkish letters in a string", function() {
	it( "returns all possible substitutions of Turkish letters", function() {
		expect( specialCharacterMappings( "İ I i ı İ I i ı" ) ).toEqual( [
			// The original string.
			"İ I i ı İ I i ı",
			// Add İ to i substitutions.
			"i I i ı İ I i ı",
			"İ I i ı i I i ı",
			"i I i ı i I i ı",
			// Add I to ı substitutions.
			"İ ı i ı İ I i ı",
			"İ I i ı İ ı i ı",
			"İ ı i ı İ ı i ı",
			// Add i to İ substitutions.
			"İ I İ ı İ I i ı",
			"İ I i ı İ I İ ı",
			"İ I İ ı İ I İ ı",
			// Add ı to I substitutions.
			"İ I i I İ I i ı",
			"İ I i ı İ I i I",
			"İ I i I İ I i I",
			// Everything to upper case.
			"İ I İ I İ I İ I",
			// Everything to lower case.
			"i ı i ı i ı i ı",
			// Everything to standard latin
			"I I i i I I i i",
		] );
	} );

	it( "returns a regex-ready string with all substitutions for a string with İ", function() {
		expect( specialCharacterMappings( "İstanbul" ) ).toEqual( [ "İstanbul", "istanbul", "Istanbul" ] );
	} );

	it( "returns a regex-ready string with all substitutions for a string with i", function() {
		expect( specialCharacterMappings( "istanbul" ) ).toEqual( [ "istanbul", "İstanbul" ] );
	} );

	it( "returns a regex-ready string with all substitutions for a string with I", function() {
		expect( specialCharacterMappings( "Istanbul" ) ).toEqual( [ "Istanbul", "ıstanbul" ] );
	} );

	it( "returns a regex-ready string with all substitutions for a string with ı", function() {
		expect( specialCharacterMappings( "ıstanbul" ) ).toEqual( [ "ıstanbul", "Istanbul", "istanbul" ] );
	} );
} );
