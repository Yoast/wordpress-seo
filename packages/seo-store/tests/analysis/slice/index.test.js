import analysisReducer, { analysisActions, analysisSelectors } from "../../../src/analysis/slice";

describe( "Analysis slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		config: {},
		results: {},
	};

	describe( "Reducer", () => {
		// No need to test beyond the structure, as that is covered in their own tests.
		test( "should return initial state with config and results", () => {
			expect( analysisReducer( previousState, {} ) ).toMatchObject( initialState );
		} );

		// No need to test beyond the structure, as that is covered in their own tests.
		test( "should include config and results actions", () => {
			[
				"analyze",
				"updateAnalysisType",
				"updateIsSeoActive",
				"updateIsReadabilityActive",
				"addResearch",
				"removeResearch",
				"updateActiveMarker",
			].forEach( ( action ) => {
				expect( analysisActions[ action ] ).toBeDefined();
			} );
		} );
	} );

	describe( "Selectors", () => {
		test( "should select the paper", () => {
			const { selectPaper } = analysisSelectors;

			const result = selectPaper( {
				editor: {
					content: "Test content",
					permalink: "https://example.com",
					date: "2021-12-17T12:00:00.000Z",
				},
				form: {
					seo: {
						title: "SEO title",
						description: "Meta description",
						slug: "test",
					},
				},
			} );

			expect( result ).toMatchObject( {
				content: "Test content",
				seoTitle: "SEO title",
				metaDescription: "Meta description",
				slug: "test",
				permalink: "https://example.com",
				date: "2021-12-17T12:00:00.000Z",
			} );
		} );

		// No need to test beyond the structure, as that is covered in their own tests.
		test( "should include config and results selectors", () => {
			[
				"selectAnalysisConfig",
				"selectAnalysisType",
				"selectIsSeoAnalysisActive",
				"selectIsReadabilityAnalysisActive",
				"selectResearches",
				"selectSeoScore",
				"selectSeoResults",
				"selectReadabilityScore",
				"selectReadabilityResults",
				"selectResearchResults",
				"selectActiveMarker",
				"selectActiveMarkerId",
				"selectActiveMarks",
			].forEach( ( selector ) => {
				expect( analysisSelectors[ selector ] ).toBeDefined();
			} );
		} );
	} );
} );
