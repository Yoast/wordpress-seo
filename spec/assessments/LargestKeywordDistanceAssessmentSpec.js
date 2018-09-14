import LargestKeyWordDistanceAssessment from "../../src/assessments/seo/LargestKeywordDistanceAssessment.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../helpers/factory.js";
const i18n = Factory.buildJed();
import Mark from "../../src/values/Mark.js";

let keywordDistanceAssessment = new LargestKeyWordDistanceAssessment();

describe( "An assessment to check the largest percentage of text in your text in which no keyword occurs", function() {
	it( "returns a bad score when the average score from the step function is below the recommended minimum", function() {
		let mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword" } );
		let assessment = keywordDistanceAssessment.getResult( mockPaper, Factory.buildMockResearcher( { averageScore: 2 } ), i18n );

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual( "Large parts of your text do not contain the keyword. " +
			"Try to <a href='https://yoa.st/2w7' target='_blank'>distribute</a> the keyword more evenly." );
	} );

	it( "returns an okay score when the average score from the step function is between recommended minimum and the a good average", function() {
		let mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword" } );
		let assessment = keywordDistanceAssessment.getResult( mockPaper, Factory.buildMockResearcher( { averageScore: 5 } ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "Some parts of your text do not contain the keyword. " +
			"Try to <a href='https://yoa.st/2w7' target='_blank'>distribute</a> the keyword more evenly." );
	} );

	it( "returns an okay score when the average score from the step function is higher than the recommended average", function() {
		let mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword" } );
		let assessment = keywordDistanceAssessment.getResult( mockPaper, Factory.buildMockResearcher( { averageScore: 7 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "Your keyword is <a href='https://yoa.st/2w7' target='_blank'>distributed</a> evenly " +
			"throughout the text. That's great." );
	} );
} );

describe( "An assessment to check the largest percentage of text in which no keyword or synonyms occurred", function() {
	it( "returns a bad score when the average score from the step function is below the recommended minimum; specific feedback for synonyms", function() {
		let mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword", synonyms: "synonym" } );
		let assessment = keywordDistanceAssessment.getResult( mockPaper, Factory.buildMockResearcher( { averageScore: 2 } ), i18n );

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual( "Large parts of your text do not contain the keyword or its synonyms. " +
			"Try to <a href='https://yoa.st/2w7' target='_blank'>distribute</a> them more evenly." );
	} );

	it( "returns an okay score when the average score from the step function is between recommended minimum and the a good average; specific feedback for synonyms", function() {
		let mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword", synonyms: "synonym, synonyms" } );
		let assessment = keywordDistanceAssessment.getResult( mockPaper, Factory.buildMockResearcher( { averageScore: 5 } ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "Some parts of your text do not contain the keyword or its synonyms. " +
			"Try to <a href='https://yoa.st/2w7' target='_blank'>distribute</a> them more evenly." );
	} );

	it( "returns an okay score when the average score from the step function is higher than the recommended average; specific feedback for synonyms", function() {
		let mockPaper = new Paper( "string with the keyword and the keyword", { keyword: "keyword", synonyms: "synonym, synonyms" } );
		let assessment = keywordDistanceAssessment.getResult( mockPaper, Factory.buildMockResearcher( { averageScore: 7 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "Your keyword and its synonyms are <a href='https://yoa.st/2w7' target='_blank'>distributed</a> evenly " +
			"throughout the text. That's great." );
	} );
} );

describe( "Checks if the assessment is applicable", function() {
	it( "is applicable to papers with more than 200 words when a keyword is set", function() {
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
		let assessment = keywordDistanceAssessment.isApplicable( mockPaper );

		expect( assessment ).toBe( true );
	} );

	it( "is not applicable to papers with more than 200 words when no keyword is set", function() {
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
		let assessment = keywordDistanceAssessment.isApplicable( mockPaper );

		expect( assessment ).toBe( false );
	} );


	it( "is not applicable to papers with less than 200 words", function() {
		let mockPaper = new Paper( "Lorem ipsum dolor sit amet.", { keyword: "keyword" } );
		let assessment = keywordDistanceAssessment.isApplicable( mockPaper );

		expect( assessment ).toBe( false );
	} );
} );

describe( "A test for marking keywords in the text", function() {
	it( "returns markers for sentences specified by the researcher", function() {
		let mockPaper = new Paper( "A sentence. A sentence containing keywords. Another sentence.", { keyword: "keyword" } );
		keywordDistanceAssessment.getResult( mockPaper, Factory.buildMockResearcher(
			{ averageScore: 5, sentencesToHighlight: [ "A sentence.", "Another sentence." ] } ), i18n );
		let expected = [
			new Mark( {
				original: "A sentence.",
				marked: "<yoastmark class='yoast-text-mark'>A sentence.</yoastmark>",
			}, ),
			new Mark( {
				original: "Another sentence.",
				marked: "<yoastmark class='yoast-text-mark'>Another sentence.</yoastmark>",
			}, ),
		];
		expect( keywordDistanceAssessment.getMarks() ).toEqual( expected );
	} );
} );
