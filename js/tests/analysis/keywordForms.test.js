import { requestKeywordForms } from "../../src/analysis/keywordForms";

/**
 * Creates a promise that resolves the keyphrase forms for the input keyphrase.
 *
 * @param {string} researchName The name of the research to be executed
 * @param {Paper} paper The paper that contains the keyphrase to be used for analysis
 *
 * @returns {Array} A mock result of the morphological research
 */
const runResearch = ( researchName, paper ) => new Promise( function( resolve, reject ) {
	const keyphrase = paper.getKeyword();
	const researchResult = {
		result: {
			keyphraseForms: [ keyphrase, keyphrase, keyphrase ],
		},
	};
	if ( keyphrase === "failing keyphrase for testing purposes" ) {
		reject();
	} else {
		resolve( researchResult );
	}
} );

describe( "keywordForms", () => {
	it( "runs the mock runResearch and dispatches its result to the store", ( done ) => {
		const store = {
			dispatch: dispatchAction => {
				expect( dispatchAction.keywordForms ).toEqual( [ "test", "test", "test" ] );
				done();
			},
		};

		requestKeywordForms( runResearch, store, "test" );
	} );

	it( "runs the mock runResearch and dispatches an empty array to the store if the runResearch fails", ( done ) => {
		const store = {
			dispatch: dispatchAction => {
				expect( dispatchAction.keywordForms ).toEqual( [] );
				done();
			},
		};

		requestKeywordForms( runResearch, store, "failing keyphrase for testing purposes" );
	} );
} );
