import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher.js";
import Assessor from "../../../../../src/scoring/assessors/storeBlog/cornerstone/seoAssessor.js";
import Paper from "../../../../../src/values/Paper.js";
import { checkAssessmentAvailability, checkUrls } from "../../../../specHelpers/scoring/seoAssessorTests.js";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ) );

describe( "running assessments in the store blog cornerstone SEO assessor", function() {
	checkAssessmentAvailability( assessor, true );
} );

describe( "has the correct configuration overrides", () => {
	test( "MetaDescriptionLengthAssessment", () => {
		const assessment = assessor.getAssessment( "metaDescriptionLength" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.tooLong ).toBe( 3 );
		expect( assessment._config.scores.tooShort ).toBe( 3 );
	} );

	test( "PageTitleWidthAssesment", () => {
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
		expect( assessment._config.scores.okay ).toBe( 3 );
	} );
} );

describe( "has the correct assessment URLs", () => {
	checkUrls( assessor, true );
} );
