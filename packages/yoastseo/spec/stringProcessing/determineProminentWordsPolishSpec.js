import ProminentWord from "../../src/values/ProminentWord";
import { getRelevantWords } from "../../src/stringProcessing/determineProminentWords";

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
			new ProminentWord( "ból", "ból", 8 ),
			new ProminentWord( "dzwonić", "dzwonić", 8 ),
			new ProminentWord( "karetkę", "karetkę", 8 ),
			new ProminentWord( "klatce", "klatce", 8 ),
			new ProminentWord( "natychmiast", "natychmiast", 8 ),
			new ProminentWord( "odczuwa", "odczuwa", 8 ),
			new ProminentWord( "piersiowej", "piersiowej", 8 ),
			new ProminentWord( "wie", "wie", 8 ),
			new ProminentWord( "zasadzie", "zasadzie", 8 ),
		];

		const words = getRelevantWords( input, [], "pl", false );

		expect( words ).toEqual( expected );
	} );
} );
