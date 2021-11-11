import * as configSlice from "./slice/config";

describe( "Config slice", () => {
	const { initialState, configActions, "default": configReducer } = configSlice;
	const { updateAnalysisType } = configActions;

	test( "should return the analysis config initial state", () => {
		// eslint-disable-next-line no-undefined
		expect( configReducer( undefined, {} ) ).toEqual( initialState );
	} );

	test( "should update the analysisType", () => {
		const result = configReducer( initialState, updateAnalysisType( "term" ) );

		expect( result ).toEqual( {
			...initialState,
			analysisType: "term",
		} );
	} );
} );
