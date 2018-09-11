import Assessor from "../../src/cornerstone/seoAssessor.js";
import Paper from "../../src/values/Paper.js";
import factory from "../specHelpers/factory.js";
import getAssessment from "../specHelpers/getAssessment";

const i18n = factory.buildJed();
const assessor = new Assessor( i18n );

describe( "running assessments in the assessor", function() {
	it( "runs assessments without any specific requirements", function() {
		assessor.assess( new Paper( "" ) );
		expect( assessor.getValidResults().length ).toBe( 4 );
	} );

	it( "additionally runs assessments that only require a text", function() {
		assessor.assess( new Paper( "text" ) );
		expect( assessor.getValidResults().length ).toBe( 7 );
	} );

	it( "additionally runs assessments that only require a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		expect( assessor.getValidResults().length ).toBe( 7 );
	} );

	it( "additionally runs assessments that require a long enough text and a keyword and a synonym", function() {
		const text = "a ".repeat( 200 );
		assessor.assess( new Paper( text, { keyword: "keyword", synonyms: "synonym" } ) );
		expect( assessor.getValidResults().length ).toBe( 8 );
	} );

	it( "additionally runs assessments that require text and a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword" } ) );
		expect( assessor.getValidResults().length ).toBe( 7 );
	} );

	it( "additionally runs assessments that require an url", function() {
		assessor.assess( new Paper( "text", { url: "sample url" } ) );
		expect( assessor.getValidResults().length ).toBe( 7 );
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
		expect( assessor.getValidResults().length ).toBe( 8 );
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
		expect( assessor.getValidResults().length ).toBe( 8 );
	} );

	describe( "has configuration overrides", () => {
		test( "MetaDescriptionLengthAssessment", () => {
			const assessment = getAssessment( assessor, "metaDescriptionLength" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.tooLong ).toBe( 3 );
			expect( assessment._config.scores.tooShort ).toBe( 3 );
		} );

		test( "SubHeadingsKeywordAssessment", () => {
			const assessment = getAssessment( assessor, "subheadingsKeyword" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.noMatches ).toBe( 3 );
			expect( assessment._config.scores.oneMatch ).toBe( 6 );
			expect( assessment._config.scores.multipleMatches ).toBe( 9 );
		} );

		test( "TextImagesAssessment", () => {
			const assessment = getAssessment( assessor, "textImages" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.noImages ).toBe( 3 );
			expect( assessment._config.scores.withAltNonKeyword ).toBe( 3 );
			expect( assessment._config.scores.withAlt ).toBe( 3 );
			expect( assessment._config.scores.noAlt ).toBe( 3 );
		} );

		test( "TextLengthAssessment", () => {
			const assessment = getAssessment( assessor, "textLength" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.recommendedMinimum ).toBe( 900 );
			expect( assessment._config.slightlyBelowMinimum ).toBe( 400 );
			expect( assessment._config.belowMinimum ).toBe( 300 );
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.belowMinimum ).toBe( -20 );
			expect( assessment._config.scores.farBelowMinimum ).toBe( -20 );
		} );

		test( "OutboundLinksAssessment", () => {
			const assessment = getAssessment( assessor, "externalLinks" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.noLinks ).toBe( 3 );
		} );

		test( "PageTitleWidthAssesment", () => {
			const assessment = getAssessment( assessor, "titleWidth" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.widthTooShort ).toBe( 3 );
			expect( assessment._config.scores.widthTooLong ).toBe( 3 );
		} );

		test( "UrlKeywordAssessment", () => {
			const assessment = getAssessment( assessor, "urlKeyword" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.noKeywordInUrl ).toBe( 3 );
		} );

		test( "UrlLengthAssessment", () => {
			const assessment = getAssessment( assessor, "urlLength" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.tooLong ).toBe( 3 );
		} );
	} );
} );
