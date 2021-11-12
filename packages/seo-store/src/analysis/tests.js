import configReducer, { configActions } from "./slice/config";

describe( "Config slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		analysisType: "post",
		isSeoActive: true,
		isReadabilityActive: true,
		researches: [ "morphology" ],
	};

	describe( "Reducer", () => {
		test( "should return the analysis config initial state", () => {
		// eslint-disable-next-line no-undefined
			expect( configReducer( undefined, {} ) ).toEqual( initialState );
		} );

		test( "should update the analysisType", () => {
			const { updateAnalysisType } = configActions;

			const result = configReducer( previousState, updateAnalysisType( "term" ) );

			expect( result ).toEqual( {
				...initialState,
				analysisType: "term",
			} );
		} );
	} );
} );
