import { detectAndStemRegularParticiple } from "../../../../../../src/languageProcessing/languages/de/helpers/internal/detectAndStemRegularParticiple";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";


const morphologyDataDE = getMorphologyData( "de" ).de;

describe( "Detects and stems participles", () => {
	it( "doesn't incorrectly detect a participle if the word is on the participle exception list", () => {
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "gebirgsart" ) ).toEqual( "" );
	} );

	it( "doesn't incorrectly detect a participle if the word is matched by the participle exception regex", () => {
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "gewerkschaft" ) ).toEqual( "" );
	} );

	it( "detects a participle and stems it; input: ge-stem-t participle", () => {
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "gekauft" ) ).toEqual( "kauf" );
	} );

	it( "detects a participle and stems it; input: ge-stem-et participle", () => {
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "gebildet" ) ).toEqual( "bild" );
	} );

	it( "detects a participle and stems it; input: separablePrefix-ge-stem-t participle", () => {
		// Separable prefix: herauf.
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "heraufgeholt" ) ).toEqual( "heraufhol" );
	} );

	it( "detects a participle and stems it; input: separablePrefix-ge-stem-et participle", () => {
		// Separable prefix: weiter.
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "weitergebildet" ) ).toEqual( "weiterbild" );
	} );

	it( "detects a participle and stems it; input: inseparablePrefix-stem-t/sst participle", () => {
		// Inseparable prefix: er.
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "ertappt" ) ).toEqual( "ertapp" );
	} );

	it( "detects a participle and stems it; input: inseparablePrefix-stem-t/sst participle", () => {
		// Inseparable prefix: er.
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "erfasst" ) ).toEqual( "erfass" );
	} );

	it( "detects a participle and stems it; input: inseparablePrefix-stem-et participle", () => {
		// Inseparable prefix: be.
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "bewertet" ) ).toEqual( "bewert" );
	} );

	it( "detects a participle and stems it; input: separableOrInseparablePrefix-ge-stem-t participle", () => {
		// Inseparable/separable prefix: durch.
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "durchgemacht" ) ).toEqual( "durchmach" );
	} );

	it( "detects a participle and stems it; input: separableOrInseparablePrefix-ge-stem-et participle", () => {
		// Inseparable/separable prefix: durch.
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "durchgearbeitet" ) ).toEqual( "durcharbeit" );
	} );

	it( "detects a participle and stems it; input: separableOrInseparablePrefix-stem-t/sst participle", () => {
		// Inseparable/separable prefix: über.
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "überführt" ) ).toEqual( "überführ" );
	} );

	it( "detects a participle and stems it; input: separableOrInseparablePrefix-stem-t/sst participle", () => {
		// Inseparable/separable prefix: um.
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "umfasst" ) ).toEqual( "umfass" );
	} );

	it( "detects a participle and stems it; input: separableOrInseparablePrefix-stem-et participle", () => {
		// Inseparable/separable prefix: durch.
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "durchlüftet" ) ).toEqual( "durchlüft" );
	} );

	it( "returns null if the word is not detected as a participle", () => {
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "apfel" ) ).toEqual( null );
	} );
} );
