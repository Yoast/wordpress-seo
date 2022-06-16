import isTaxonomyAnalysisActive from "../../src/analysis/isTaxonomyAnalysisActive";

describe( "A test to check whether the taxonomy assesseor is used for taxonomy terms", () => {
	it( "is not used if the content type is not a taxonomy term", () => {
		// Set the right data on the (mocked) window object.
		window.wpseoScriptData = {
			metabox: {
				isTerm: 0,
			},
		};

		expect( isTaxonomyAnalysisActive() ).toEqual( false );
	} );

	it( "is used if the content type is a taxonomy term", () => {
		// Set the right data on the (mocked) window object.
		window.wpseoScriptData = {
			metabox: {
				isTerm: 1,
			},
		};

		expect( isTaxonomyAnalysisActive() ).toEqual( true );
	} );
} );
