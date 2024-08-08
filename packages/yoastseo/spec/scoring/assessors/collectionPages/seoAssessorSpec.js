import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher.js";
import Assessor from "../../../../src/scoring/assessors/collectionPages/seoAssessor.js";
import Paper from "../../../../src/values/Paper.js";
import { checkAssessmentAvailability, checkUrls } from "../../../specHelpers/scoring/seoAssessorTests.js";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ) );

describe( "running assessments in the collection page SEO assessor", function() {
	checkAssessmentAvailability( assessor, true );
} );

describe( "has the correct configuration overrides", () => {
	test( "TextLengthAssessment", () => {
		const assessment = assessor.getAssessment( "textLength" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.recommendedMinimum ).toBe( 30 );
		expect( assessment._config.slightlyBelowMinimum ).toBe( 10 );
		expect( assessment._config.veryFarBelowMinimum ).toBe( 1 );
		expect( assessment._config.scores ).toBeDefined();
		expect( assessment._config.scores.recommendedMinimum ).toBe( 9 );
		expect( assessment._config.scores.slightlyBelowMinimum ).toBe( 6 );
		expect( assessment._config.scores.belowMinimum ).toBe( 3 );
		expect( assessment._config.scores.veryFarBelowMinimum ).toBe( -20 );
		expect( assessment._config.cornerstoneContent ).toBeDefined();
		expect( assessment._config.cornerstoneContent ).toBeFalsy();
	} );
} );

describe( "has the correct assessment URLs", () => {
	checkUrls( assessor, true );
} );
