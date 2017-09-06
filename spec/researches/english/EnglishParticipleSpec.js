let EnglishParticiple = require( "../../../js/researches/english/EnglishParticiple.js" );

describe( "A test for checking the English Participle", function() {
	it( "checks the properties of the English participle object with a passive", function() {
		let mockParticiple = new EnglishParticiple( "fired", "He was fired", { auxiliaries: [ "was" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "fired" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

	it( "checks the properties of the English participle object with a non-verb ending in -ed", function() {
		let mockParticiple = new EnglishParticiple( "airbed", "It is wellbred", { auxiliaries: [ "is" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "airbed" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( true );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the English participle object with a 'rid' exception", function() {
		let mockParticiple = new EnglishParticiple( "rid", "He wants to get rid of it", { auxiliaries: [ "get" ], type: "irregular" } );
		expect( mockParticiple.getParticiple() ).toBe( "rid" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( true );
		expect( mockParticiple.directPrecedenceException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the English participle object with a direct precedence exception", function() {
		let mockParticiple = new EnglishParticiple( "read", "I am wiser for having read that book", { auxiliaries: [ "am" ], type: "irregular" } );
		expect( mockParticiple.getParticiple() ).toBe( "read" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the English participle object with a 'left' exception, which is now covered by the direct precedence exception", function() {
		let mockParticiple = new EnglishParticiple( "left", "He was at the left", { auxiliaries: [ "was" ], type: "irregular" } );
		expect( mockParticiple.getParticiple() ).toBe( "left" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the English participle object with 'left' that is not an exception", function() {
		let mockParticiple = new EnglishParticiple( "left", "He was left", { auxiliaries: [ "was" ], type: "irregular" } );
		expect( mockParticiple.getParticiple() ).toBe( "left" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

	it( "checks the properties of the English participle object with a 'fit' exception, which is now covered by the direct precedence exception", function() {
		let mockParticiple = new EnglishParticiple( "fit", "She was a fit girl", { auxiliaries: [ "was" ], type: "irregular" } );
		expect( mockParticiple.getParticiple() ).toBe( "fit" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the English participle object with a word from the direct precedence exception list which does not directly precede the participle", function() {
		let mockParticiple = new EnglishParticiple( "painted", "He was having his house painted", { auxiliaries: [ "was" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "painted" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

	it( "checks the properties of the English participle object with 'fit' that is not an exception", function() {
		let mockParticiple = new EnglishParticiple( "fit", "The data was then fit by the optimal model", { auxiliaries: [ "was" ], type: "irregular" } );
		expect( mockParticiple.getParticiple() ).toBe( "fit" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

	it( "ensures that the sentence part is set to passive if the participle is empty.", function() {
		let mockParticiple = new EnglishParticiple( "cooked", "It is cooked by him", { auxiliaries: [ "is" ], type: "regular" } );
		mockParticiple._participle = null;
		mockParticiple.checkException();
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});
});
