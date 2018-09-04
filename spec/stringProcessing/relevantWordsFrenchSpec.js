let WordCombination = require( "../../src/values/WordCombination" );
let relevantWords = require( "../../src/stringProcessing/relevantWords" );
let getRelevantWords = relevantWords.getRelevantWords;
let frenchFunctionWords = require( "../../src/researches/french/functionWords.js" )().all;

describe( "gets French word combinations", function() {
	it( "returns word combinations", function() {
		let input = "Mercredi, un texte issu de la rencontre, la veille, entre le président français Emmanuel Macron" +
			"et la première ministre britannique Theresa May présentait des axes de travail pour lutter contre le terrorisme" +
			" sur Internet, évoquant, sans les nommer, les grands réseaux sociaux. Vingt-quatre heures plus tard seulement," +
			" la publication sur Facebook d’un long texte présentant une liste des dispositions – certaines nouvelles, la plupart" +
			" déjà connues – apparaît comme une réponse aux propositions formulées par les deux dirigeants, même" +
			" si le réseau social explique que sa communication était prévue depuis longtemps. Dans ce document," +
			" Facebook annonce notamment utiliser des technologies d’intelligence artificielle (IA) pour repérer" +
			" les contenus faisant l’apologie du terrorisme – une possibilité que Mark Zuckerberg, le fondateur de" +
			" l’entreprise, avait déjà évoquée. Elle est désormais effective, explique au Monde, par visioconférence," +
			" Brian Fishman, chargé de la lutte contre le terrorisme à Facebook :";
		let expected = [
			new WordCombination( [ "terrorisme" ], 3, frenchFunctionWords ),
			new WordCombination( [ "facebook" ], 3, frenchFunctionWords ),
			new WordCombination( [ "texte" ], 2, frenchFunctionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		let words = getRelevantWords( input, "fr_FR" );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );
