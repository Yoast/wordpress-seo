import WordCombination from "../../src/values/WordCombination";
import relevantWords from "../../src/stringProcessing/relevantWords";
import dutchFunctionWordsFactory from "../../src/researches/dutch/functionWords.js";
const getRelevantWords = relevantWords.getRelevantWords;
const dutchFunctionWords = dutchFunctionWordsFactory();

describe( "gets Dutch word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn" +
			" heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen" +
			" met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden." +
			" Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel" +
			" veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel" +
			" veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit" +
			" zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel" +
			" zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel" +
			" veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden." +
			" Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden.";
		const expected = [
			new WordCombination( [ "zinnen", "met", "heel", "veel", "woorden" ], 23, dutchFunctionWords.all ),
			new WordCombination( [ "zinnen" ], 23, dutchFunctionWords.all ),
			new WordCombination( [ "woorden" ], 23, dutchFunctionWords.all ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = getRelevantWords( input, "nl", dutchFunctionWords );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );

