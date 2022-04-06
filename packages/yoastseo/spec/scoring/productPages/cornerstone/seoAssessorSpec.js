import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import Assessor from "../../../../src/scoring/productPages/cornerstone/seoAssessor.js";
import Paper from "../../../../src/values/Paper.js";
import getResults from "../../../specHelpers/getAssessorResults";

describe( "running assessments in the product page SEO assessor", function() {
	let assessor;

	beforeEach( () => {
		assessor = new Assessor( new EnglishResearcher(), { introductionKeyphraseUrlTitle: "https://yoast.com/1",
			introductionKeyphraseCTAUrl: "https://yoast.com/2",
			keyphraseLengthUrlTitle: "https://yoast.com/3",
			keyphraseLengthCTAUrl: "https://yoast.com/4",
			keyphraseDensityUrlTitle: "https://yoast.com/5",
			keyphraseDensityCTAUrl: "https://yoast.com/6",
			metaDescriptionKeyphraseUrlTitle: "https://yoast.com/7",
			metaDescriptionKeyphraseCTAUrl: "https://yoast.com/8",
			metaDescriptionLengthUrlTitle: "https://yoast.com/9",
			metaDescriptionLengthCTAUrl: "https://yoast.com/10",
			subheadingsKeyphraseUrlTitle: "https://yoast.com/11",
			subheadingsKeyphraseCTAUrl: "https://yoast.com/12",
			textCompetingLinksUrlTitle: "https://yoast.com/13",
			textCompetingLinksCTAUrl: "https://yoast.com/14",
			textLengthUrlTitle: "https://yoast.com/15",
			textLengthCTAUrl: "https://yoast.com/16",
			titleKeyphraseUrlTitle: "https://yoast.com/17",
			titleKeyphraseCTAUrl: "https://yoast.com/18",
			titleWidthUrlTitle: "https://yoast.com/19",
			titleWidthCTAUrl: "https://yoast.com/20",
			urlKeyphraseUrlTitle: "https://yoast.com/21",
			urlKeyphraseCTAUrl: "https://yoast.com/22",
			functionWordsInKeyphraseUrlTitle: "https://yoast.com/23",
			functionWordsInKeyphraseCTAUrl: "https://yoast.com/24",
			singleH1UrlTitle: "https://yoast.com/25",
			singleH1CTAUrl: "https://yoast.com/26",
			imageCountUrlTitle: "https://yoast.com/27",
			imageCountCTAUrl: "https://yoast.com/28",
			imageKeyphraseUrlTitle: "https://yoast.com/29",
			imageKeyphraseCTAUrl: "https://yoast.com/30",
			imageAltTagsUrlTitle: "https://yoast.com/31",
			imageAltTagsCTAUrl: "https://yoast.com/32",
			keyphraseDistributionUrlTitle: "https://yoast.com/33",
			keyphraseDistributionCTAUrl: "https://yoast.com/34",
		} );
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
			"images",
		] );
	} );

	it( "additionally returns a singleH1Assessment if the text contains two h1s", function() {
		assessor.assess( new Paper( "<h1>Title1</h1><h1>Title2</h1>" ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
			"singleH1",
			"images",
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
			"images",
		] );
	} );

	it( "additionally runs assessments that require a keyword with function words only", function() {
		assessor.assess( new Paper( "", { keyword: "a" } ) );
		const assessments = getResults( assessor.getValidResults() );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
			"functionWordsInKeyphrase",
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
			"textLength",
			"titleWidth",
			"images",
		] );
	} );

	it( "additionally runs assessments that require a text and a long url with stop words", function() {
		assessor.assess( new Paper( "text",
			{ slug: "a-sample-slug-a-sample-slug-a-sample-slug-a-sample-slug-a-sample-slug-a-sample-slug-a-sample-slug-a-sample-slug" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
			"images",
		] );
	} );

	it( "additionally runs assessments that require a text, a url and a keyword", function() {
		assessor.assess( new Paper( "text", { keyword: "keyword", slug: "sample-slug" } ) );
		const AssessmentResults = assessor.getValidResults();
		const assessments = getResults( AssessmentResults );

		expect( assessments ).toEqual( [
			"introductionKeyword",
			"keyphraseLength",
			"metaDescriptionLength",
			"textLength",
			"titleWidth",
			"urlKeyword",
			"images",
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
			"textLength",
			"titleWidth",
			"images",
			"keyphraseDistribution",
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
			"textLength",
			"titleWidth",
			"images",
			"keyphraseDistribution",
		] );
	} );

	describe( "has configuration overrides", () => {
		test( "IntroductionKeywordAssessment", () => {
			const assessment = assessor.getAssessment( "introductionKeyword" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/1' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/2' target='_blank'>" );
		} );

		test( "KeyphraseLengthAssessment", () => {
			const assessment = assessor.getAssessment( "keyphraseLength" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/3' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/4' target='_blank'>" );
		} );

		test( "KeywordDensityAssessment", () => {
			const assessment = assessor.getAssessment( "keywordDensity" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/5' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/6' target='_blank'>" );
		} );

		test( "MetaDescriptionKeywordAssessment", () => {
			const assessment = assessor.getAssessment( "metaDescriptionKeyword" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/7' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/8' target='_blank'>" );
		} );

		test( "MetaDescriptionLengthAssessment", () => {
			const assessment = assessor.getAssessment( "metaDescriptionLength" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.tooLong ).toBe( 3 );
			expect( assessment._config.scores.tooShort ).toBe( 3 );
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/9' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/10' target='_blank'>" );
		} );

		test( "SubheadingsKeyword", () => {
			const assessment = assessor.getAssessment( "subheadingsKeyword" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/11' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/12' target='_blank'>" );
		} );

		test( "TextCompetingLinksAssessment", () => {
			const assessment = assessor.getAssessment( "textCompetingLinks" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/13' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/14' target='_blank'>" );
		} );

		test( "TextLengthAssessment", () => {
			const assessment = assessor.getAssessment( "textLength" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.recommendedMinimum ).toBe( 400 );
			expect( assessment._config.slightlyBelowMinimum ).toBe( 300 );
			expect( assessment._config.belowMinimum ).toBe( 200 );
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.belowMinimum ).toBe( -20 );
			expect( assessment._config.scores.farBelowMinimum ).toBe( -20 );
			expect( assessment._config.cornerstoneContent ).toBeDefined();
			expect( assessment._config.cornerstoneContent ).toBeTruthy();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/15' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/16' target='_blank'>" );
		} );

		test( "TitleKeywordAssessment", () => {
			const assessment = assessor.getAssessment( "titleKeyword" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/17' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/18' target='_blank'>" );
		} );

		test( "PageTitleWidthAssesment", () => {
			const assessment = assessor.getAssessment( "titleWidth" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.widthTooShort ).toBe( 9 );
			expect( assessment._allowShortTitle ).toBe( true );
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/19' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/20' target='_blank'>" );
		} );

		test( "UrlKeywordAssessment", () => {
			const assessment = assessor.getAssessment( "urlKeyword" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.scores ).toBeDefined();
			expect( assessment._config.scores.okay ).toBe( 3 );
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/21' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/22' target='_blank'>" );
		} );

		test( "FunctionWordsInKeyphrase", () => {
			const assessment = assessor.getAssessment( "functionWordsInKeyphrase" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/23' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/24' target='_blank'>" );
		} );

		test( "SingleH1Assessment", () => {
			const assessment = assessor.getAssessment( "singleH1" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/25' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/26' target='_blank'>" );
		} );

		test( "ImageCount", () => {
			const assessment = assessor.getAssessment( "images" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/27' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/28' target='_blank'>" );
		} );

		test( "ImageKeyphrase", () => {
			const assessment = assessor.getAssessment( "imageKeyphrase" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/29' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/30' target='_blank'>" );
		} );

		test( "ImageAltTags", () => {
			const assessment = assessor.getAssessment( "imageAltTags" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/31' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/32' target='_blank'>" );
		} );

		test( "KeyphraseDistribution", () => {
			const assessment = assessor.getAssessment( "keyphraseDistribution" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/33' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/34' target='_blank'>" );
		} );
	} );
} );
