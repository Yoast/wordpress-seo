import KeyphraseDistributionAssessment from "../../../../src/scoring/assessments/seo/KeyphraseDistributionAssessment.js";
import keyphraseDistribution from "../../../../src/languageProcessing/researches/keyphraseDistribution";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";
import Mark from "../../../../src/values/Mark.js";

const keyphraseDistributionAssessment = new KeyphraseDistributionAssessment();

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

		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.hasAIFixes() ).toBeTruthy();
	} );

	it( "returns a 'consideration' score when no keyword occurs", function() {
		const mockPaper = new Paper( "a string", { keyword: "keyword" } );
		const assessment = keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( {
				keyphraseDistributionScore: 100,
				sentencesToHighlight: [],
			} )
		);

		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: " +
			"<a href='https://yoa.st/33u' target='_blank'>Include your keyphrase or its synonyms in the text so that we can check keyphrase" +
			" distribution</a>." );
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
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Uneven. " +
			"Some parts of your text do not contain the keyphrase or its synonyms. <a href='https://yoa.st/33u' target='_blank'>Distribute" +
			" them more evenly</a>." );
	} );

	it( "returns a good score score when the %  of sentences between topic occurrences is lower than the recommended good score", function() {
		const mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword" } );
		const assessment = keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( {
				keyphraseDistributionScore: 25,
				sentencesToHighlight: [],
			} )
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!" );
	} );
} );

describe( "Checks if the assessment is applicable", function() {
	let researcher;

	beforeEach( () => {
		researcher = new EnglishResearcher();
		researcher.addResearch( "keyphraseDistribution", keyphraseDistribution );
	} );

	it( "is applicable to papers with more than 10 sentences when a keyword is set", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, vim illum aeque" +
			" constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id." +
			" Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam" +
			" cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te" +
			" vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te" +
			" sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas." +
			" Oratio vocibus offendit an mei, est esse pericula liberavisse. Lorem ipsum dolor sit amet, vim illum aeque" +
			" constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id." +
			" Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam" +
			" cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te" +
			" vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te" +
			" sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas." +
			" Oratio vocibus offendit an mei, est esse pericula liberavisse.", { keyword: "keyword" } );
		researcher.setPaper( mockPaper );

		const isAssessmentApplicable = keyphraseDistributionAssessment.isApplicable( mockPaper, researcher );

		expect( isAssessmentApplicable ).toBe( true );
	} );

	it( "is not applicable to papers with more than 10 sentences when no keyword is set", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, vim illum aeque" +
			" constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id." +
			" Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam" +
			" cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te" +
			" vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te" +
			" sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas." +
			" Oratio vocibus offendit an mei, est esse pericula liberavisse. Lorem ipsum dolor sit amet, vim illum aeque" +
			" constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id." +
			" Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam" +
			" cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te" +
			" vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te" +
			" sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas." +
			" Oratio vocibus offendit an mei, est esse pericula liberavisse." );
		researcher.setPaper( mockPaper );

		const isAssessmentApplicable = keyphraseDistributionAssessment.isApplicable( mockPaper, researcher );

		expect( isAssessmentApplicable ).toBe( false );
	} );


	it( "is not applicable to papers with less than 15 sentences", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet.", { keyword: "keyword" } );
		researcher.setPaper( mockPaper );

		const isAssessmentApplicable = keyphraseDistributionAssessment.isApplicable( mockPaper, researcher );

		expect( isAssessmentApplicable ).toBe( false );
	} );

	it( "is not applicable to papers with more than 15 sentences when the sentences are inside an element that should" +
		"be excluded from the analysis", function() {
		const mockPaper = new Paper( "<blockquote>" + "Lorem ipsum dolor sit amet. ".repeat( 16 ) + "</blockquote>",
			{ keyword: "keyword" } );
		researcher.setPaper( mockPaper );

		const isAssessmentApplicable = keyphraseDistributionAssessment.isApplicable( mockPaper, researcher );

		expect( isAssessmentApplicable ).toBe( false );
	} );

	it( "is not applicable when the researcher doesn't have the research", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, vim illum aeque" +
			" constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id." +
			" Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam" +
			" cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te" +
			" vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te" +
			" sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas." +
			" Oratio vocibus offendit an mei, est esse pericula liberavisse. Lorem ipsum dolor sit amet, vim illum aeque" +
			" constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id." +
			" Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam" +
			" cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te" +
			" vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te" +
			" sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas." +
			" Oratio vocibus offendit an mei, est esse pericula liberavisse.", { keyword: "keyword" } );
		researcher.setPaper( mockPaper );
		delete researcher.customResearches.keyphraseDistribution;
		const assessmentIsApplicable = keyphraseDistributionAssessment.isApplicable( mockPaper, researcher );

		expect( assessmentIsApplicable ).toBe( false );
	} );

	it( "should not be applicable to a text consisting only of shortcodes", function() {
		const shortcodeSentence = "[shortcode]".repeat( 15 ) + ". ";
		const mockPaper = new Paper( shortcodeSentence.repeat( 15 ), { shortcodes: [ "shortcode" ] } );
		researcher.setPaper( mockPaper );

		const assessmentIsApplicable = keyphraseDistributionAssessment.isApplicable( mockPaper, researcher );

		expect( assessmentIsApplicable ).toBe( false );
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
