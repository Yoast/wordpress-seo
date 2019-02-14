import { de as morphologyDataDE } from "../../../premium-configuration/data/morphologyData.json";
import { generateVerbExceptionForms } from "../../../src/morphology/german/generateVerbExceptionForms";

describe( "Test for generating adjective exceptions in German", () => {
	it( "creates forms for a strong verb of class 1", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schweig" ) ).toEqual( [
			"schweig",
			"schwieg",
			"schweige",
			"schweigen",
			"schweigend",
			"schweigest",
			"schweiget",
			"schweigst",
			"schweigt",
			"schwiege",
			"schwiegen",
			"schwiegest",
			"schwieget",
			"schwiegst",
			"schwiegt",
			"geschwiegen",
		] );
	} );
} );
