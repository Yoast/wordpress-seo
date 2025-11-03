import KeyphraseDistributionAssessment from "../../../../src/scoring/assessments/seo/KeyphraseDistributionAssessment.js";
import keyphraseDistribution from "../../../../src/languageProcessing/researches/keyphraseDistribution";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";
import Mark from "../../../../src/values/Mark.js";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";

const keyphraseDistributionAssessment = new KeyphraseDistributionAssessment();

describe( "Tests for the keyphrase distribution assessment when no keyphrase and/or text is added", function() {
	it( "shows feedback for keyphrase distribution when there is no text", function() {
		const paper = new Paper( "", { keyword: "keyword" } );
		const researcher = new DefaultResearcher( paper );
		const assessment = keyphraseDistributionAssessment.getResult( paper, researcher );
		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.hasAIFixes() ).toBeTruthy();
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: " +
			"<a href='https://yoa.st/33u' target='_blank'>Please add both a keyphrase and some text containing the keyphrase or its synonyms</a>." );
	} );
	it( "shows feedback for keyphrase distribution when there is no keyphrase set", function() {
		const paper = new Paper( "some text", { keyword: "" } );
		const researcher = new DefaultResearcher( paper );
		const assessment = keyphraseDistributionAssessment.getResult( paper, researcher );
		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: " +
			"<a href='https://yoa.st/33u' target='_blank'>Please add both a keyphrase and some text containing the keyphrase or its synonyms</a>." );
	} );
	it( "shows feedback for keyphrase distribution when there is no keyphrase set and no text", function() {
		const paper = new Paper( "", { keyword: "keyphrase" } );
		const researcher = new DefaultResearcher( paper );
		const assessment = keyphraseDistributionAssessment.getResult( paper, researcher );
		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: " +
			"<a href='https://yoa.st/33u' target='_blank'>Please add both a keyphrase and some text containing the keyphrase or its synonyms</a>."  );
	} );
} );

describe( "An assessment to check the keyphrase distribution in the text", function() {
	it( "returns `hasAIFixes` to be true when the result is not good", function() {
		const mockPaper = new Paper( "a string", { keyword: "keyword" } );
		const assessment = keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( {
				keyphraseDistributionScore: 100,
				sentencesToHighlight: [],
			} )
		);

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.hasAIFixes() ).toBeTruthy();
	} );

	it( "returns the correct feedback when there are no keyphrase occurrences in the text", function() {
		const mockPaper = new Paper( "a string", { keyword: "keyword" } );
		const assessment = keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( {
				keyphraseDistributionScore: 100,
				sentencesToHighlight: [],
			} )
		);

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: " +
			"<a href='https://yoa.st/33u' target='_blank'>Please add both a keyphrase and some text containing the keyphrase or its synonyms</a>." );
	} );

	it( "returns a bad score when the % of sentences between topic occurrences is above 50%", function() {
		const mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword" } );
		const assessment = keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( {
				keyphraseDistributionScore: 60,
				sentencesToHighlight: [],
			} )
		);

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Very uneven. " +
			"Large parts of your text do not contain the keyphrase or its synonyms. <a href='https://yoa.st/33u' target='_blank'>Distribute" +
			" them more evenly</a>." );
	} );

	it( "returns an okay score when the % of sentences between topic occurrences is between recommended acceptable and good score", function() {
		const mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword" } );
		const assessment = keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( {
				keyphraseDistributionScore: 40,
				sentencesToHighlight: [],
			} )
		);

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.hasAIFixes() ).toBeTruthy();
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Uneven. " +
			"Some parts of your text do not contain the keyphrase or its synonyms. <a href='https://yoa.st/33u' target='_blank'>Distribute" +
			" them more evenly</a>." );
	} );

	it( "returns a good score score when the % of sentences between topic occurrences is lower than the recommended good score", function() {
		const mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword" } );
		const assessment = keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( {
				keyphraseDistributionScore: 25,
				sentencesToHighlight: [],
			} )
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.hasAIFixes() ).toBeFalsy();
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!" );
	} );
} );

describe( "A test for marking keywords in the text", function() {
	it( "returns markers for sentences specified by the researcher", function() {
		const mockPaper = new Paper( "A sentence. A sentence containing keywords. Another sentence.", { keyword: "keyword" } );
		keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher(
				{
					keyphraseDistributionScore: 5,
					sentencesToHighlight: [
						new Mark( {
							original: "A sentence.",
							marked: "<yoastmark class='yoast-text-mark'>A sentence.</yoastmark>",
						} ),
						new Mark( {
							original: "Another sentence.",
							marked: "<yoastmark class='yoast-text-mark'>Another sentence.</yoastmark>",
						} ),
					],
				} )
		);
		const expected = [
			new Mark( {
				original: "A sentence.",
				marked: "<yoastmark class='yoast-text-mark'>A sentence.</yoastmark>",
			} ),
			new Mark( {
				original: "Another sentence.",
				marked: "<yoastmark class='yoast-text-mark'>Another sentence.</yoastmark>",
			} ),
		];
		expect( keyphraseDistributionAssessment.getMarks() ).toEqual( expected );
	} );
	it( "returns markers for a keyphrase found in image caption", function() {
		const paper = new Paper( "<p><img class='size-medium wp-image-33' src='http://basic.wordpress.test/wp-content/uploads/2021/08/" +
			"cat-3957861_1280-211x300.jpeg' alt='a different cat with toy' width='211' height='300'></img> " +
			"A flamboyant cat with a toy<br></br>\n" +
			"</p>",
		{ keyword: "cat toy" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearch( "keyphraseDistribution", keyphraseDistribution );

		keyphraseDistributionAssessment.getResult( paper, researcher );
		const expected = [
			new Mark( {
				marked: "A flamboyant <yoastmark class='yoast-text-mark'>cat</yoastmark> with a <yoastmark class='yoast-text-mark'>toy</yoastmark>",
				original: "A flamboyant cat with a toy" } ) ];
		expect( keyphraseDistributionAssessment.getMarks() ).toEqual( expected );
	} );
	it( "doesn't return markers if the research doesn't have sentences to highlight", function() {
		const mockPaper = new Paper( "A sentence. Another sentence.", { keyword: "keyword" } );
		keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher(
				{
					keyphraseDistributionScore: 5,
					sentencesToHighlight: [],
				} )
		);
		expect( keyphraseDistributionAssessment.getMarks() ).toEqual( [] );
	} );
} );

describe( "a test for retrieving the feedback texts", () => {
	it( "should return the custom feedback texts when `callbacks.getResultTexts` is provided", () => {
		const assessment = new KeyphraseDistributionAssessment( {
			callbacks: {
				getResultTexts: () => ( {
					good: "The text has a good keyphrase distribution.",
					okay: "Some parts of your text do not contain the keyphrase or its synonyms. Distribute them more evenly.",
					bad: "Very uneven. Large parts of your text do not contain the keyphrase or its synonyms. Distribute them more evenly.",
					consideration: "Include your keyphrase or its synonyms in the text so that we can check keyphrase distribution.",
				} ),
			},
		} );
		expect( assessment.getFeedbackStrings() ).toEqual( {
			good: "The text has a good keyphrase distribution.",
			okay: "Some parts of your text do not contain the keyphrase or its synonyms. Distribute them more evenly.",
			bad: "Very uneven. Large parts of your text do not contain the keyphrase or its synonyms. Distribute them more evenly.",
			consideration: "Include your keyphrase or its synonyms in the text so that we can check keyphrase distribution.",
		} );
	} );
} );
