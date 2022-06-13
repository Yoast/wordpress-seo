import AssessmentResult from "../../../src/values/AssessmentResult";
import Mark from "../../../src/values/Mark";
import Paper from "../../../src/values/Paper";
import Sentence from "../../../src/languageProcessing/values/Sentence";
import Clause from "../../../src/languageProcessing/values/Clause";
import ProminentWord from "../../../src/languageProcessing/values/ProminentWord";
import serialize from "../../../src/worker/transporter/serialize";

describe( "serialize", () => {
	it( "serializes strings", () => {
		expect( serialize( "A sample text." ) ).toBe( "A sample text." );
	} );

	it( "serializes numbers", () => {
		expect( serialize( 5 ) ).toBe( 5 );
	} );

	it( "serializes arrays of strings and numbers", () => {
		expect( serialize( [ 5, "hello", 9 ] ) ).toEqual( [ 5, "hello", 9 ] );
	} );

	it( "serializes objects", () => {
		const thing = {
			hello: "world",
			5: "six",
			"some stuff": "",
		};
		expect( serialize( thing ) ).toEqual( thing );
	} );

	it( "serializes nested objects", () => {
		const thing = {
			hello: "world",
			5: "six",
			"some stuff": {
				"blah blah": {
					answer: 42,
				},
			},
		};
		expect( serialize( thing ) ).toEqual( thing );
	} );

	it( "replaces functions with empty objects", () => {
		const thing = {
			hello: "world",
			5: "six",
			"some stuff": () => "nope",
		};
		const expected = {
			hello: "world",
			5: "six",
			"some stuff": {},
		};
		expect( serialize( thing ) ).toEqual( expected );
		expect( serialize( () => "no way" ) ).toEqual( {} );
	} );

	it( "serializes AssessmentResults", () => {
		const thing = new AssessmentResult();
		thing.setScore( 666 );
		thing.setText( "Good job!" );

		expect( serialize( thing ) ).toEqual( {
			_parseClass: "AssessmentResult",
			identifier: "",
			marks: [],
			score: 666,
			text: "Good job!",
		} );
	} );

	it( "serializes Papers", () => {
		const thing = new Paper( "This is a sample text.", {
			description: "This a meta description.",
			keyword: "some keywords",
			locale: "en_US",
			permalink: "https://example.com/page-0",
			title: "A text about a keyword.",
			date: "8 September 2021",
		} );

		expect( serialize( thing ) ).toEqual( {
			_parseClass: "Paper",
			text: "This is a sample text.",
			description: "This a meta description.",
			keyword: "some keywords",
			locale: "en_US",
			permalink: "https://example.com/page-0",
			title: "A text about a keyword.",
			synonyms: "",
			titleWidth: 0,
			slug: "",
			date: "8 September 2021",
		} );
	} );

	it( "serializes Marks", () => {
		const thing = new Mark( {
			original: "<h1>A heading</h1>",
			marked: "<yoastmark class='yoast-text-mark'><h1>A heading</h1></yoastmark>",
		} );

		expect( serialize( thing ) ).toEqual( {
			_parseClass: "Mark",
			original: "<h1>A heading</h1>",
			marked: "<yoastmark class='yoast-text-mark'><h1>A heading</h1></yoastmark>",
		} );
	} );

	it( "serializes ProminentWords", () => {
		const thing = new ProminentWord( "combinations", "combination", 2 );

		expect( serialize( thing ) ).toEqual( {
			_parseClass: "ProminentWord",
			occurrences: 2,
			word: "combinations",
			stem: "combination",
		} );
	} );

	it( "serializes Sentences", () => {
		const thing = new Sentence( "This is a sample text." );
		const expected = {
			_parseClass: "Sentence",
			clauses: [],
			isPassive: false,
			sentenceText: "This is a sample text.",
		};

		expect( serialize( thing ) ).toEqual( expected );
	} );

	it( "serializes Clause", () => {
		const thing = new Clause( "wird geschlossen", [ "wird" ] );
		thing.setPassive( true );

		const expected = {
			_parseClass: "Clause",
			auxiliaries: [ "wird" ],
			clauseText: "wird geschlossen",
			isPassive: true,
			participles: [],
		};

		expect( serialize( thing ) ).toEqual( expected );
	} );
} );
