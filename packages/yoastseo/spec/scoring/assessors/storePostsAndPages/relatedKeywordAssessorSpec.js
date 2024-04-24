import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import Assessor from "../../../../src/scoring/assessors/storePostsAndPages/relatedKeywordAssessor";
import Paper from "../../../../src/values/Paper";
import { checkUrls, checkAssessmentAvailability } from "../../../specHelpers/scoring/relatedKeyphraseAssessorTests";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ) );

describe( "running assessments in the assessor", function() {
	checkAssessmentAvailability( assessor );
} );

describe( "has configuration overrides", () => {
	checkUrls( assessor );
} );

