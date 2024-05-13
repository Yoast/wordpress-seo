import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher.js";
import Assessor from "../../../../../src/scoring/assessors/productPages/cornerstone/relatedKeywordAssessor.js";
import Paper from "../../../../../src/values/Paper.js";
import { checkAssessmentAvailability } from "../../../../specHelpers/scoring/relatedKeyphraseAssessorTests.js";

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
	textCompetingLinksUrlTitle: "https://yoast.com/9",
	textCompetingLinksCTAUrl: "https://yoast.com/10",
	functionWordsInKeyphraseUrlTitle: "https://yoast.com/11",
	functionWordsInKeyphraseCTAUrl: "https://yoast.com/12",
	imageKeyphraseUrlTitle: "https://yoast.com/13",
	imageKeyphraseCTAUrl: "https://yoast.com/14",
} );

describe( "running assessments in the cornerstone related keyword product assessor", function() {
	checkAssessmentAvailability( assessor );
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

	test( "KeyphraseDensityAssessment", () => {
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

	test( "TextCompetingLinks", () => {
		const assessment = assessor.getAssessment( "textCompetingLinks" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/9' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/10' target='_blank'>" );
	} );

	test( "FunctionWordsInKeyphrase", () => {
		const assessment = assessor.getAssessment( "functionWordsInKeyphrase" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/11' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/12' target='_blank'>" );
	} );

	test( "ImageKeyphrase", () => {
		const assessment = assessor.getAssessment( "imageKeyphrase" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.urlTitle ).toBe( "<a href='https://yoast.com/13' target='_blank'>" );
		expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoast.com/14' target='_blank'>" );
	} );
} );
