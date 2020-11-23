import HungarianParticiple from "../../../../src/researches/hungarian/passiveVoice/HungarianParticiple.js";

describe( "A test for checking the Hungarian Participle", function() {

	it( "checks the properties of the Hungarian participle object with a participle from the list of  participles in -ra and -re.", function() {
		const mockParticiple = new HungarianParticiple( "minősítésre", "A diákok minősítésre kerültek.", { auxiliaries: [ "kerültek" ], type: "re- at the end", language: "hu" } );
		expect( mockParticiple.getParticiple() ).toBe( "minősítésre" );
		expect( mockParticiple.isNonPassivesInVaAndVe() ).toBe( false );
		// expect(mockParticiple.participlesInReAndRa() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the Hungarian participle object with a word that looks like a participle from the list", function() {
		const mockParticiple = new HungarianParticiple( "vezérszava", "A klubunknak nincs vezérszava.", { auxiliaries: [ "" ], type: "", language: "hu" } );
		expect( mockParticiple.getParticiple() ).toBe( "vezérszava" );
		expect( mockParticiple.isNonPassivesInVaAndVe() ).toBe( true );
		// expect(mockParticiple.participlesInReAndRa() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the Hungarian participle object with a participle followed by a special quotation mark.", function() {
		const mockParticiple = new HungarianParticiple( "mosva", "Az ablak le van “mosva”.", { auxiliaries: [ "van" ], type: "-va at the end", language: "hu" } );
		expect( mockParticiple.getParticiple() ).toBe( "mosva" );
		expect( mockParticiple.isNonPassivesInVaAndVe() ).toBe( false );
		// expect(mockParticiple.participlesInReAndRa() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the Hungarian participle object with a participle followed by a Hungarian specific quotation mark.", function() {
		const mockParticiple = new HungarianParticiple( "mosva", "Az ablak le van „mosva”.", { auxiliaries: [ "van" ], type: "-va at the end", language: "hu" } );
		expect( mockParticiple.getParticiple() ).toBe( "mosva" );
		expect( mockParticiple.isNonPassivesInVaAndVe() ).toBe( false );
		// expect(mockParticiple.participlesInReAndRa() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );
	
} );
