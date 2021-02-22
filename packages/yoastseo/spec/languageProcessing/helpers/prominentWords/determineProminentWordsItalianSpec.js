import ProminentWord from "../../../../src/values/ProminentWord";
import { getProminentWords } from "../../../../src/languageProcessing/helpers/prominentWords/determineProminentWords";
import Researcher from "../../../../src/languageProcessing/languages/it/Researcher";

const researcher = new Researcher();

describe( "gets Italian prominent words", function() {
	it( "returns prominent words", function() {
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

		const words = getProminentWords( input, [], researcher.getHelper( "getStemmer" )( researcher ),
			researcher.getConfig( "functionWords" ) );

		expect( words ).toEqual( expected );
	} );
} );

