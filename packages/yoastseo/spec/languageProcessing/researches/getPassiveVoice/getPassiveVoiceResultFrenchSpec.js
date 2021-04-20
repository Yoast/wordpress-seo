import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/fr/Researcher";

// eslint-disable-next-line max-statements
describe( "detecting passive voice in sentences", function() {
	it( "returns active voice (présent)", function() {
		const paper = new Paper( "Je mange une pomme.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (présent)", function() {
		// Passive: est selectionné.
		const paper = new Paper( "Un livre est selectionné par moi.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (futur)", function() {
		const paper = new Paper( "Je mangera une pomme.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (futur)", function() {
		// Passive: sera mangée.
		const paper = new Paper( "Une pomme sera mangée par moi.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (passé simple)", function() {
		const paper = new Paper( "Je mangea une pomme.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (passé simple)", function() {
		// Passive: fut mangée.
		const paper = new Paper( "Une pomme fut mangée par moi.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (passé composé)", function() {
		const paper = new Paper( "J'ai mangé une pomme.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (passé composé)", function() {
		// Passive: a été mangée.
		const paper = new Paper( "Une pomme a été mangée par moi.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (imparfait)", function() {
		const paper = new Paper( "Je mangeais une pomme.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (imparfait)", function() {
		// Passive: était mangée.
		const paper = new Paper( "Une pomme était mangée par moi.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice (plus-que-parfait)", function() {
		const paper = new Paper( "J'avais mangé une pomme.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice (plus-que-parfait)", function() {
		// Passive: avait été mangée.
		const paper = new Paper( "Une pomme avait été mangée par moi.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with a participle with a suffix", function() {
		// Passive: est mangée.
		const paper = new Paper( "Une pomme est mangée par moi.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with an irregular participle", function() {
		// Passive: est lu.
		const paper = new Paper( "Un libre est lu par moi.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with an irregular participle with a suffix", function() {
		// Passive: est vendue.
		const paper = new Paper( "Une voiture est vendue par moi.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with an irregular participle ending in -s", function() {
		// Passive: été promis.
		const paper = new Paper( "Il a été promis trois choses.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with an irregular participle ending in -s with suffix", function() {
		// Passive: été promise.
		const paper = new Paper( "Une réponse a été promise à maintes reprises.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with an irregular participle with an irregular conjugation pattern", function() {
		// Passive: est mû.
		const paper = new Paper( "Il est mû.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with an with an inverted auxiliary in a question", function() {
		// Passive: était-il informé.
		const paper = new Paper( "Le jury de thèse de Mme Randerson était-il informé de cela ?", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice with an irregular participle", function() {
		// Irregular participle: vendu.
		const paper = new Paper( "J'ai vendu.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with an irregular participle ending in -s.", function() {
		// Irregular participle: promis.
		const paper = new Paper( "J'ai promis.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with an irregular participle with irregular conjugation pattern.", function() {
		// Irregular participle: absous.
		const paper = new Paper( "Il a absous son karma.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with a passive auxiliary and non-passive participle from adjective/verb exception list.", function() {
		// Non-passive participle: allé.
		const paper = new Paper( "J'étais allé.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with a passive auxiliary and non-passive participle from adjective/verb exception list with suffix.", function() {
		// Non-passive participle with suffix: allée.
		const paper = new Paper( "J'étais allée.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with a passive auxiliary and non-passive é-word from adjective/verb exception list.", function() {
		// Non-passive é-word from adjective/verb exception list: aîné.
		const paper = new Paper( "Il est le frère aîné.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with a passive auxiliary and non-passive é-word from adjective/verb exception list plus suffix.", function() {
		// Non-passive é-word from adjective/verb exception list plus suffix: aînée.
		const paper = new Paper( "Elle est la sœur aînée.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with a passive auxiliary and non-passive é-word from noun exception list.", function() {
		// Non-passive é-word from noun exception list: café.
		const paper = new Paper( "J’étais au café.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with a passive auxiliary and non-passive é-word from noun exception list plus suffix.", function() {
		// Non-passive é-word from noun exception list plus suffix: cafés.
		const paper = new Paper( "Ce sont deux cafés sympas.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with a passive auxiliary and non-passive é-word from noun exception list plus contracted article.", function() {
		// Non-passive é-word from noun exception list plus contracted article: l’intégrité.
		const paper = new Paper( "Est-ce que la création de cet outil contribuera à améliorer l’intégrité scientifique ?", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with a passive auxiliary and a non-passive é-word from other exception list.", function() {
		// Non-passive é-word from other exception list: malgré.
		const paper = new Paper( "Elle est triste malgré tout.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with an être-auxiliary that's preceded by a reflexive pronoun.", function() {
		// Reflexive pronoun: se.
		const paper = new Paper( "Ils se sont lavés.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with an être-auxiliary that's followed by an article.", function() {
		// Exception word: "le" after "est".
		const paper = new Paper( "Cela est le film le plus vu.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with a participle that's marked as non-passive by a direct precedence exception.", function() {
		// Direct precedence exception word: en.
		const paper = new Paper( "Elle est en vue.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with a participle that's marked as non-passive by a precedence exception (indirectly preceding).", function() {
		// Precedence exception word: avoir (in between "n'est" and "vu").
		const paper = new Paper( "Il n’est pas possible de l’avoir déjà vu.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with a participle that's marked as non-passive by a precedence exception (directly preceding).", function() {
		// Precedence exception word: avoir (in between "n'est" and "vu").
		const paper = new Paper( "Il n’est pas nécessaire d’avoir vu le premier film.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with an être-auxiliary that's marked as non-passive by an elision precedence exception.", function() {
		// Elision precedence exception word: s'.
		const paper = new Paper( "Il s'est lavé.", { locale: "fr_FR" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );
} );
