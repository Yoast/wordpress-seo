let Assessor = require( "../src/assessors/taxonomyAssessor.js" );
let Paper = require( "yoastseo/js/values/Paper.js" );
let factory = require( "./helpers/factory.js" );
let i18n = factory.buildJed();
let assessor = new Assessor( i18n );

let getResults = function ( Results ) {
	let assessments = [];

	for ( let Result of Results ) {
		assessments.push( Result._identifier );
	}

	return assessments;
};

describe ( "running assessments in the assessor", function() {
	it( "runs assessments without any specific requirements", function() {
		assessor.assess( new Paper( "" ) );
		let AssessmentResults = assessor.getValidResults();
		let assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"titleWidth",
			"textLength"
		] );
	} );

	it( "additionally runs assessments that only require a text", function() {
		assessor.assess( new Paper( "text" ) );
		let AssessmentResults = assessor.getValidResults();
		let assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"titleWidth",
			"textLength"
		] );
	} );

	it( "additionally runs assessments that require a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		let AssessmentResults = assessor.getValidResults();
		let assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"introductionKeyword",
			"metaDescriptionLength",
			"titleKeyword",
			"titleWidth",
			"textLength"
		] );
	} );

	it( "additionally runs assessments that require a url", function() {
		assessor.assess( new Paper( "text", { url: "sample url" } ) );
		let AssessmentResults = assessor.getValidResults();
		let assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"titleWidth",
			"textLength"
		] );
	} );

	it( "additionally runs assessments that require a url and a keyword", function() {
		assessor.assess( new Paper( "text", { url: "sample url", keyword: "keyword" } ) );
		let AssessmentResults = assessor.getValidResults();
		let assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"introductionKeyword",
			"metaDescriptionLength",
			"titleKeyword",
			"titleWidth",
			"urlKeyword",
			"textLength"
		] );
	} );

	it( "additionally runs assessments that require a text of at least 100 words and a keyword", function() {
		assessor.assess( new Paper( "This is a keyword. Lorem ipsum dolor sit amet, vim illum aeque constituam at. Id latine tritani alterum pro. Ei quod stet affert sed. Usu putent fabellas suavitate id. Quo ut stet recusabo torquatos. Eum ridens possim expetenda te. Ex per putant comprehensam. At vel utinam cotidieque, at erat brute eum, velit percipit ius et. Has vidit accusata deterruisset ea, quod facete te vis. Vix ei duis dolor, id eum sonet fabulas. Id vix imperdiet efficiantur. Percipit probatus pertinax te sit. Putant intellegebat eu sit. Vix reque tation prompta id, ea quo labore viderer definiebas. Oratio vocibus offendit an mei, est esse pericula liberavisse.", { keyword: "keyword" } ) );
		let AssessmentResults = assessor.getValidResults();
		let assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"introductionKeyword",
			"keywordDensity",
			"metaDescriptionLength",
			"titleKeyword",
			"titleWidth",
			"textLength"
		] );
	} );

	it( "additionally runs assessments that require a keyword and a meta description", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword", description: "description" } ) );
		let AssessmentResults = assessor.getValidResults();
		let assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"introductionKeyword",
			"metaDescriptionKeyword",
			"metaDescriptionLength",
			"titleKeyword",
			"titleWidth",
			"textLength"
		] );
	} );
} );
