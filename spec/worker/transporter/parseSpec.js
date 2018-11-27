import englishFunctionWordsFactory from "../../../src/researches/english/functionWords";
import AssessmentResult from "../../../src/values/AssessmentResult";
import Mark from "../../../src/values/Mark";
import Paper from "../../../src/values/Paper";
import WordCombination from "../../../src/values/WordCombination";
import parse from "../../../src/worker/transporter/parse";

const functionWords = englishFunctionWordsFactory().all;

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

	it( "parses serialized WordCombinations", () => {
		const serialized = {
			_parseClass: "WordCombination",
			functionWords: functionWords,
			occurrences: 2,
			words: [ "syllable", "combinations" ],
			relevantWords: {
				syllable: 4,
				combinations: 4,
			},
		};

		const expected = new WordCombination( [ "syllable", "combinations" ], 2, functionWords );
		const words = {	syllable: 4, combinations: 4 };
		expected.setRelevantWords( words );

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

	it( "parses Papers", () => {
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
			url: "",
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

	it( "parses AssessmentResults", () => {
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
} );
