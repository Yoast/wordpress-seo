var passiveVoice = require( "../../js/researches/getPassiveVoice.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (présent)", function() {
		var paper = new Paper( "Je mange une pomme.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	});

	it( "returns passive voice (présent)", function() {
		// Passive: est mangée.
		var paper = new Paper( "Une pomme est mangée par moi.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length).toBe( 1 );
	});

	it( "returns passive voice (présent) with an irregular participle", function() {
		// Passive: est lu.
		var paper = new Paper( "Un libre est lu par moi.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length).toBe( 1 );
	});

	it( "returns passive voice (présent) with an irregular feminine participle", function() {
		// Passive: est vendue.
		var paper = new Paper( "Une voiture est vendue par moi.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length).toBe( 1 );
	});

	it( "returns active voice (futur)", function() {
		var paper = new Paper( "Je mangera une pomme.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	});

	it( "returns passive voice (futur)", function() {
		// Passive: sera mangée.
		var paper = new Paper( "Une pomme sera mangée par moi.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns active voice (passé simple)", function() {
		var paper = new Paper( "Je mangea une pomme.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	});

	it( "returns passive voice (passé simple)", function() {
		// Passive: fut mangée.
		var paper = new Paper( "Une pomme fut mangée par moi.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns active voice (passé composé)", function() {
		var paper = new Paper( "J'ai mangé une pomme.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	});

	it( "returns passive voice (passé composé)", function() {
	 	// Passive: a été mangée.
		var paper = new Paper( "Une pomme a été mangée par moi.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	});

	it( "returns active voice (imparfait)", function() {
		var paper = new Paper( "Je mangeais une pomme.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	});

	it( "returns passive voice (imparfait)", function() {
		// Passive: était mangée.
		var paper = new Paper( "Une pomme était mangée par moi.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length).toBe( 1 );
	});

	it( "returns active voice (plus-que-parfait)", function() {
		var paper = new Paper( "J'avais mangé une pomme.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	});

	it( "returns passive voice (plus-que-parfait)", function() {
		// Passive: avait été mangée.
		var paper = new Paper( "Une pomme avait été mangée par moi.", { locale: "fr_FR" } );
		expect( passiveVoice( paper ).passives.length).toBe( 1 );
	});
} );
