import ProminentWord from "../../src/values/ProminentWord";
import { getProminentWords } from "../../src/languages/legacy/stringProcessing/determineProminentWords";

describe( "gets Swedish prominent words", function() {
	it( "returns prominent words", function() {
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

		const words = getProminentWords( input, [], "sv", false );

		expect( words ).toEqual( expected );
	} );
} );
