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
		test( "should return the initial state", () => {
			expect( configReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the analysis type", () => {
			const { updateAnalysisType } = configActions;

			const result = configReducer( previousState, updateAnalysisType( "term" ) );

			expect( result ).toEqual( {
				...initialState,
				analysisType: "term",
			} );
		} );

		test( "should update whether the SEO analysis is active", () => {
			const { updateIsSeoActive } = configActions;

			const result = configReducer( previousState, updateIsSeoActive( false ) );

			expect( result ).toEqual( {
				...initialState,
				isSeoActive: false,
			} );
		} );

		test( "should update whether the readability analysis is active", () => {
			const { updateIsReadabilityActive } = configActions;

			const result = configReducer( previousState, updateIsReadabilityActive( false ) );

			expect( result ).toEqual( {
				...initialState,
				isReadabilityActive: false,
			} );
		} );

		test( "should add a research", () => {
			const { addResearch } = configActions;

			const result = configReducer( previousState, addResearch( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				researches: [ "morphology", "test" ],
			} );
		} );

		test( "should remove a research", () => {
			const { removeResearch } = configActions;

			const result = configReducer( previousState, removeResearch( "morphology" ) );

			expect( result ).toEqual( {
				...initialState,
				researches: [],
			} );
		} );
	} );
} );
