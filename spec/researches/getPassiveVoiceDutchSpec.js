var passiveVoice = require( "../../js/researches/getPassiveVoice.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		var paper = new Paper( "Ik eet een appel.", { locale: "nl_NL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (present)", function() {
		// Passive: wordt gegeten
		var paper = new Paper( "Een appel wordt gegeten.", { locale: "nl_NL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );
} );
