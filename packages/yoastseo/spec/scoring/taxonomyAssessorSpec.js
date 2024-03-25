import EnglishResearcher from "../../src/languageProcessing/languages/en/Researcher";
import Assessor from "../../src/scoring/taxonomyAssessor.js";
import Paper from "../../src/values/Paper.js";
import { checkAssessmentAvailability, checkUrls } from "../specHelpers/scoring/seoAssessorTests";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ) );

describe( "running assessments in the assessor", function() {
	checkAssessmentAvailability( assessor );
} );

describe( "has the correct configuration overrides", () => {
	test( "TextLengthAssessment", () => {
		const assessment = assessor.getAssessment( "textLength" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.recommendedMinimum ).toBe( 30 );
		expect( assessment._config.slightlyBelowMinimum ).toBe( 10 );
		expect( assessment._config.veryFarBelowMinimum ).toBe( 1 );
		expect( assessment._config.customContentType ).toBe( "taxonomyAssessor" );
	} );
} );

describe( "has the correct assessment URLs", () => {
	checkUrls( assessor );
} );
