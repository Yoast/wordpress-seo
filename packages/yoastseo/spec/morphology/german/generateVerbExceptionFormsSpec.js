import { generateVerbExceptionForms } from "../../../src/morphology/german/generateVerbExceptionForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataDE = getMorphologyData( "de" ).de;

describe( "Test for generating verb exceptions in German", () => {
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

	it( "creates forms for a strong verb of class 1; same result with past stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schweig" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "schwieg" )	);
	} );

	it( "creates forms for a strong verb of class 1; same results with past participle stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schweig" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "geschwieg" )	);
	} );

	it( "creates forms for a strong verb of class 2; same result with past stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "genieß" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "genoss" ) );
	} );

	it( "creates forms for a strong verb of class 2; same result with past subjunctive stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "genieß" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "genöss" ) );
	} );

	it( "creates forms for a strong verb of class 2; same result with past participle stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "genieß" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "genoss" ) );
	} );

	it( "creates forms for a strong verb of class 3", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "berg" ) ).toEqual( [
			"berg",
			"barg",
			"berge",
			"bergen",
			"bergend",
			"bergest",
			"berget",
			"bergst",
			"bergt",
			"birgst",
			"birgt",
			"bargen",
			"bargest",
			"barget",
			"bargst",
			"bargt",
			"bärge",
			"bärgest",
			"bärget",
			"bärgen",
			"geborgen",
		] );
	} );

	it( "creates forms for a strong verb of class 3; same result with 2nd/3rd person singular stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "berg" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "birg" ) );
	} );

	it( "creates forms for a strong verb of class 3; same result with past stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "berg" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "barg" ) );
	} );

	it( "creates forms for a strong verb of class 3; same result with past subjunctive stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "berg" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "bärg" ) );
	} );

	it( "creates forms for a strong verb of class 3; same result with past participle stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "berg" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "geborg" ) );
	} );

	it( "creates forms for a strong verb of class 3 with multiple past/past subjunctive stems", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schwimm" ) ).toEqual( [
			"schwimm",
			"schwamm",
			"schwomm",
			"schwimme",
			"schwimmen",
			"schwimmend",
			"schwimmest",
			"schwimmet",
			"schwimmst",
			"schwimmt",
			"schwammen",
			"schwammest",
			"schwammet",
			"schwammst",
			"schwammt",
			"schwommen",
			"schwommest",
			"schwommet",
			"schwommst",
			"schwommt",
			"schwämme",
			"schwämmest",
			"schwämmet",
			"schwämmen",
			"schwömme",
			"schwömmest",
			"schwömmet",
			"schwömmen",
			"geschwommen",
		] );
	} );

	it( "creates forms for a strong verb of class 3 with multiple past/past subjunctive stems; recognizes past stems as input", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schwimm" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "schwamm" )
		);
	} );

	it( "creates forms for a strong verb of class 3 with multiple past/past subjunctive stems; recognizes past stems as input", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schwimm" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "schwomm" )
		);
	} );

	it( "creates forms for a strong verb of class 3 with multiple past/past subjunctive stems; recognizes past subjunctive stems as input", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schwimm" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "schwämm" )
		);
	} );

	it( "creates forms for a strong verb of class 3 with multiple past/past subjunctive stems; recognizes past subjunctive stems as input", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schwimm" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "schwömm" )
		);
	} );

	it( "creates forms for a strong verb of class 4; same result with 2nd/3rd person singular stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "ess" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "iss" ) );
	} );

	it( "creates forms for a strong verb of class 4; same result with past stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "ess" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "aß" ) );
	} );

	it( "creates forms for a strong verb of class 4; same result with past subjunctive stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "ess" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "äß" ) );
	} );

	it( "creates forms for a strong verb of class 4; same result with past participle stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "ess" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "gegess" ) );
	} );

	it( "creates forms for a strong verb of class 5", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schlaf" ) ).toEqual( [
			"schlaf",
			"schlief",
			"schlafe",
			"schlafen",
			"schlafend",
			"schlafest",
			"schlafet",
			"schlafst",
			"schlaft",
			"schläfst",
			"schläft",
			"schliefen",
			"schliefst",
			"schlieft",
			"geschlafen",
		] );
	} );

	it( "creates forms for a strong verb of class 5; same result with 2nd/3rd person singular stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schlaf" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "schläf" ) );
	} );

	it( "creates forms for a strong verb of class 5; same result with past stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schlaf" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "schlief" ) );
	} );

	it( "creates forms for a strong verb of class 3; same result with past participle stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "schlaf" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "geschlaf" ) );
	} );
	it( "creates forms for an irregular verb", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "bring" ) ).toEqual( [
			"bring",
			"bringe",
			"bringen",
			"bringend",
			"bringest",
			"bringet",
			"bringst",
			"bringt",
			"bracht",
			"brachte",
			"brachten",
			"brachtest",
			"brachtet",
			"brächte",
			"brächten",
			"brächtest",
			"brächtet",
			"gebracht"
		] );
	} );

	it( "creates forms for an irregular verb, same result with past stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "bring" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "bracht" ) );
	} );

	it( "creates forms for an irregular verb, same result with past subjunctive stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "bring" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "brächt" ) );
	} );

	it( "creates forms for an irregular verb, same result with past participle stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "bring" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "gebrach" ) );
	} );

	it( "creates forms of the verb 'werden'", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "werd" ) ).toEqual( [
			"werd",
			"werde",
			"werden",
			"werdend",
			"werdest",
			"werdet",
			"wird",
			"wirst",
			"wurd",
			"wurde",
			"wurden",
			"wurdest",
			"wurdet",
			"würde",
			"würden",
			"würdest",
			"würdet",
			"worden",
			"geworden"
		] );
	} );

	it( "creates forms for the verb 'werden', same result with present2nd3rdSg stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "wir" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "werd" ) );
	} );

	it( "creates forms for the verb 'werden', same result with past stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "wurd" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "werd" ) );
	} );

	it( "creates forms for the verb 'werden', same result with past subjunctive stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "würd" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "werd" ) );
	} );

	it( "creates forms for the verb 'werden', same result with past participle stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "word" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "worden" ) );
	} );

	it( "creates forms for the verb 'werden', same result with alternative past participle stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "wir" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "geworden" ) );
	} );

	it( "creates forms of the verb 'wissen'", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "weiß" ) ).toEqual( [
			"weiß",
			"weißt",
			"wisse",
			"wisst",
			"wissest",
			"wisset",
			"wissen",
			"wissend",
			"wusst",
			"wusste",
			"wussten",
			"wusstest",
			"wusstet",
			"wüsste",
			"wüssten",
			"wüsstet",
			"wüsstest",
			"gewusst",
		] );
	} );

	it( "creates forms for the verb 'wissen', same result with pluralSgSubjunctivePresent stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "weiß" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "wiss" ) );
	} );

	it( "creates forms for the verb 'wissen', same result with past stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "weiß" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "wusst" ) );
	} );

	it( "creates forms for the verb 'wissen', same result with past subjunctive stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "weiß" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "wüsst" ) );
	} );

	it( "creates forms for the verb 'wissen', same result with past participle stem", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "weiß" ) ).toEqual(
			generateVerbExceptionForms( morphologyDataDE.verbs, "gewuss" ) );
	} );

	it( "makes sure that compound verbs with prefix are recognized and return the full forms", () => {
		expect( generateVerbExceptionForms( morphologyDataDE.verbs, "festhalt" ) ).toEqual( [
			"festhalt",
			"festhielt",
			"festhalte",
			"festhalten",
			"festhaltend",
			"festhaltest",
			"festhaltet",
			"festhaltst",
			"festhaltt",
			"festhältst",
			"festhältt",
			"festhielten",
			"festhieltst",
			"festhieltt",
			"festgehalten",
		] );
	} );
} );
