import { curry, set } from "lodash";
import configReducer, { configActions } from "./slice/config";
import resultsReducer, { analysisActions, resultsSelectors } from "./slice/results";

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
			expect( configReducer( previousState, {} ) ).toEqual( initialState );
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

describe( "Results slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		status: "idle",
		error: "",
		seo: {
			focus: {
				score: 0,
				results: [],
			},
		},
		readability: {
			score: 0,
			results: [],
		},
		research: {},
		activeMarker: {
			id: "",
			marks: [],
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

			const result = resultsReducer( previousState, { type: success, payload: initialState } );

			expect( result ).toEqual( {
				...initialState,
				status: "success",
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

	describe( "Selectors", () => {
		const createStoreState = curry( set )( {}, "analysis.results" );

		test( "should select the seo results", () => {
			const { selectSeoResults } = resultsSelectors;

			const state = {
				seo: {
					focus: { results: "test" },
				},
			};
			const result = selectSeoResults( createStoreState( state ) );

			expect( result ).toEqual( "test" );
		} );

		test( "should select the readability results", () => {
			const { selectReadabilityResults } = resultsSelectors;

			const state = {
				readability: {
					results: { test: "test" },
				},
			};
			const result = selectReadabilityResults( createStoreState( state ) );

			expect( result ).toEqual( { test: "test" } );
		} );

		test( "should select the research results", () => {
			const { selectResearchResults } = resultsSelectors;

			const state = {
				research: { morphology: "test" },
			};
			const result = selectResearchResults( createStoreState( state ), "morphology" );

			expect( result ).toEqual( "test" );
		} );
	} );
} );
