import EnglishResearcher from "../../../../../src/languageProcessing/languages/en/Researcher.js";
import Assessor from "../../../../../src/scoring/assessors/storePostsAndPages/cornerstone/relatedKeywordAssessor.js";
import Paper from "../../../../../src/values/Paper.js";
import { checkUrls, checkAssessmentAvailability } from "../../../../specHelpers/scoring/relatedKeyphraseAssessorTests.js";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ) );

describe( "running assessments in the assessor", function() {
	checkAssessmentAvailability( assessor );
} );

describe( "has configuration overrides", () => {
	checkUrls( assessor );
} );
