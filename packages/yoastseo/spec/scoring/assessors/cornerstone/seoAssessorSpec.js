import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher.js";
import Assessor from "../../../../src/scoring/assessors/cornerstone/seoAssessor.js";
import Paper from "../../../../src/values/Paper.js";
import { checkAssessmentAvailability, checkConfigOverrides, checkUrls } from "../../../specHelpers/scoring/seoAssessorTests.js";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ) );

describe( "running assessments in the assessor", function() {
	checkAssessmentAvailability( assessor );
} );

describe( "has configuration overrides", () => {
	checkConfigOverrides( assessor );
} );

describe( "has the correct assessment URLs", () => {
	checkUrls( assessor );
} );
