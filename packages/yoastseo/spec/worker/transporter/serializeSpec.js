import AssessmentResult from "../../../src/values/AssessmentResult";
import Mark from "../../../src/values/Mark";
import Paper from "../../../src/values/Paper";
import Participle from "../../../src/values/Participle";
import Sentence from "../../../src/values/Sentence";
import SentencePart from "../../../src/values/SentencePart";
import ProminentWord from "../../../src/values/ProminentWord";
import WordCombination from "../../../src/values/WordCombination";
import serialize from "../../../src/worker/transporter/serialize";
import englishFunctionWordsFactory from "../../../src/researches/english/functionWords.js";

const functionWords = englishFunctionWordsFactory().all;

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
			url: "",
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

	it( "serializes WordCombinations", () => {
		const thing = new WordCombination( [ "syllable", "combinations" ], 2, functionWords );
		const words = {	syllable: 4, combinations: 4 };
		thing.setRelevantWords( words );

		expect( serialize( thing ) ).toEqual( {
			_parseClass: "WordCombination",
			functionWords: functionWords,
			occurrences: 2,
			words: [ "syllable", "combinations" ],
			relevantWords: words,
		} );
	} );

	it( "serializes Participles", () => {
		const thing = new Participle( "geschlossen", "Es wird geschlossen worden sein.",
			{ auxiliaries: [ "wird", "worden" ], type: "irregular", language: "de" } );

		const expected = {
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

		expect( serialize( thing ) ).toEqual( expected );
	} );

	it( "serializes Sentences", () => {
		const thing = new Sentence( "This is a sample text.", "en_US" );
		const expected = {
			_parseClass: "Sentence",
			isPassive: false,
			locale: "en_US",
			sentenceText: "This is a sample text.",
		};

		expect( serialize( thing ) ).toEqual( expected );
	} );

	it( "serializes SentenceParts", () => {
		const thing = new SentencePart( "wird geschlossen", [ "wird" ], "de" );
		thing.setPassive( true );

		const expected = {
			_parseClass: "SentencePart",
			auxiliaries: [ "wird" ],
			isPassive: true,
			locale: "de",
			sentencePartText: "wird geschlossen",
		};

		expect( serialize( thing ) ).toEqual( expected );
	} );
} );
