import {
	getSeoResults,
	getActiveKeyword,
	getResultsForKeyword,
} from "../../../src/redux/selectors/results";

let state = {
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


describe( "getActiveKeyword selector", () => {
	it( "returns the active keyword", () => {
		const result = getActiveKeyword( state );

		expect( result ).toEqual( "active" );
	} );
} );

describe( "getResultsForKeyword selector", () => {
	it( "returns the seo results", () => {
		const result = getResultsForKeyword( state, "active" );

		expect( result ).toEqual( [ "result1", "result2" ] );
	} );
} );
