let WordCombination = require( "../../src/values/WordCombination" );
let relevantWords = require( "../../src/stringProcessing/relevantWords" );
let getRelevantWords = relevantWords.getRelevantWords;
let portugueseFunctionWords = require( "../../src/researches/portuguese/functionWords.js" )().all;

describe( "gets Portuguese word combinations", function() {
	it( "returns word combinations", function() {
		let input = "Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. ";
		let expected = [
			new WordCombination( [ "vítimas", "pararam", "de", "denunciar", "incidentes" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "pararam", "de", "denunciar", "incidentes" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "vítimas", "pararam", "de", "denunciar" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "números", "oficiais", "sugerem" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "pararam", "de", "denunciar" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "números", "oficiais" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "denunciar", "incidentes" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "vítimas", "pararam" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "oficiais", "sugerem" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "oficiais" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "incidentes" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "denunciar" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "pararam" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "vítimas" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "autoridades" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "crime" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "sugerem" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "números" ], 8, portugueseFunctionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		let words = getRelevantWords( input, "pt_PT" );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );

