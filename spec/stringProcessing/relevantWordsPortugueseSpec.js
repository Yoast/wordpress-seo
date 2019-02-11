import WordCombination from "../../src/values/WordCombination";
import relevantWords from "../../src/stringProcessing/relevantWords";
import portugueseFunctionWordsFactory from "../../src/researches/portuguese/functionWords.js";

const getRelevantWords = relevantWords.getRelevantWords;
const portugueseFunctionWords = portugueseFunctionWordsFactory();

describe( "gets Portuguese word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
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
		const expected = [
			new WordCombination( [ "vítimas", "pararam", "de", "denunciar", "incidentes" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "pararam", "de", "denunciar", "incidentes" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "vítimas", "pararam", "de", "denunciar" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "números", "oficiais", "sugerem" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "pararam", "de", "denunciar" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "números", "oficiais" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "denunciar", "incidentes" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "vítimas", "pararam" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "oficiais", "sugerem" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "oficiais" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "incidentes" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "denunciar" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "pararam" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "vítimas" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "autoridades" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "crime" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "sugerem" ], 8, portugueseFunctionWords.all ),
			new WordCombination( [ "números" ], 8, portugueseFunctionWords.all ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = getRelevantWords( input, "pt", portugueseFunctionWords );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );

