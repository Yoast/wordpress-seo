import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import Assessor from "../../../src/scoring/assessors/seoAssessor";
import Paper from "../../../src/values/Paper";
import { checkAssessmentAvailability, checkUrls } from "../../specHelpers/scoring/seoAssessorTests";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ) );

describe( "running assessments in the assessor", function() {
	checkAssessmentAvailability( assessor );
} );

describe( "has the correct assessment URLs", () => {
	checkUrls( assessor );
} );
