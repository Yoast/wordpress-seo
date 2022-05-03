import EnglishClause from "../../../../../src/languageProcessing/languages/en/values/Clause.js";

describe( "creates an English clause", function() {
	it( "makes sure the English clause inherits all functions", function() {
		const mockPart = new EnglishClause( "English texts are great.", [ "are" ] );
		expect( mockPart.getClauseText() ).toBe( "English texts are great." );
		expect( mockPart.getAuxiliaries() ).toEqual( [ "are" ] );
	} );
	it( "returns a irregular participle for an English clause", function() {
		const mockPart = new EnglishClause( "English texts are written.", [ "are" ] );
		expect( mockPart.getParticiples()[ 0 ] ).toBe( "written" );
		expect( mockPart.isPassive() ).toBe( true );
	} );
	it( "returns a regular participle for an English clause", function() {
		const mockPart = new EnglishClause( "The kitchen cabinets were nailed to the wall.", [ "are" ] );
		expect( mockPart.getParticiples()[ 0 ] ).toBe( "nailed" );
		expect( mockPart.isPassive() ).toBe( true );
	} );
	it( "returns non-participle for an English clause with a non-passive exception", function() {
		const mockPart = new EnglishClause( "They will be getting rid of the old clothes.", [ "be" ] );
		expect( mockPart.getParticiples()[ 0 ] ).toBe( "rid" );
		expect( mockPart.isPassive() ).toBe( false );
	} );
	it( "checks the properties of the English participle object with a non-verb ending in -ed", function() {
		const mockPart = new EnglishClause( "It is wellbred", [ "is" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "wellbred" ] );
		expect( mockPart.hasRidException() ).toBe( false );
		expect( mockPart.isPassive() ).toBe( false );
	} );
	it( "checks the properties of the English participle object with a 'rid' exception", function() {
		const mockPart = new EnglishClause( "He wants to get rid of it", [ "get" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "rid" ] );
		expect( mockPart.isPassive() ).toBe( false );
	} );
	it( "checks the properties of the English participle object with a direct precedence exception", function() {
		const mockPart = new EnglishClause( "I am wiser for having read that book", [ "am" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "read" ] );
		expect( mockPart.hasRidException() ).toBe( false );
		expect( mockPart.isPassive() ).toBe( false );
	} );
	it( "checks the properties of the English participle object with a 'left' exception, which is now covered by " +
		"the direct precedence exception", function() {
		const mockPart = new EnglishClause( "He was at the left", [ "was" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "left" ] );
		expect( mockPart.hasRidException() ).toBe( false );
		expect( mockPart.isPassive() ).toBe( false );
	} );
	it( "checks the properties of the English participle object with 'left' that is not an exception", function() {
		const mockPart = new EnglishClause( "He was left", [ "was" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "left" ] );
		expect( mockPart.hasRidException() ).toBe( false );
		expect( mockPart.isPassive() ).toBe( true );
	} );
	it( "checks the properties of the English participle object with a 'fit' exception, which is now covered by " +
		"the direct precedence exception", function() {
		const mockPart = new EnglishClause( "She was a fit girl", [ "was" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "fit" ] );
		expect( mockPart.hasRidException() ).toBe( false );
		expect( mockPart.isPassive() ).toBe( false );
	} );
	it( "checks the properties of the English participle object with a word from the direct precedence exception list " +
		"which does not directly precede the participle", function() {
		const mockPart = new EnglishClause( "He was having his house painted", [ "was" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "painted" ] );
		expect( mockPart.hasRidException() ).toBe( false );
		expect( mockPart.isPassive() ).toBe( true );
	} );
	it( "checks the properties of the English participle object with 'fit' that is not an exception", function() {
		const mockPart = new EnglishClause( "The data was then fit by the optimal model", [ "was" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "fit" ] );
		expect( mockPart.hasRidException() ).toBe( false );
		expect( mockPart.isPassive() ).toBe( true );
	} );
	it( "checks the properties of the English participle object with a precedence exception when the word " +
		"from the list doesn't directly precede the participle", function() {
		const mockPart = new EnglishClause( "It's something I've always enjoyed doing", [ "it's" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "enjoyed" ] );
		expect( mockPart.hasRidException() ).toBe( false );
		expect( mockPart.isPassive() ).toBe( false );
	} );
	it( "checks the properties of the English participle object with a precedence exception when the word " +
		"from the list directly precedes the participle", function() {
		const mockPart = new EnglishClause( "Here is a list of ten beliefs I have adopted", [ "is" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "adopted" ] );
		expect( mockPart.hasRidException() ).toBe( false );
		expect( mockPart.isPassive() ).toBe( false );
	} );
	it( "checks the properties of the English participle object with a precedence exception when the word from" +
		" the list occurs after the participle", function() {
		const mockPart = new EnglishClause( "The money was stolen, but nobody has been able to prove it", [ "was" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "stolen" ] );
		expect( mockPart.hasRidException() ).toBe( false );
		expect( mockPart.isPassive() ).toBe( true );
	} );
} );
