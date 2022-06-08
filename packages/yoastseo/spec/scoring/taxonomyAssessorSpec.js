import DefaultResearcher from "../../src/languageProcessing/languages/_default/Researcher";
import Assessor from "../../src/scoring/taxonomyAssessor.js";
import Paper from "../../src/values/Paper.js";
import getResults from "../specHelpers/getAssessorResults";

describe( "running assessments in the assessor", function() {
	let assessor;

	beforeEach( () => {
		assessor = new Assessor( new DefaultResearcher() );
	} );

	it( "runs assessments without any specific requirements", function() {
		assessor.assess( new Paper( "" ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
		] );
	} );

	it( "additionally runs assessments that only require a text", function() {
		assessor.assess( new Paper( "text" ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
		] );
	} );

	it( "additionally returns a singleH1assessment if text contains two H1s", function() {
		assessor.assess( new Paper( "<h1>Title1</h1><h1>Title2</h1>" ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
			"singleH1",
		] );
	} );

	it( "additionally runs assessments that require a text and a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
		] );
	} );

	it( "additionally runs assessments that require a keyword that contains function words only", function() {
		assessor.assess( new Paper( "", { keyword: "a" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
		] );
	} );

	it( "additionally runs assessments that require a text, a keyword and a title", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword", title: "title" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"keyphraseInSEOTitle",
			"titleWidth",
		] );
	} );

	it( "additionally runs assessments that require a text and a long url with a stop word", function() {
		assessor.assess( new Paper( "text",
			{ slug: "a-test-a-test-a-test-a-test-a-test-a-test-a-test-a-test-a-test-a-test-a-test-a-test-a-test-a-test" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
		] );
	} );

	it( "additionally runs assessments that require a text, a url and a keyword", function() {
		assessor.assess( new Paper( "text", { slug: "sample-slug", keyword: "keyword" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
			"slugKeyword",
		] );
	} );

	it( "additionally runs assessments that require a text of at least 100 words and a keyword", function() {
		assessor.assess( new Paper( "This is a keyword. Lorem ipsum dolor sit amet, vim illum aeque constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id. Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas. Oratio vocibus offendit an mei, est esse pericula liberavisse.", { keyword: "keyword" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"keywordDensity",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
		] );
	} );

	it( "additionally runs assessments that require a text, a keyword and a meta description", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword", description: "description" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"metaDescriptionKeyword",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
		] );
	} );

	describe( "has configuration overrides", () => {
		test( "PageTitleWidthAssesment", () => {
			const assessment = assessor.getAssessment( "titleWidth" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.widthTooShort ).toBe( 9 );
		} );
	} );
} );
