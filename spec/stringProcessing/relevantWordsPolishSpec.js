let WordCombination = require( "../../js/values/WordCombination" );
let relevantWords = require( "../../js/stringProcessing/relevantWords" );
let getRelevantWords = relevantWords.getRelevantWords;
let polishFunctionWords = require( "../../js/researches/polish/functionWords.js" )().all;

describe( "gets Polish word combinations", function() {
	it( "returns word combinations", function() {
		let input = "W zasadzie każdy z nas wie, że gdy ktoś odczuwa ból w klatce piersiowej, to należy natychmiast" +
			" dzwonić po karetkę. W zasadzie każdy z nas wie, że gdy ktoś odczuwa ból w klatce piersiowej, to należy " +
			"natychmiast dzwonić po karetkę. W zasadzie każdy z nas wie, że gdy ktoś odczuwa ból w klatce piersiowej, " +
			"to należy natychmiast dzwonić po karetkę. W zasadzie każdy z nas wie, że gdy ktoś odczuwa ból w klatce " +
			"piersiowej, to należy natychmiast dzwonić po karetkę. W zasadzie każdy z nas wie, że gdy ktoś odczuwa ból w" +
			" klatce piersiowej, to należy natychmiast dzwonić po karetkę. W zasadzie każdy z nas wie, że gdy ktoś " +
			"odczuwa ból w klatce piersiowej, to należy natychmiast dzwonić po karetkę. W zasadzie każdy z nas wie, że " +
			"gdy ktoś odczuwa ból w klatce piersiowej, to należy natychmiast dzwonić po karetkę. W zasadzie każdy z nas" +
			" wie, że gdy ktoś odczuwa ból w klatce piersiowej, to należy natychmiast dzwonić po karetkę.";


		let expected = [
			new WordCombination( [ "odczuwa", "ból", "w", "klatce", "piersiowej" ], 8, polishFunctionWords ),
			new WordCombination( [ "natychmiast", "dzwonić", "po", "karetkę" ], 8, polishFunctionWords ),
			new WordCombination( [ "ból", "w", "klatce", "piersiowej" ], 8, polishFunctionWords ),
			new WordCombination( [ "odczuwa", "ból", "w", "klatce" ], 8, polishFunctionWords ),
			new WordCombination( [ "dzwonić", "po", "karetkę" ], 8, polishFunctionWords ),
			new WordCombination( [ "ból", "w", "klatce" ], 8, polishFunctionWords ),
			new WordCombination( [ "odczuwa", "ból" ], 8, polishFunctionWords ),
			new WordCombination( [ "natychmiast", "dzwonić" ], 8, polishFunctionWords ),
			new WordCombination( [ "klatce", "piersiowej" ], 8, polishFunctionWords ),
			new WordCombination( [ "wie" ], 8, polishFunctionWords ),
			new WordCombination( [ "karetkę" ], 8, polishFunctionWords ),
			new WordCombination( [ "dzwonić" ], 8, polishFunctionWords ),
			new WordCombination( [ "natychmiast" ], 8, polishFunctionWords ),
			new WordCombination( [ "piersiowej" ], 8, polishFunctionWords ),
			new WordCombination( [ "klatce" ], 8, polishFunctionWords ),
			new WordCombination( [ "ból" ], 8, polishFunctionWords ),
			new WordCombination( [ "odczuwa" ], 8, polishFunctionWords ),
			new WordCombination( [ "zasadzie" ], 8, polishFunctionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		let words = getRelevantWords( input, "pl_PL" );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );
