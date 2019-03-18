import { generateRegularVerbForms } from "../../../src/morphology/german/generateRegularVerbForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataDE = getMorphologyData( "de" ).de;

describe( "Test for getting the right verb suffixes depending on the stem ending", () => {
	it( "adds all verb suffixes for a verb that doesn't fall into any of the modification categories", () => {
		expect( generateRegularVerbForms( morphologyDataDE.verbs, "kauf" ) ).toEqual( [
			"kaufe",
			"kauft",
			"kaufst",
			"kaufen",
			"kaufest",
			"kaufet",
			"kaufte",
			"kauftet",
			"kauften",
			"kauftest",
			"kaufete",
			"kaufetet",
			"kaufeten",
			"kaufetest",
			"kaufend",
			"gekauft",
		] );
	} );
} );
