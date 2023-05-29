import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import Assessor from "../../../../src/scoring/collectionPages/cornerstone/seoAssessor.js";
import Paper from "../../../../src/values/Paper.js";
import { checkAssessmentAvailability, checkUrls } from "../../../specHelpers/scoring/seoAssessorTests";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ) );

describe( "running assessments in the collection page cornerstone SEO assessor", function() {
	checkAssessmentAvailability( assessor, true );
} );

describe( "has the correct configuration overrides", () => {
	test( "MetaDescriptionLengthAssessment", () => {
		const assessment = assessor.getAssessment( "metaDescriptionLength" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.tooLong ).toBe( 6 );
		expect( assessment._config.scores.tooShort ).toBe( 6 );
	} );

	test( "TextLengthAssessment", () => {
		const assessment = assessor.getAssessment( "textLength" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.recommendedMinimum ).toBe( 100 );
		expect( assessment._config.slightlyBelowMinimum ).toBe( 80 );
		expect( assessment._config.belowMinimum ).toBe( 50 );
		expect( assessment._config.veryFarBelowMinimum ).toBe( 20 );
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.belowMinimum ).toBe( 3 );
		expect( assessment._config.scores.farBelowMinimum ).toBe( -10 );
		expect( assessment._config.cornerstoneContent ).toBeDefined();
		expect( assessment._config.cornerstoneContent ).toBeTruthy();
	} );

	test( "PageTitleWidthAssessment", () => {
		const assessment = assessor.getAssessment( "titleWidth" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.widthTooShort ).toBe( 9 );
		expect( assessment._config.scores.widthTooLong ).toBe( 3 );
	} );

	test( "SlugKeywordAssessment", () => {
		const assessment = assessor.getAssessment( "slugKeyword" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.okay ).toBe( 6 );
	} );
} );

describe( "has the correct assessment URLs", () => {
	checkUrls( assessor, true );
} );
