import WordCombination from "../../src/values/WordCombination";
import { getRelevantWords } from "../../src/stringProcessing/relevantWords";

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
			new WordCombination( "autoridades", "autoridades", 8 ),
			new WordCombination( "crime", "crime", 8 ),
			new WordCombination( "denunciar", "denunciar", 8 ),
			new WordCombination( "incidentes", "incidentes", 8 ),
			new WordCombination( "números", "números", 8 ),
			new WordCombination( "oficiais", "oficiais", 8 ),
			new WordCombination( "pararam", "pararam", 8 ),
			new WordCombination( "sugerem", "sugerem", 8 ),
			new WordCombination( "vítimas", "vítimas", 8 ),
		];

		const words = getRelevantWords( input, "pt", false );

		expect( words ).toEqual( expected );
	} );
} );

