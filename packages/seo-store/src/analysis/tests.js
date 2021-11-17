import configReducer, { configActions } from "./slice/config";
import resultsReducer, { analysisActions } from "./slice/results";

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

describe( "Results slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		status: "idle",
		error: "",
		seo: {
			focus: {},
		},
		readability: {},
		research: {
			morphology: {},
		},
	};

	describe( "Reducer", () => {
		test( "should return the analysis results initial state", () => {
			expect( resultsReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the analysis status to loading", () => {
			const { request } = analysisActions;

			const result = resultsReducer( previousState, { type: request } );

			expect( result ).toEqual( {
				...initialState,
				status: "loading",
			} );
		} );

		test( "should update the analysis status to success", () => {
			const { success } = analysisActions;

			const payload = {
				seo: { focus: "test" },
				readability: { test: "test" },
				research: { morphology: { test: "test" } },
			};

			const result = resultsReducer( previousState, { type: success, payload } );

			expect( result ).toEqual( {
				...payload,
				status: "success",
				error: "",
			} );
		} );

		test( "should update the analysis status to error", () => {
			const { error } = analysisActions;

			const result = resultsReducer( previousState, { type: error, payload: "test error" } );

			expect( result ).toEqual( {
				...initialState,
				status: "error",
				error: "test error",
			} );
		} );
	} );
} );
