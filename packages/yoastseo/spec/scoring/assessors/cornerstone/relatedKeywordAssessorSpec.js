import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher.js";
import Assessor from "../../../../src/scoring/assessors/cornerstone/relatedKeywordAssessor.js";
import Paper from "../../../../src/values/Paper.js";
import { checkAssessmentAvailability } from "../../../specHelpers/scoring/relatedKeyphraseAssessorTests.js";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ) );

describe( "running assessments in the assessor", function() {
	checkAssessmentAvailability( assessor );
} );

describe( "has configuration overrides", () => {
	test( "KeyphraseLength", () => {
		const assessment = assessor.getAssessment( "keyphraseLength" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.isRelatedKeyphrase ).toBeTruthy();
	} );

	test( "ImageKeyphrase", () => {
		const assessment = assessor.getAssessment( "imageKeyphrase" );

		expect( assessment ).toBeDefined();
		expect( assessment._config ).toBeDefined();
		expect( assessment._config.scores.withAltNonKeyword ).toBe( 3 );
		expect( assessment._config.scores.withAlt ).toBe( 3 );
		expect( assessment._config.scores.noAlt ).toBe( 3 );
	} );
} );
