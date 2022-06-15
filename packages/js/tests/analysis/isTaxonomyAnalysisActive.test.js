import isTaxonomyAnalysisActive from "../../src/analysis/isTaxonomyAnalysisActive";

describe( "A test to check whether the taxonomy assesseor is used for taxonomy terms", () => {
	it( "is not used if the content type is not a taxonomy term", () => {
		let isTerm = false;
		const contentType = isTaxonomyAnalysisActive( isTerm ) ;


		expect( contentType ).toEqual( isTerm );
	} );

	it( "is used if the content type is a taxonomy term", () => {
		let isTerm = true;
		const contentType = isTaxonomyAnalysisActive( isTerm ) ;


		expect( contentType ).toEqual( ! isTerm );
	} );
} );
