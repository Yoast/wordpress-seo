import configReducer, { configActions } from "./slice/config";

describe( "Config slice", () => {
	const { updateAnalysisType } = configActions;

	const initialState = {
		analysisType: "post",
		isSeoActive: true,
		isReadabilityActive: true,
		researches: [ "morphology" ],
	};

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
