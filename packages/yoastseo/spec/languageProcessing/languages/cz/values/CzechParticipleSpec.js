import CzechParticiple from "../../../../../src/languageProcessing/languages/cz/values/CzechParticiple";

describe( "A test for checking the Czech participle", function() {
	it( "checks the properties of the Czech participle object with a passive", function() {
		const mockParticiple = new CzechParticiple( "napsáno", "již bylo napsáno.", {
			auxiliaries: [ "bylo" ],
			language: "cz",
		} );

		expect( mockParticiple.getParticiple() ).toBe( "napsáno" );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
