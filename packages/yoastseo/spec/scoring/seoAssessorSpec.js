import DefaultResearcher from "../../src/languageProcessing/languages/_default/Researcher";
import Assessor from "../../src/scoring/seoAssessor.js";
import Paper from "../../src/values/Paper.js";
import factory from "../specHelpers/factory.js";
import getResults from "../specHelpers/getAssessorResults";
const i18n = factory.buildJed();

describe( "running assessments in the assessor", function() {
	let assessor;

	beforeEach( () => {
		assessor = new Assessor( i18n, new DefaultResearcher() );
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
			"textImages",
			"textLength",
			"externalLinks",
			"internalLinks",
			"titleWidth",
		] );
	} );

	it( "additionally runs singleH1assessment if the text contains two H1s", function() {
		assessor.assess( new Paper( "<h1>First title</h1><h1>Second title</h1>" ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"textImages",
			"textLength",
			"externalLinks",
			"internalLinks",
			"titleWidth",
			"singleH1",
		] );
	} );

	it( "additionally runs assessments that only require a text and a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"metaDescriptionLength",
			"textImages",
			"textLength",
			"externalLinks",
			"internalLinks",
			"titleWidth",
		] );
	} );

	it( "additionally runs assessments that only require a keyword that contains function words only", function() {
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

	it( "additionally runs assessments that require text and a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"metaDescriptionLength",
			"textImages",
			"textLength",
			"externalLinks",
			"internalLinks",
			"titleWidth",
		] );
	} );

	it( "additionally runs assessments that require a long enough text and a keyword and a synonym", function() {
		const text = "a ".repeat( 200 );
		assessor.assess( new Paper( text, { keyword: "keyword", synonyms: "synonym" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"keywordDensity",
			"metaDescriptionLength",
			"textImages",
			"textLength",
			"externalLinks",
			"internalLinks",
			"titleWidth",
		] );
	} );

	it( "additionally runs assessments that require a text and a super-long url with stop words", function() {
		assessor.assess( new Paper( "text", { url: "a-sample-url-a-sample-url-a-sample-url-a-sample-url-a-sample-url-a-sample-url-a-sample-url-a-sample-url-a-sample-url" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"textImages",
			"textLength",
			"externalLinks",
			"internalLinks",
			"titleWidth",
		] );
	} );

	it( "additionally runs assessments that require a text, a url and a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword", url: "sample url" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"metaDescriptionLength",
			"textImages",
			"textLength",
			"externalLinks",
			"internalLinks",
			"titleWidth",
			"urlKeyword",
		] );
	} );

	// These specifications will additionally trigger the largest keyword distance assessment.
	it( "additionally runs assessments that require a long enough text and two keyword occurrences", function() {
		assessor.assess( new Paper( "This is a keyword and a keyword. Lorem ipsum dolor sit amet, vim illum aeque" +
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
			" Oratio vocibus offendit an mei, est esse pericula liberavisse.", { keyword: "keyword" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"keywordDensity",
			"metaDescriptionLength",
			"textImages",
			"textLength",
			"externalLinks",
			"internalLinks",
			"titleWidth",
		] );
	} );

	it( "additionally runs assessments that require a long enough text and one keyword occurrence and one synonym occurrence", function() {
		assessor.assess( new Paper( "This is a keyword. Lorem ipsum dolor sit amet, vim illum aeque" +
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
			" sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas synonym." +
			" Oratio vocibus offendit an mei, est esse pericula liberavisse.", { keyword: "keyword", synonyms: "synonym" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"keywordDensity",
			"metaDescriptionLength",
			"textImages",
			"textLength",
			"externalLinks",
			"internalLinks",
			"titleWidth",
		] );
	} );
} );
