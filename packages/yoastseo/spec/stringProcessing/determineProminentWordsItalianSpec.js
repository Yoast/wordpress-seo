import ProminentWord from "../../src/values/ProminentWord";
import { getRelevantWords } from "../../src/stringProcessing/determineProminentWords";

describe( "gets Italian word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta.";
		const expected = [
			new ProminentWord( "caltanissetta", "caltanissetta", 11 ),
			new ProminentWord( "dell'inchiesta", "dell'inchiesta", 11 ),
			new ProminentWord( "elezioni", "elezioni", 11 ),
			new ProminentWord( "procura", "procura", 11 ),
		];

		const words = getRelevantWords( input, [], "it", false );

		expect( words ).toEqual( expected );
	} );
} );

