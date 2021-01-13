import Researcher from "../../../../src/languageProcessing/languages/es/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataES = getMorphologyData( "es" );

describe( "a test for the Spanish Researcher", function() {
	const researcher = new Researcher( new Paper( "Este es un documento nuevo!" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the English Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoice" ) ).toBe( true );
	} );

	it( "returns the Spanish function words filtered at the end", function() {
		expect( researcher.getConfig( "functionWords" ).filteredAtEnding ).toEqual(
			[ "primera", "segunda", "tercera", "cuarto", "cuarta", "quinto", "quinta", "sexto", "sexta", "septimo", "septima",
				"octavo", "octava", "noveno", "novena", "décimo", "décima", "vigésimo", "vigésima", "primeros", "primeras",
				"segundos", "segundas", "terceros", "terceras", "cuartos", "cuartas", "quintos", "quintas", "sextos", "sextas",
				"septimos", "septimas", "octavos", "octavas", "novenos", "novenas", "décimos", "décimas", "vigésimos", "vigésimas",
				"haber", "deber", "empezar", "comenzar", "seguir", "tener", "andar", "quedar", "hallar", "venir", "abrir", "ir",
				"acabar", "llevar", "alcanzar", "decir", "continuar", "resultar", "poder", "querer", "saber", "soler", "necesitar",
				"estar", "ser", "hacer", "parecer", "ir" ]
		);
	} );

	it( "returns the Spanish first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" )() ).toEqual(
			[ "el", "los", "la", "las", "un", "una", "unas", "unos", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho",
				"nueve", "diez", "este", "estos", "esta", "estas", "ese", "esos", "esa", "esas", "aquel", "aquellos", "aquella",
				"aquellas", "esto", "eso", "aquello" ]
		);
	} );

	it( "returns the singleWords Spanish transition words", function() {
		expect( researcher.getConfig( "transitionWords" )().singleWords ).toEqual(
			[ "además", "adicional", "así", "asimismo", "aún", "aunque", "ciertamente", "como", "concluyendo", "conque", "contrariamente",
				"cuando", "decididamente", "decisivamente", "después", "diferentemente", "efectivamente", "entonces",
				"especialmente", "específicamente", "eventualmente", "evidentemente", "finalmente", "frecuentemente",
				"generalmente", "igualmente", "lógicamente", "luego", "mas", "mientras",
				"pero", "por", "porque", "posteriormente", "primero", "principalmente", "pronto", "próximamente", "pues", "raramente", "realmente",
				"seguidamente",	"segundo", "semejantemente", "si", "siguiente", "sino", "súbitamente", "supongamos",  "también", "tampoco", "tercero",
				"verbigracia", "vice-versa", "ya" ]
		);
	} );

	it( "returns the Spanish two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" )() ).toEqual(
			[ [ "de un lado", "de otra parte" ], [ "de un lado", "de otro" ], [ "no", "sino que" ], [ "no", "sino" ],
				[ "por un lado", "por otro lado" ], [ "por una parte", "por otra parte" ], [ "por una parte", "por otra" ],
				[ "tanto", "como" ], [ "bien", "bien" ] ]
		);
	} );

	it( "returns a specified part of the Spanish syllables data", function() {
		expect( researcher.getConfig( "syllables" ).deviations.words.full ).toEqual(
			[
				{
					word: "scooter",
					syllables: 2,
				},
				{
					word: "y",
					syllables: 1,
				},
				{
					word: "beat",
					syllables: 1,
				},
				{
					word: "via",
					syllables: 2,
				},
				{
					word: "ok",
					syllables: 2,
				},
			]
		);
	} );

	it( "returns the Spanish stop words", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual(
			[
				"pero",
				"ora",
				"aunque",
				"aun",
				"mientras",
				"porque",
				"apenas",
				"si",
				"antes",
				"después",
				"cómo",
				"como",
				"empero",
				"que",
				"cuanto",
				"cuando",
				"cual",
				"cuales",
				"quién",
				"quien",
				"quienes",
				"dónde",
				"adónde",
				"cuyo",
				"cuyos",
				"cuya",
				"cuyas",
			]
		);
	} );

	it( "returns the Spanish locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "es" );
	} );

	it( "returns the Spanish passive construction type", function() {
		expect( researcher.getConfig( "isPeriphrastic" ) ).toEqual( true );
	} );

	it( "stems a word using the Spanish stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataES );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "gatos" ) ).toEqual( "gat" );
	} );

	it( "splits Spanish sentence into parts", function() {
		const sentence = "Ellos eran tres amigos cuando los conocí.";
		expect( researcher.getHelper( "getSentenceParts" )( sentence )[ 0 ].getSentencePartText() ).toBe( "eran tres amigos" );
	} );

	it( "checks if a Spanish sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentencePart" )( "Una manzana será comida por mí.", [ "será" ] ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentencePart" )( "Yo comeré una manzana.", [] ) ).toEqual( false );
	} );

	it( "calculates the Flesch reading score using the formula for Spanish", function() {
		const statistics = {
			numberOfWords: 1000,
			numberOfSentences: 100,
			syllablesPer100Words: 250,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( statistics ) ).toBe( 46.6 );
	} );
} );
