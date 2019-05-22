import ProminentWord from "../../src/values/ProminentWord";
import { getProminentWords } from "../../src/stringProcessing/determineProminentWords";

describe( "gets Portuguese prominent words", function() {
	it( "returns prominent words", function() {
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
			new ProminentWord( "autoridades", "autoridades", 8 ),
			new ProminentWord( "crime", "crime", 8 ),
			new ProminentWord( "denunciar", "denunciar", 8 ),
			new ProminentWord( "incidentes", "incidentes", 8 ),
			new ProminentWord( "números", "números", 8 ),
			new ProminentWord( "oficiais", "oficiais", 8 ),
			new ProminentWord( "pararam", "pararam", 8 ),
			new ProminentWord( "sugerem", "sugerem", 8 ),
			new ProminentWord( "vítimas", "vítimas", 8 ),
		];

		const words = getProminentWords( input, [], "pt", false );

		expect( words ).toEqual( expected );
	} );
} );

