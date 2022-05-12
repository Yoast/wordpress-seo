import { curry, set } from "lodash";
import registerSeoStore from "../../../src";
import resultsReducer, {
	analysisAsyncActions,
	analyze as analyzeGenerator,
	resultsActions,
	resultsSelectors,
} from "../../../src/analysis/slice/results";

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
			status: "hidden",
			id: "",
			marks: [],
		},
	};

	describe( "Reducer", () => {
		test( "should return the initial state", () => {
			expect( resultsReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the active marker", () => {
			const { updateActiveMarker } = resultsActions;

			const payload = {
				id: "1",
				marks: [ "test" ],
			};
			const result = resultsReducer( previousState, updateActiveMarker( payload ) );

			expect( result.activeMarker.id ).toEqual( "1" );
			expect( result.activeMarker.marks ).toEqual( [ "test" ] );
		} );

		test( "should update the marker status", () => {
			const { updateMarkerStatus } = resultsActions;

			const payload = "enabled";
			const result = resultsReducer( previousState, updateMarkerStatus( payload ) );
			expect( result.activeMarker.status ).toEqual( "enabled" );
		} );

		test( "should update the status to loading", () => {
			const { request } = analysisAsyncActions;

			const result = resultsReducer( previousState, { type: request } );

			expect( result ).toEqual( {
				...initialState,
				status: "loading",
			} );
		} );

		test( "should update the status to success", () => {
			const { success } = analysisAsyncActions;

			const result = resultsReducer( previousState, { type: success, payload: initialState } );

			expect( result ).toEqual( {
				...initialState,
				status: "success",
			} );
		} );

		test( "should update the status to error", () => {
			const { error } = analysisAsyncActions;

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

		test( "should select the seo score", () => {
			const { selectSeoScore } = resultsSelectors;

			const state = {
				seo: {
					focus: { score: 9000 },
				},
			};
			const result = selectSeoScore( createStoreState( state ) );

			expect( result ).toEqual( 9000 );
		} );

		test( "should select the seo results", () => {
			const { selectSeoResults } = resultsSelectors;

			const state = {
				seo: {
					focus: { results: [ "test" ] },
				},
			};
			const result = selectSeoResults( createStoreState( state ) );

			expect( result ).toEqual( [ "test" ] );
		} );

		test( "should select the readability score", () => {
			const { selectReadabilityScore } = resultsSelectors;

			const state = {
				readability: {
					score: 9000,
				},
			};
			const result = selectReadabilityScore( createStoreState( state ) );

			expect( result ).toEqual( 9000 );
		} );

		test( "should select the readability results", () => {
			const { selectReadabilityResults } = resultsSelectors;

			const state = {
				readability: {
					results: [ "test" ],
				},
			};
			const result = selectReadabilityResults( createStoreState( state ) );

			expect( result ).toEqual( [ "test" ] );
		} );

		test( "should select the research results", () => {
			const { selectResearchResults } = resultsSelectors;

			const state = {
				research: {
					morphology: {
						data: {},
						result: "test",
					},
				},
			};
			const result = selectResearchResults( createStoreState( state ), "morphology" );

			expect( result ).toEqual( "test" );
		} );

		test( "should select the active marker", () => {
			const { selectActiveMarker } = resultsSelectors;

			const state = {
				activeMarker: {
					id: "1",
					marks: [ "test" ],
				},
			};
			const result = selectActiveMarker( createStoreState( state ) );

			expect( result ).toEqual( { id: "1", marks: [ "test" ] } );
		} );

		test( "should select the active marker id", () => {
			const { selectActiveMarkerId } = resultsSelectors;

			const state = {
				activeMarker: {
					id: "1",
				},
			};
			const result = selectActiveMarkerId( createStoreState( state ) );

			expect( result ).toEqual( "1" );
		} );

		test( "should select the active marks", () => {
			const { selectActiveMarks } = resultsSelectors;

			const state = {
				activeMarker: {
					marks: [ "test" ],
				},
			};
			const result = selectActiveMarks( createStoreState( state ) );

			expect( result ).toEqual( [ "test" ] );
		} );

		test( "should select the marker status", () => {
			const { selectMarkerStatus } = resultsSelectors;

			const state = {
				activeMarker: {
					status: "enabled",
				},
			};
			const result = selectMarkerStatus( createStoreState( state ) );

			expect( result ).toEqual( "enabled" );
		} );
	} );

	describe( "Analyze generator", () => {
		beforeAll( () => {
			registerSeoStore( {
				analyze: () => ( {
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
					research: {
						morphology: {},
					},
				} ),
			} );
		} );

		test( "should perform the required analyze steps", () => {
			const generator = analyzeGenerator();
			const paper = {
				content: "",
				seoTitle: "",
				metaDescription: "",
				slug: "",
				permalink: "",
				date: "",
			};
			const results = { paper: {}, keyphrases: {}, config: {} };
			let result;

			// 1. Request action.
			result = generator.next();
			expect( result.value ).toEqual( { type: analysisAsyncActions.request } );

			// 2. Select paper.
			result = generator.next( result.value );
			expect( result.value ).toEqual( paper );

			// 3. Select keyphrases.
			result = generator.next( result.value );
			expect( result.value ).toEqual( {
				focus: {
					id: "focus",
					keyphrase: "",
					synonyms: "",
				},
			} );

			// 4. Select config.
			result = generator.next( result.value );
			expect( result.value ).toEqual( {
				analysisType: "post",
				isSeoActive: true,
				isReadabilityActive: true,
				researches: [ "morphology" ],
			} );

			// 5. Prepared paper.
			result = generator.next( result.value );
			expect( result.value ).toEqual( paper );

			// 6. Analyze results.
			result = generator.next( result.value );
			expect( result.value ).toMatchObject( { type: "analyze", payload: results } );

			// 7. Processed results.
			result = generator.next( results );
			expect( result.value ).toMatchObject( results );

			// 8. Success action.
			result = generator.next();
			expect( result.value ).toEqual( { type: analysisAsyncActions.success } );
			expect( result.done ).toBe( true );
		} );
	} );
} );
