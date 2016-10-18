var EnglishParticiple = require( "../../../js/researches/english/EnglishParticiple.js" );

describe( "A test for checking the English Participle", function() {
	it( "checks the properties of the English participle object with a passive", function() {
		var mockParticiple = new EnglishParticiple( "fired", "He was fired", [ "was" ], "regular" );
		expect( mockParticiple.getParticiple() ).toBe( "fired" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.hasHavingException() ).toBe( false );
		expect( mockParticiple.hasLeftException() ).toBe( false );
		expect( mockParticiple.hasFitException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

	it( "checks the properties of the English participle object with a non-verb ending in -ed", function() {
		var mockParticiple = new EnglishParticiple( "airbed", "It is an airbed", [ "is" ], "regular" );
		expect( mockParticiple.getParticiple() ).toBe( "airbed" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( true );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.hasHavingException() ).toBe( false );
		expect( mockParticiple.hasLeftException() ).toBe( false );
		expect( mockParticiple.hasFitException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the English participle object with a 'rid' exception", function() {
		var mockParticiple = new EnglishParticiple( "rid", "He wants to get rid of it", [ "get" ], "irregular" );
		expect( mockParticiple.getParticiple() ).toBe( "rid" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( true );
		expect( mockParticiple.hasHavingException() ).toBe( false );
		expect( mockParticiple.hasLeftException() ).toBe( false );
		expect( mockParticiple.hasFitException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the English participle object with a 'having' exception", function() {
		var mockParticiple = new EnglishParticiple( "read", "I am wiser for having read that book", [ "am" ], "irregular" );
		expect( mockParticiple.getParticiple() ).toBe( "read" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.hasHavingException() ).toBe( true );
		expect( mockParticiple.hasLeftException() ).toBe( false );
		expect( mockParticiple.hasFitException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the English participle object with a 'left' exception", function() {
		var mockParticiple = new EnglishParticiple( "left", "He was at the left", [ "was" ], "irregular" );
		expect( mockParticiple.getParticiple() ).toBe( "left" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.hasHavingException() ).toBe( false );
		expect( mockParticiple.hasLeftException() ).toBe( true );
		expect( mockParticiple.hasFitException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the English participle object with 'left' that is not an exception", function() {
		var mockParticiple = new EnglishParticiple( "left", "He was left", [ "was" ], "irregular" );
		expect( mockParticiple.getParticiple() ).toBe( "left" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.hasHavingException() ).toBe( false );
		expect( mockParticiple.hasLeftException() ).toBe( false );
		expect( mockParticiple.hasFitException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

	it( "checks the properties of the English participle object with a 'fit' exception", function() {
		var mockParticiple = new EnglishParticiple( "fit", "She was a fit girl", [ "was" ], "irregular" );
		expect( mockParticiple.getParticiple() ).toBe( "fit" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.hasHavingException() ).toBe( false );
		expect( mockParticiple.hasLeftException() ).toBe( false );
		expect( mockParticiple.hasFitException() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the English participle object with a 'fit' exception", function() {
		var mockParticiple = new EnglishParticiple( "fit", "She lithe the fit girl", [ "was" ], "irregular" );
		expect( mockParticiple.getParticiple() ).toBe( "fit" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.hasHavingException() ).toBe( false );
		expect( mockParticiple.hasLeftException() ).toBe( false );
		expect( mockParticiple.hasFitException() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the English participle object with 'fit' that is not an exception", function() {
		var mockParticiple = new EnglishParticiple( "fit", "The data was then fit by the optimal model", [ "was" ], "irregular" );
		expect( mockParticiple.getParticiple() ).toBe( "fit" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.hasHavingException() ).toBe( false );
		expect( mockParticiple.hasLeftException() ).toBe( false );
		expect( mockParticiple.hasFitException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

	it( "checks the properties of an empty English participle object", function() {
		var mockParticiple = new EnglishParticiple();
		expect( mockParticiple.getParticiple() ).toBe( "" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.hasHavingException() ).toBe( false );
		expect( mockParticiple.hasLeftException() ).toBe( false );
		expect( mockParticiple.hasFitException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

});
