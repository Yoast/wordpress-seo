import { detectAndStemRegularParticiple } from "../../../src/morphology/german/detectAndStemRegularParticiple";
import getMorphologyData from "../../specHelpers/getMorphologyData";


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

	it( "detects a participle and stems it; input:separablePrefix-ge-stem-t participle", () => {
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "heraufgeholt" ) ).toEqual( "heraufhol" );
	} );

	it( "detects a participle and stems it; input:separablePrefix-ge-stem-et participle", () => {
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "weitergebildet" ) ).toEqual( "weiterbild" );
	} );

	it( "detects a participle and stems it; input:inseparablePrefix-stem-t/sst participle", () => {
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "ertappt" ) ).toEqual( "ertapp" );
	} );

	it( "detects a participle and stems it; input:inseparablePrefix-stem-t/sst participle", () => {
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "erfasst" ) ).toEqual( "erfass" );
	} );

	it( "detects a participle and stems it; input:inseparablePrefix-stem-et participle", () => {
		expect( detectAndStemRegularParticiple( morphologyDataDE.verbs, "bewertet" ) ).toEqual( "bewert" );
	} );
} );
