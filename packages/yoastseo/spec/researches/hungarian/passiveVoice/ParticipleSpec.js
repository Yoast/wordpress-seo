import HungarianParticiple from "../../../../src/researches/hungarian/passiveVoice/HungarianParticiple.js";

describe( "A test for checking the Hungarian Participle", function() {
	it( "checks the properties of the Hungarian participle object without a passive", function() {
		const mockParticiple = new HungarianParticiple( "elintéz", "Megeszem a pohár joghurtot.", { auxiliaries: [ "fogok" ], type: "ődni at the end", language: "hu" } );
		expect( mockParticiple.getParticiple() ).toBe( "elintéz" );
		expect( mockParticiple.isNonPassivesInVaAndVe() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the Hungarian participle object with a word that looks like a participle from the list", function() {
		const mockParticiple = new HungarianParticiple( "telefonkönyve", "Megeszem a pohár joghurtot van telefonkönyve.", { auxiliaries: [ "van" ], type: "ve at the end", language: "hu" } );
		expect( mockParticiple.getParticiple() ).toBe( "telefonkönyve" );
		expect( mockParticiple.isNonPassivesInVaAndVe() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	// it( "checks the properties of the german participle object without a passive, and without 'haben'/'sein'", function() {
	// 	const mockParticiple = new HungarianParticiple( "gekauft", "Es wird gekauft.", { auxiliaries: [ "wird" ], type: "ge- at beginning", language: "de" } );
	// 	expect( mockParticiple.getParticiple() ).toBe( "gekauft" );
	// 	expect( mockParticiple.hasHabenSeinException() ).toBe( false );
	// 	expect( mockParticiple.isInExceptionList() ).toBe( false );
	// 	expect( mockParticiple.hasNounSuffix() ).toBe( false );
	// 	expect( mockParticiple.isAuxiliary() ).toBe( false );
	// 	expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	// } );
	//
	// it( "checks the properties of the german participle object with a participle from the exception list.", function() {
	// 	const mockParticiple = new HungarianParticiple( "geburtsakt", "Es wird geburtsakt.", { auxiliaries: [ "wird" ], type: "ge- at beginning", language: "de" } );
	// 	expect( mockParticiple.getParticiple() ).toBe( "geburtsakt" );
	// 	expect( mockParticiple.hasHabenSeinException() ).toBe( false );
	// 	expect( mockParticiple.isInExceptionList() ).toBe( true );
	// 	expect( mockParticiple.hasNounSuffix() ).toBe( false );
	// 	expect( mockParticiple.isAuxiliary() ).toBe( false );
	// 	expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	// } );
	//
	// it( "checks the properties of the german participle object with a participle that is an auxiliary.", function() {
	// 	const mockParticiple = new HungarianParticiple( "bekommst", "In deinem Netzwerk bekommst du emotionale Unterstützung.", { auxiliaries: [ "bekommst" ], type: "be- at beginning", language: "de" } );
	// 	expect( mockParticiple.getParticiple() ).toBe( "bekommst" );
	// 	expect( mockParticiple.hasHabenSeinException() ).toBe( false );
	// 	expect( mockParticiple.isInExceptionList() ).toBe( false );
	// 	expect( mockParticiple.hasNounSuffix() ).toBe( false );
	// 	expect( mockParticiple.isAuxiliary() ).toBe( true );
	// 	expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	// } );
	//
	// it( "checks the properties of the german participle object with a participle with a noun suffix.", function() {
	// 	const mockParticiple = new HungarianParticiple( "gemütlichkeit", "Es wird gemütlichkeit.", { auxiliaries: [ "wird" ], type: "ge- at beginning", language: "de" } );
	// 	expect( mockParticiple.getParticiple() ).toBe( "gemütlichkeit" );
	// 	expect( mockParticiple.hasHabenSeinException() ).toBe( false );
	// 	expect( mockParticiple.isInExceptionList() ).toBe( false );
	// 	expect( mockParticiple.hasNounSuffix() ).toBe( true );
	// 	expect( mockParticiple.isAuxiliary() ).toBe( false );
	// 	expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	// } );
	//
	// it( "checks the properties of the german participle object with a participle follwed by a special quotation mark.", function() {
	// 	const mockParticiple = new HungarianParticiple( "gekauft", "Es wurde “gekauft”.", { auxiliaries: [ "wurde" ], type: "ge- at beginning", language: "de" } );
	// 	expect( mockParticiple.getParticiple() ).toBe( "gekauft" );
	// 	expect( mockParticiple.hasHabenSeinException() ).toBe( false );
	// 	expect( mockParticiple.isInExceptionList() ).toBe( false );
	// 	expect( mockParticiple.hasNounSuffix() ).toBe( false );
	// 	expect( mockParticiple.isAuxiliary() ).toBe( false );
	// 	expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	// } );
} );
