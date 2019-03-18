import WordCombination from "../../src/values/WordCombination";
import { getRelevantWords } from "../../src/stringProcessing/relevantWords";

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
			new WordCombination( "ból", "ból", 8 ),
			new WordCombination( "dzwonić", "dzwonić", 8 ),
			new WordCombination( "karetkę", "karetkę", 8 ),
			new WordCombination( "klatce", "klatce", 8 ),
			new WordCombination( "natychmiast", "natychmiast", 8 ),
			new WordCombination( "odczuwa", "odczuwa", 8 ),
			new WordCombination( "piersiowej", "piersiowej", 8 ),
			new WordCombination( "wie", "wie", 8 ),
			new WordCombination( "zasadzie", "zasadzie", 8 ),
		];

		const words = getRelevantWords( input, "pl", false );

		expect( words ).toEqual( expected );
	} );
} );
