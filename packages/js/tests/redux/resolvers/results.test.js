import {
	getSeoResults,
	getResultsForKeyword,
} from "../../../src/redux/selectors/results";

const state = {
	activeKeyword: "active",
	analysis: {
		seo: {
			active: [ "result1", "result2" ],
		},
	},
};

describe( "getSeoResults selector", () => {
	it( "returns the seo results", () => {
		const result = getSeoResults( state );

		expect( result ).toEqual( { active: [ "result1", "result2" ] } );
	} );
} );

describe( "getResultsForKeyword selector", () => {
	it( "returns the seo results", () => {
		const result = getResultsForKeyword( state, "active" );

		expect( result ).toEqual( [ "result1", "result2" ] );
	} );
} );
