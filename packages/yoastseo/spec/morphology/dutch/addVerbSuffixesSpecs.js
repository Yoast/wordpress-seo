import { addVerbSuffixes} from "../../../src/morphology/dutch/addVerbSuffixes";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Test for getting the right verb suffixes depending on the stem ending", () => {
	it( "adds all verb suffixes for a stem that does not take the -te and -ten suffixes", () => {
		expect( addVerbSuffixes( "grond", morphologyDataNL) ).toEqual( [
			"grondt",
			"grondde",
			"grondden",
			"gronden",
			"grondend",
		] );
	} );
	it( "adds all verb suffixes for a stem that does not take the -t, -de and -den suffixes", () => {
		expect( addVerbSuffixes( "muit", morphologyDataNL) ).toEqual( [
			"muitte",
			"muitten",
			"muiten",
			"muitend",
		] );
	} );
	it( "adds all verb suffixes for a stem that does not take the -de and -den suffixes", () => {
		expect( addVerbSuffixes( "deuk", morphologyDataNL) ).toEqual( [
			"deukt",
			"deukte",
			"deukten",
			"deuken",
			"deukend"
		] );
	} );
	it( "adds all verb suffixes for a stem that needs the final consonant doubled before adding the -en and -end suffixes", () => {
		expect( addVerbSuffixes( "zwik", morphologyDataNL) ).toEqual( [
			"zwikt",
			"zwikte",
			"zwikten",
			"zwikken",
			"zwikkend"
		] );
	} );
	it( "adds all verb suffixes for a stem that needs the final consonant voiced before adding the -en and -end suffixes", () => {
		expect( addVerbSuffixes( "grief", morphologyDataNL) ).toEqual( [
			"grieft",
			"griefte",
			"grieften",
			"grieven",
			"grievend"
		] );
	} );
	it( "adds all verb suffixes for a stem that should NOT have the consonant voiced before adding the -en and -end suffixes", () => {
		expect( addVerbSuffixes( "heers", morphologyDataNL) ).toEqual( [
			"heerst",
			"heerste",
			"heersten",
			"heersen",
			"heersend"
		] );
	} );
	it( "adds all verb suffixes for a stem that should have a vowel undoubled before adding the -en and -end suffixes", () => {
		expect( addVerbSuffixes( "blaat", morphologyDataNL) ).toEqual( [
			"blaatte",
			"blaatten",
			"blaten",
			"blatend",
		] );
	} );
	it( "return an empty array for a stem that has a non-verb ending", () => {
		expect( addVerbSuffixes( "bakkerij", morphologyDataNL) ).toEqual( [] );
	} );
} );
