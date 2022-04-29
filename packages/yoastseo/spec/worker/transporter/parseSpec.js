import AssessmentResult from "../../../src/values/AssessmentResult";
import Mark from "../../../src/values/Mark";
import Paper from "../../../src/values/Paper";
import Sentence from "../../../src/languageProcessing/values/Sentence";
import Clause from "../../../src/languageProcessing/values/Clause";
import ProminentWord from "../../../src/languageProcessing/values/ProminentWord";
import parse from "../../../src/worker/transporter/parse";

describe( "parse", () => {
	it( "parses strings", () => {
		expect( parse( "a string" ) ).toEqual( "a string" );
	} );

	it( "parses numbers", () => {
		expect( parse( 42 ) ).toEqual( 42 );
	} );

	it( "parses objects", () => {
		const thing = {
			number: 123,
			"some key": "some value",
			x: null,
		};
		expect( parse( thing ) ).toEqual( thing );
	} );

	it( "parses arrays", () => {
		const serialized = [ "a", 1, "bcdefg", null ];
		expect( parse( serialized ) ).toEqual( serialized );
	} );

	it( "parses serialized ProminentWords", () => {
		const serialized = {
			_parseClass: "ProminentWord",
			occurrences: 2,
			word: "combinations",
			stem: "combination",
		};

		const expected = new ProminentWord( "combinations", "combination", 2 );

		expect( parse( serialized ) ).toEqual( expected );
	} );

	it( "parses serialized Marks", () => {
		const serialized = {
			_parseClass: "Mark",
			original: "<h1>A heading</h1>",
			marked: "<yoastmark class='yoast-text-mark'><h1>A heading</h1></yoastmark>",
		};

		const expected = new Mark( {
			original: "<h1>A heading</h1>",
			marked: "<yoastmark class='yoast-text-mark'><h1>A heading</h1></yoastmark>",
		} );

		expect( parse( serialized ) ).toEqual( expected );
	} );

	it( "parses serialized Papers", () => {
		const serialized = {
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
		};

		const expected = new Paper( "This is a sample text.", {
			description: "This a meta description.",
			keyword: "some keywords",
			locale: "en_US",
			permalink: "https://example.com/page-0",
			title: "A text about a keyword.",
		} );

		expect( parse( serialized ) ).toEqual( expected );
	} );

	it( "parses serialized AssessmentResults", () => {
		const serialized = {
			_parseClass: "AssessmentResult",
			identifier: "",
			marks: [],
			score: 666,
			text: "Good job!",
		};

		const expected = new AssessmentResult();
		expected.setScore( 666 );
		expected.setText( "Good job!" );

		expect( parse( serialized ) ).toEqual( expected );
	} );

	it( "parses serialized Sentences", () => {
		const serialized = {
			_parseClass: "Sentence",
			clauses: [],
			isPassive: false,
			sentenceText: "This is a sample text.",
		};

		const expected = new Sentence( "This is a sample text." );

		expect( parse( serialized ) ).toEqual( expected );
	} );

	it( "parses serialized Clause", () => {
		const serialized = {
			_parseClass: "Clause",
			auxiliaries: [ "wird" ],
			isPassive: true,
			clauseText: "wird geschlossen",
			participles: [ "geschlossen" ],
		};

		const expected = new Clause( "wird geschlossen", [ "wird" ] );
		expected.setPassive( true );

		expect( parse( serialized ) ).toEqual( expected );
	} );
} );
