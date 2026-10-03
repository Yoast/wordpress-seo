import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher.js";
import Assessor from "../../../../src/scoring/assessors/productPages/seoAssessor.js";
import Paper from "../../../../src/values/Paper.js";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ), {
	introductionKeyphraseUrlTitle: "https://yoast.com/1",
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
		expect( assessment._config.parameters.recommendedMinimum ).toBe( 4 );
		expect( assessment._config.parameters.recommendedMaximum ).toBe( 6 );
		expect( assessment._config.parameters.acceptableMaximum ).toBe( 8 );
		expect( assessment._config.parameters.acceptableMinimum ).toBe( 2 );
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/3' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/4' target='_blank'>" );
	} );

	test( "KeywordDensityAssessment", () => {
		const assessment = assessor.getAssessment( "keyphraseDensity" );

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
		expect( assessment._config.recommendedMinimum ).toBe( 200 );
		expect( assessment._config.slightlyBelowMinimum ).toBe( 150 );
		expect( assessment._config.belowMinimum ).toBe( 100 );
		expect( assessment._config.veryFarBelowMinimum ).toBe( 50 );
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/15' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/16' target='_blank'>" );
	} );

	test( "KeyphraseInSEOTitleAssessment", () => {
		const assessment = assessor.getAssessment( "keyphraseInSEOTitle" );

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

	test( "SlugKeywordAssessment", () => {
		const assessment = assessor.getAssessment( "slugKeyword" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
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
		expect( assessment._config.scores.okay ).toBe( 6 );
		expect( assessment._config.recommendedCount ).toBe( 4 );
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
} );
