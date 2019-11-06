import {
	generateVerbExceptionForms,
} from "../../../src/morphology/dutch/generateVerbExceptionForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataNL = getMorphologyData( "nl" ).nl;


describe( "Test for generating verb exceptions in Dutch", () => {
	it( "creates the verb forms of strong verbs which have regular past form and receive suffix -en in participle form", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "laad" ) ).toEqual( [
			"laad",
			"laadt",
			"laadde",
			"laadden",
			"laden",
			"ladend",
			"geladen",
		]
		);
	} );
	it( "creates the verb forms of strong verbs which have regular past form and have two past participle forms", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "brouw" ) ).toEqual( [
			"brouw",
			"brouwt",
			"brouwde",
			"brouwden",
			"brouwen",
			"brouwend",
			"gebrouwen",
			"gebrouwd",
		]
		);
	} );
	it( "creates the verb forms of strong verbs which have irregular past form and receive suffix -en in participle form", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "blijf" ) ).toEqual( [
			"bleven",
			"bleef",
			"blijf",
			"blijven",
			"blijvend",
			"blijft",
			"gebleven",
		]
		);
	} );
	it( "creates the verb forms of strong verbs which have irregular past form" +
		"and whose past participle is the same with simple past plural form", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "begin" ) ).toEqual( [
			"begonnen",
			"begon",
			"begin",
			"beginnen",
			"beginnend",
			"begint",
		]
		);
	} );
	it( "creates the verb forms of strong verbs in which their past form do not need to double their last consonant before attaching -en", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "zat" ) ).toEqual( [
			"zaten",
			"zat",
			"zit",
			"zitten",
			"zittend",
			"gezeten",
		]
		);
	} );
	it( "creates the verb forms of strong verbs in which their past form do not need to double their last consonant before attaching -en", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "steek" ) ).toEqual( [
			"staken",
			"stak",
			"steek",
			"steken",
			"stekend",
			"steekt",
			"gestoken",
		]
		);
	} );
	it( "creates the verb forms of strong verbs which have both regular and irregular past form and receive suffix -en in participle form", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "schep" ) ).toEqual( [
			"schep",
			"schept",
			"schepte",
			"schepten",
			"scheppen",
			"scheppend",
			"schiep",
			"schiepen",
			"geschapen",
		]
		);
	} );
	it( "creates the verb forms of strong verbs which have both regular and irregular past form" +
		"and whose past participle is the same with simple present plural form", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "verraad" ) ).toEqual( [
			"verraad",
			"verraadt",
			"verraadde",
			"verraadden",
			"verraden",
			"verradend",
			"verried",
			"verrieden",
		]
		);
	} );
	it( "creates the compound verb forms of irregular strong verbs", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "doorslaap" ) ).toEqual( [
			"doorsliepen",
			"doorsliep",
			"doorslaap",
			"doorslapen",
			"doorslapend",
			"doorslaapt",
			"doorgeslapen",
		]
		);
	} );
	it( "return an empty array for verbs that are not in the exception list", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "maak" ) ).toEqual( []
		);
	} );
} );

