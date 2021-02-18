import { all as functionWords } from "../../../src/languageProcessing/languages/en/config/functionWords";
import AssessmentResult from "../../../src/values/AssessmentResult";
import Mark from "../../../src/values/Mark";
import Paper from "../../../src/values/Paper";
import Participle from "../../../src/values/Participle";
import Sentence from "../../../src/values/Sentence";
import SentencePart from "../../../src/values/SentencePart";
import ProminentWord from "../../../src/values/ProminentWord";
import WordCombination from "../../../src/values/WordCombination";
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

	it( "parses serialized WordCombinations", () => {
		const serialized = {
			_functionWords: functionWords,
			_length: 2,
			_occurrences: 2,
			_words: [ "syllable", "combinations" ],
			_relevantWords: {
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

	it( "parses serialized Participles", () => {
		const serialized = {
			_parseClass: "Participle",
			attributes: {
				auxiliaries: [ "wird", "worden" ],
				language: "de",
				type: "irregular",
			},
			determinesSentencePartIsPassive: false,
			participle: "geschlossen",
			sentencePart: "Es wird geschlossen worden sein.",
		};

		const expected = new Participle( "geschlossen", "Es wird geschlossen worden sein.",
			{ auxiliaries: [ "wird", "worden" ], type: "irregular", language: "de" } );

		expect( parse( serialized ) ).toEqual( expected );
	} );

	it( "parses serialized Sentences", () => {
		const serialized = {
			_parseClass: "Sentence",
			isPassive: false,
			locale: "en_US",
			sentenceText: "This is a sample text.",
		};

		const expected = new Sentence( "This is a sample text.", "en_US" );

		expect( parse( serialized ) ).toEqual( expected );
	} );

	it( "parses serialized SentenceParts", () => {
		const serialized = {
			_parseClass: "SentencePart",
			auxiliaries: [ "wird" ],
			isPassive: true,
			locale: "de",
			sentencePartText: "wird geschlossen",
		};

		const expected = new SentencePart( "wird geschlossen", [ "wird" ], "de" );
		expected.setPassive( true );

		expect( parse( serialized ) ).toEqual( expected );
	} );
} );
