import KeyphraseDistributionAssessment from "../../src/assessments/seo/KeyphraseDistributionAssessment.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
const i18n = Factory.buildJed();
import Mark from "../../src/values/Mark.js";

let keyphraseDistributionAssessment = new KeyphraseDistributionAssessment();

describe( "An assessment to check your keyphrase distribution", function() {
	it( "returns a 'consideration' score when no keyword occurs", function() {
		let mockPaper = new Paper( "a string", { keyword: "keyword" } );
		let assessment = keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( {
				keyphraseDistributionScore: 100,
				sentencesToHighlight: [],
			} ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 0 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: " +
			"<a href='https://yoa.st/33u' target='_blank'>Include your keyphrase or its synonyms in the text so that we can check keyphrase distribution</a>." );
	} );

	it( "returns a bad score when the % of sentences between topic occurrences is above 50%", function() {
		let mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword" } );
		let assessment = keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( {
				keyphraseDistributionScore: 60,
				sentencesToHighlight: [],
			} ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Very uneven. " +
			"Large parts of your text do not contain the keyphrase or its synonyms. <a href='https://yoa.st/33u' target='_blank'>Distribute them more evenly</a>." );
	} );

	it( "returns an okay score when the % of sentences between topic occurrences is between recommended acceptable and good score", function() {
		let mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword" } );
		let assessment = keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( {
				keyphraseDistributionScore: 40,
				sentencesToHighlight: [],
			} ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Uneven. " +
			"Some parts of your text do not contain the keyphrase or its synonyms. <a href='https://yoa.st/33u' target='_blank'>Distribute them more evenly</a>." );
	} );

	it( "returns a good score score when the %  of sentences between topic occurrences is lower than the recommended good score", function() {
		let mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword" } );
		let assessment = keyphraseDistributionAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( {
				keyphraseDistributionScore: 25,
				sentencesToHighlight: [],
			} ),
			i18n
		);

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33q' target='_blank'>Keyphrase distribution</a>: Good job!" );
	} );
} );

describe( "Checks if the assessment is applicable", function() {
	it( "is applicable to papers with more than 10 sentences when a keyword is set", function() {
		let mockPaper = new Paper( "Lorem ipsum dolor sit amet, vim illum aeque" +
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
		let assessment = keyphraseDistributionAssessment.isApplicable( mockPaper );

		expect( assessment ).toBe( true );
	} );

	it( "is not applicable to papers with more than 10 sentences when no keyword is set", function() {
		let mockPaper = new Paper( "Lorem ipsum dolor sit amet, vim illum aeque" +
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
		let assessment = keyphraseDistributionAssessment.isApplicable( mockPaper );

		expect( assessment ).toBe( false );
	} );


	it( "is not applicable to papers with less than 15 sentences", function() {
		let mockPaper = new Paper( "Lorem ipsum dolor sit amet.", { keyword: "keyword" } );
		let assessment = keyphraseDistributionAssessment.isApplicable( mockPaper );

		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for marking keywords in the text", function() {
	it( "returns markers for sentences specified by the researcher", function() {
		let mockPaper = new Paper( "A sentence. A sentence containing keywords. Another sentence.", { keyword: "keyword" } );
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
				} ),
			i18n
		);
		let expected = [
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
} );
