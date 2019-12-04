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
	it( "creates the verb forms of strong verbs which have regular past form and have two past participle forms (-en and -d)", () => {
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
			"blijf",
			"blijven",
			"blijvend",
			"blijft",
			"bleef",
			"bleven",
			"gebleven",
		]
		);
	} );
	it( "creates the verb forms of strong verbs which have irregular past form and receive suffix -en in participle form", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "geholp" ) ).toEqual( [
			"help",
			"helpen",
			"helpend",
			"helpt",
			"hielp",
			"hielpen",
			"geholpen",
		]
		);
	} );
	it( "creates the verb forms of strong verbs which have irregular past form and receive suffix -t or -d in participle form", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "zoek" ) ).toEqual( [
			"zoek",
			"zoeken",
			"zoekend",
			"zoekt",
			"zocht",
			"zochten",
			"gezocht",
		]
		);
	} );
	it( "creates the verb forms of strong verbs which have irregular past form" +
		" and whose past participle is the same with simple past plural form", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "begin" ) ).toEqual( [
			"begin",
			"beginnen",
			"beginnend",
			"begint",
			"begon",
			"begonnen",
		]
		);
	} );
	it( "creates the verb forms of strong verbs which have irregular past form" +
		" and whose past participle is the same with simple past plural form", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "bedroog" ) ).toEqual( [
			"bedrieg",
			"bedriegen",
			"bedriegend",
			"bedriegt",
			"bedroog",
			"bedrogen",
		]
		);
	} );
	it( "creates the verb forms of strong verbs in which their past form do not need to double their last consonant before attaching -en", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "zat" ) ).toEqual( [
			"zit",
			"zitten",
			"zittend",
			"zat",
			"zaten",
			"gezeten",
		]
		);
	} );
	it( "creates the verb forms of strong verbs in which their past form do not need to double their last consonant before attaching -en", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "steek" ) ).toEqual( [
			"steek",
			"steken",
			"stekend",
			"steekt",
			"stak",
			"staken",
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
	it( "creates the verb forms of strong verbs which have both regular and irregular past form and receive suffix -en in participle form", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "berst" ) ).toEqual( [
			"berst",
			"berstte",
			"berstten",
			"bersten",
			"berstend",
			"borst",
			"borsten",
			"geborsten",
		]
		);
	} );
	it( "creates the verb forms of strong verbs which have both regular and irregular past form" +
		" and receive suffix -en and -d or -t in participle form", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "zeik" ) ).toEqual( [
			"zeik",
			"zeikt",
			"zeikte",
			"zeikten",
			"zeiken",
			"zeikend",
			"zeek",
			"zeken",
			"gezeken",
			"gezeikt",
		]
		);
	} );
	it( "creates the verb forms of strong verbs which have both regular and irregular past form" +
		" and whose past participle is the same with simple present plural form", () => {
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
	it( "creates the separable compound verb forms of irregular strong verbs", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "doorslaap" ) ).toEqual( [
			"doorslaap",
			"doorslapen",
			"doorslapend",
			"doorslaapt",
			"doorsliep",
			"doorsliepen",
			"doorgeslapen",
		]
		);
	} );
	it( "creates the inseparable compound verb forms of irregular strong verbs", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "behang" ) ).toEqual( [
			"behang",
			"behangen",
			"behangend",
			"behangt",
			"behing",
			"behingen",
			"begehangen",
		]
		);
	} );
	it( "return an empty array for verbs that are not in the exception list", () => {
		expect( generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, "maak" ) ).toEqual( []
		);
	} );
} );

