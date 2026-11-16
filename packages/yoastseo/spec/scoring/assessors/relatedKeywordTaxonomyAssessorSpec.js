import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher.js";
import Assessor from "../../../src/scoring/assessors/relatedKeywordTaxonomyAssessor.js";
import Paper from "../../../src/values/Paper.js";
import { checkAssessmentAvailability } from "../../specHelpers/scoring/relatedKeyphraseAssessorTests.js";

const mockPaper = new Paper( "" );
const assessor = new Assessor( new EnglishResearcher( mockPaper ) );

describe( "running assessments in the assessor", function() {
	checkAssessmentAvailability( assessor );
} );

describe( "the image assessments in the related keyphrase taxonomy assessor", () => {
	it( "does not run the keyphrase stuffing in alt text assessment", () => {
		const paper = new Paper( "<p>A category about cats.</p><img src='https://example.com/a.jpg' alt='cat, cat and cat' />", { keyword: "cat" } );
		const taxonomyAssessor = new Assessor( new EnglishResearcher( paper ) );

		taxonomyAssessor.assess( paper );

		expect( taxonomyAssessor.getAssessment( "keyphraseStuffingInAltText" ) ).toBeUndefined();
		expect( taxonomyAssessor.getValidResults().map( result => result.getIdentifier() ) ).not.toContain( "keyphraseStuffingInAltText" );
	} );
} );
