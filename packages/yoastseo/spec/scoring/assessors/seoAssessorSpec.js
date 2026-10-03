import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher.js";
import Assessor from "../../../src/scoring/assessors/seoAssessor.js";
import ValidOnlyResultsScoreAggregator from "../../../src/scoring/scoreAggregators/ValidOnlyResultsScoreAggregator.js";
import AssessmentResult from "../../../src/values/AssessmentResult.js";
import Paper from "../../../src/values/Paper.js";
import { checkAssessmentAvailability, checkUrls } from "../../specHelpers/scoring/seoAssessorTests.js";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ) );

describe( "running assessments in the assessor", function() {
	checkAssessmentAvailability( assessor );
} );

describe( "has the correct assessment URLs", () => {
	checkUrls( assessor );
} );

describe( "score aggregator", () => {
	it( "uses ValidOnlyResultsScoreAggregator so empty results do not dilute the overall score", () => {
		// Researcher is unused for aggregation; pass a stub to avoid loading language packages.
		const seoAssessor = new Assessor( {} );

		expect( seoAssessor.getScoreAggregator() ).toBeInstanceOf( ValidOnlyResultsScoreAggregator );

		// Mirrors functionWordsInKeyphrase on a content-word keyphrase: applicable, but no score/text.
		const results = [
			new AssessmentResult( { score: 9 } ),
			new AssessmentResult(),
			new AssessmentResult( { score: 9 } ),
		];

		expect( seoAssessor.getScoreAggregator().aggregate( results ) ).toBe( 100 );
	} );
} );
