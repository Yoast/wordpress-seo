import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration";
import { SCORES } from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/scores";

describe( "Test for all assessments", function() {
	it( "makes sure the feedback for all non-inclusive phrases starts with 'Avoid using...'", function() {
		assessments.forEach( assessment => {
			if ( assessment.score === SCORES.NON_INCLUSIVE ) {
				expect( assessment.feedbackFormat ).toMatch( /^Avoid using/ );
			}
		} );
	} );
	it( "makes sure the feedback for all potentially non-inclusive phrases starts with 'Be careful when using...'", function() {
		assessments.forEach( assessment => {
			if ( assessment.score === SCORES.POTENTIALLY_NON_INCLUSIVE ) {
				if ( assessment.feedbackFormat.match( /^Avoid using/ ) ) {
					console.log( assessment );
				}
				expect( assessment.feedbackFormat ).toMatch( /^Be careful when using/ );
			}
		} );
	} );
} );
