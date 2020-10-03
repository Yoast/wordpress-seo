import ProminentWord from "../../src/values/ProminentWord";
import { getProminentWords, filterProminentWords } from "../../src/stringProcessing/helpers/_todo/determineProminentWords";

describe( "gets French prominent words", function() {
	it( "returns prominent words", function() {
		const input = "Mercredi, un texte issu de la rencontre, la veille, entre le président français Emmanuel Macron" +
			"et la première ministre britannique Theresa May présentait des axes de travail pour lutter contre le terrorisme" +
			" sur Internet, évoquant, sans les nommer, les grands réseaux sociaux. Vingt-quatre heures plus tard seulement," +
			" la publication sur Facebook d’un long texte présentant une liste des dispositions – certaines nouvelles, la plupart" +
			" déjà connues – apparaît comme une réponse aux propositions formulées par les deux dirigeants, même" +
			" si le réseau social explique que sa communication était prévue depuis longtemps. Dans ce document," +
			" Facebook annonce notamment utiliser des technologies d’intelligence artificielle (IA) pour repérer" +
			" les contenus faisant l’apologie du terrorisme – une possibilité que Mark Zuckerberg, le fondateur de" +
			" l’entreprise, avait déjà évoquée. Elle est désormais effective, explique au Monde, par visioconférence," +
			" Brian Fishman, chargé de la lutte contre le terrorisme à Facebook :";
		const expected = [
			new ProminentWord( "facebook", "facebook", 3 ),
			new ProminentWord( "terrorisme", "terrorisme", 3 ),
			new ProminentWord( "texte", "texte", 2 ),
		];

		const words = filterProminentWords( getProminentWords( input, [ "IA" ], "fr", false ) );

		expect( words ).toEqual( expected );
	} );
} );
