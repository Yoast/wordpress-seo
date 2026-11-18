import { updateAnalysisData, updateShortcodesForParsing } from "../../../src/redux/actions/analysis";
import analysisDataReducer from "../../../src/redux/reducers/analysisData";

describe( "Analysis data reducer", () => {
	it( "has a default state", () => {
		const result = analysisDataReducer( undefined, { type: "undefined" } );

		expect( result ).toEqual( { snippet: {}, timestamp: 0, shortcodesForParsing: [] } );
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

	it( "updates the shortcodes for parsing", () => {
		const action = updateShortcodesForParsing( [ "wpseo_breadcrumb" ] );
		const expected = { shortcodesForParsing: [ "wpseo_breadcrumb" ] };

		const result = analysisDataReducer( {}, action );

		expect( result ).toEqual( expected );
	} );
} );
