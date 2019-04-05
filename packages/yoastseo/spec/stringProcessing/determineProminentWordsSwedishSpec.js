import ProminentWord from "../../src/values/ProminentWord";
import { getRelevantWords } from "../../src/stringProcessing/determineProminentWords";

describe( "gets Swedish word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Det vanligaste sättet för katten att kommunicera med människor är att jama. Det vanligaste sättet" +
			" för katten att kommunicera med människor är att jama. Det vanligaste sättet för katten att kommunicera med " +
			"människor är att jama. Det vanligaste sättet för katten att kommunicera med människor är att jama. Det vanligaste " +
			"sättet för katten att kommunicera med människor är att jama. Det vanligaste sättet för katten att kommunicera " +
			"med människor är att jama. Det vanligaste sättet för katten att kommunicera med människor är att jama. Det " +
			"vanligaste sättet för katten att kommunicera med människor är att jama.";


		const expected = [
			new ProminentWord( "jama", "jama", 8 ),
			new ProminentWord( "katten", "katten", 8 ),
			new ProminentWord( "kommunicera", "kommunicera", 8 ),
			new ProminentWord( "människor", "människor", 8 ),
			new ProminentWord( "vanligaste", "vanligaste", 8 ),
		];

		const words = getRelevantWords( input, [], "sv", false );

		expect( words ).toEqual( expected );
	} );
} );
