import WordCombination from "../../src/values/WordCombination";
import relevantWords from "../../src/stringProcessing/relevantWords";
import polishFunctionWordsFactory from "../../src/researches/polish/functionWords.js";

const getRelevantWords = relevantWords.getRelevantWords;
const polishFunctionWords = polishFunctionWordsFactory();

describe( "gets Polish word combinations", function() {
	it( "returns word combinations", function() {
		const input = "W zasadzie każdy z nas wie, że gdy ktoś odczuwa ból w klatce piersiowej, to należy natychmiast" +
			" dzwonić po karetkę. W zasadzie każdy z nas wie, że gdy ktoś odczuwa ból w klatce piersiowej, to należy " +
			"natychmiast dzwonić po karetkę. W zasadzie każdy z nas wie, że gdy ktoś odczuwa ból w klatce piersiowej, " +
			"to należy natychmiast dzwonić po karetkę. W zasadzie każdy z nas wie, że gdy ktoś odczuwa ból w klatce " +
			"piersiowej, to należy natychmiast dzwonić po karetkę. W zasadzie każdy z nas wie, że gdy ktoś odczuwa ból w" +
			" klatce piersiowej, to należy natychmiast dzwonić po karetkę. W zasadzie każdy z nas wie, że gdy ktoś " +
			"odczuwa ból w klatce piersiowej, to należy natychmiast dzwonić po karetkę. W zasadzie każdy z nas wie, że " +
			"gdy ktoś odczuwa ból w klatce piersiowej, to należy natychmiast dzwonić po karetkę. W zasadzie każdy z nas" +
			" wie, że gdy ktoś odczuwa ból w klatce piersiowej, to należy natychmiast dzwonić po karetkę.";


		const expected = [
			new WordCombination( [ "odczuwa", "ból", "w", "klatce", "piersiowej" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "natychmiast", "dzwonić", "po", "karetkę" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "ból", "w", "klatce", "piersiowej" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "odczuwa", "ból", "w", "klatce" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "dzwonić", "po", "karetkę" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "ból", "w", "klatce" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "odczuwa", "ból" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "natychmiast", "dzwonić" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "klatce", "piersiowej" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "wie" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "karetkę" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "dzwonić" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "natychmiast" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "piersiowej" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "klatce" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "ból" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "odczuwa" ], 8, polishFunctionWords.all ),
			new WordCombination( [ "zasadzie" ], 8, polishFunctionWords.all ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = getRelevantWords( input, "pl", polishFunctionWords );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );
