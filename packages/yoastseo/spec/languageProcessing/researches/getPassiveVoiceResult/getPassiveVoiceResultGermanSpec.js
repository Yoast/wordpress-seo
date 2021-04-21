import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/de/Researcher";

describe( "detecting passive voice in sentences with irregularParticiples", function() {
	it( "does not return passive for an irregular participle directly followed by 'sein'", function() {
		const paper = new Paper( "Ich werde geschwommen sein.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );
	it( "returns passive voice for an irregular participle not directly followed by 'sein'", function() {
		const paper = new Paper( "Es wird geschwommen worden sein.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does not return passive voice for an irregular participle directly followed by 'haben'", function() {
		const paper = new Paper( "Wir werden geschlossen haben.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice for an irregular participle not directly followed by 'haben'", function() {
		const paper = new Paper( "Es wird geschlossen worden sein.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice for an irregular participle without 'haben' or 'sein'", function() {
		const paper = new Paper( "Es wird geschlossen.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );
} );

describe( "detecting passive voice in sentences with regular participles", function() {
	it( "returns passive voice for a participle with 'ge' without 'haben' or 'sein'", function() {
		const paper = new Paper( "Es wird gekauft.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice for a participle with 'ge' directly followed by 'haben'", function() {
		const paper = new Paper( "Es wird gekauft haben.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );
} );

describe( "not detecting passive voice in active sentences", function() {
	it( "does not return passive for a sentence without a passive auxiliary", function() {
		const paper = new Paper( "Es ist geschlossen.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "filters out non-participles if they are followed by a punctuation mark", function() {
		const paper = new Paper( "Es wird geburtsakt.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );
} );

describe( "detecting passive voice in all passive verb tenses and moods", function() {
	it( "does return passive for Präsens Indikativ", function() {
		const paper = new Paper( "Es wird gekauft.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Präsens Konjunktiv I", function() {
		const paper = new Paper( "Es wird werde gekauft.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Präteritum Indikativ", function() {
		const paper = new Paper( "Es wurde gekauft.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Präteritum Konjunktiv II", function() {
		const paper = new Paper( "Es würde gekauft.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Perfekt Indikativ", function() {
		const paper = new Paper( "Es ist gekauft worden.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Perfekt Konjunktiv I", function() {
		const paper = new Paper( "Es sei gekauft worden.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Plusquamperfekt Indikativ", function() {
		const paper = new Paper( "Es war gekauft worden.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Plusquamperfekt Konjunktiv II", function() {
		const paper = new Paper( "Es wäre gekauft worden.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Futur I Indikativ", function() {
		const paper = new Paper( "Es wirst gekauft werden.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Futur I Konjunktiv I", function() {
		const paper = new Paper( "Es werdest gekauft werden.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Futur I Konjunktiv II", function() {
		const paper = new Paper( "Es würdest gekauft werden.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Futur II Indikativ", function() {
		const paper = new Paper( "Es wird gekauft worden sein.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Futur II Konjunktiv I", function() {
		const paper = new Paper( "Es werde gekauft worden sein.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "does return passive for Futur II Konjunktiv II", function() {
		const paper = new Paper( "Es würde gekauft worden sein.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );
} );

describe( "not detecting passive voice in all active verb tenses and moods", function() {
	it( "does not return passive for Präsens Indikativ", function() {
		const paper = new Paper( "Er kauft.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Präsens Konjunktiv I", function() {
		const paper = new Paper( "Er kaufe.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Präteritum Indikativ", function() {
		const paper = new Paper( "Er kaufte.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Präteritum Konjunktiv II", function() {
		const paper = new Paper( "Er kaufte.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Perfekt Indikativ", function() {
		const paper = new Paper( "Er hat gekauft.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Perfekt Konjunktiv I", function() {
		const paper = new Paper( "Er habe gekauft.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Plusquamperfekt Indikativ", function() {
		const paper = new Paper( "Er hatte gekauft.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Plusquamperfekt Konjunktiv II", function() {
		const paper = new Paper( "Er hätte gekauft.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Futur I Indikativ", function() {
		const paper = new Paper( "Er wird kaufen.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Futur I Konjunktiv I", function() {
		const paper = new Paper( "Er werde kaufen.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Futur I Konjunktiv II", function() {
		const paper = new Paper( "Er würde kaufen.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Futur II Indikativ", function() {
		const paper = new Paper( "Er wird gekauft haben.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Futur II Konjunktiv I", function() {
		const paper = new Paper( "Er werde gekauft haben.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "does not return passive for Futur II Konjunktiv II", function() {
		const paper = new Paper( "Er würde gekauft haben.", { locale: "de_DE" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );
} );
