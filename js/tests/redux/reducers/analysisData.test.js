import { updateAnalysisData } from "../../../src/redux/actions/analysisData";
import analysisDataReducer from "../../../src/redux/reducers/analysisData";

describe( "Analysis data reducer", () => {
	it( "has a default state", () => {
		const result = analysisDataReducer( undefined, { type: "undefined" } );

		expect( result ).toEqual( { snippet: {} } );
	} );

	it( "ignores unrecognized actions", () => {
		const state = { snippet: {} };

		const result = analysisDataReducer( state, { type: "undefined" } );

		expect( result ).toBe( state );
	} );

	it( "updates the data", () => {
		const action = updateAnalysisData( { title: "Title" } );
		const expected = { snippet: { title: "Title" } };

		const result = analysisDataReducer( {}, action );

		expect( result ).toEqual( expected );
	} );
} );
