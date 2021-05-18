import requestWordsToHighlight from "../../src/analysis/requestWordsToHighlight";

/**
 * Creates a promise that resolves the (mock) keyphrase forms for the input keyphrase.
 *
 * @param {string} researchName The name of the research to be executed.
 * @param {Paper} paper The paper that contains the keyphrase to be used for analysis.
 *
 * @returns {Promise} A promise of the mock results of the morphological research.
 */
const runResearch = ( researchName, paper ) => new Promise( function( resolve, reject ) {
	const keyphrase = paper.getKeyword();
	const researchResult = {
		result: {
			// Return an array that adds numbers 1, 2, 3 to the keyphrase as they were word forms.
			keyphraseForms: [ keyphrase.concat( "1" ), keyphrase.concat( "2" ), keyphrase.concat( "3" ) ],
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
				expect( dispatchAction.wordsToHighlight ).toEqual( [ "test1", "test2", "test3" ] );
				done();
			},
		};

		requestWordsToHighlight( runResearch, store, "test" );
	} );

	it( "runs the mock runResearch and dispatches an empty array to the store if the runResearch fails", ( done ) => {
		const store = {
			dispatch: dispatchAction => {
				expect( dispatchAction.wordsToHighlight ).toEqual( [] );
				done();
			},
		};

		requestWordsToHighlight( runResearch, store, "failing keyphrase for testing purposes" );
	} );
} );
