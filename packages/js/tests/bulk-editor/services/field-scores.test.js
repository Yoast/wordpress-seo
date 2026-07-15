import { createFieldScorer } from "../../../src/bulk-editor/services/field-scores";

// The worker is mocked so the service can be tested without the analysis package.
// Jest requires mock-factory-referenced variables to be prefixed with "mock".
const mockAnalyze = jest.fn();
const mockInitialize = jest.fn( () => Promise.resolve() );

jest.mock( "../../../src/analysis/worker", () => ( {
	createAnalysisWorker: () => ( { initialize: mockInitialize, analyze: mockAnalyze } ),
	getAnalysisConfiguration: ( config ) => config,
} ) );

jest.mock( "../../../src/helpers/measureTextWidth", () => ( { __esModule: true, "default": () => 300 } ) );

/**
 * Builds a stubbed transported AssessmentResult.
 *
 * @param {string} identifier The assessment identifier.
 * @param {number} score      The 0-9 score.
 *
 * @returns {Object} The result stub.
 */
const result = ( identifier, score ) => ( {
	_identifier: identifier,
	getScore: () => score,
	hasScore: () => true,
	hasText: () => true,
} );

describe( "createFieldScorer", () => {
	let remoteDataProvider;
	let dataProvider;

	beforeEach( () => {
		mockAnalyze.mockReset();
		mockInitialize.mockClear();
		remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( {} ) ) };
		dataProvider = { getEndpoint: jest.fn( () => "https://example.com/wp-json/yoast/v1/bulk_editor/update_scores" ) };
		global.window.wpseoBulkEditorData = { analysis: { contentLocale: "en_US", keywordAnalysisActive: true } };
	} );

	it( "derives both scores from the analysis and posts them to the score endpoint", async() => {
		mockAnalyze.mockResolvedValue( {
			result: {
				seo: {
					"": {
						results: [
							result( "titleWidth", 9 ),
							result( "keyphraseInSEOTitle", 9 ),
							result( "metaDescriptionKeyword", 9 ),
							result( "metaDescriptionLength", 9 ),
						],
					},
				},
			},
		} );

		const scoreFields = createFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreFields( { id: 7, title: "A title", description: "A description", keyphrase: "seo" } );

		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledWith(
			"https://example.com/wp-json/yoast/v1/bulk_editor/update_scores",
			{},
			expect.objectContaining( {
				method: "POST",
				// eslint-disable-next-line camelcase -- The score endpoint expects snake_case request fields.
				body: JSON.stringify( { items: [ { id: 7, seo_title_score: 100, meta_description_score: 100 } ] } ),
			} )
		);
	} );

	it( "omits a not-derivable (0) score from the request", async() => {
		mockAnalyze.mockResolvedValue( {
			result: { seo: { "": { results: [ result( "titleWidth", 9 ), result( "keyphraseInSEOTitle", 9 ) ] } } },
		} );

		const scoreFields = createFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreFields( { id: 7, title: "A title", description: "", keyphrase: "seo" } );

		const body = JSON.parse( remoteDataProvider.fetchJson.mock.calls[ 0 ][ 2 ].body );
		// eslint-disable-next-line camelcase -- The score endpoint expects snake_case request fields.
		expect( body.items[ 0 ] ).toEqual( { id: 7, seo_title_score: 100 } );
		expect( body.items[ 0 ] ).not.toHaveProperty( "meta_description_score" );
	} );

	it( "does nothing when keyword analysis is inactive", async() => {
		global.window.wpseoBulkEditorData = { analysis: { contentLocale: "en_US", keywordAnalysisActive: false } };

		const scoreFields = createFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreFields( { id: 7, title: "A title", description: "A description", keyphrase: "seo" } );

		expect( mockAnalyze ).not.toHaveBeenCalled();
		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );

	it( "does nothing when the score endpoint is unavailable", async() => {
		dataProvider = { getEndpoint: jest.fn( () => "" ) };

		const scoreFields = createFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreFields( { id: 7, title: "A title", description: "A description", keyphrase: "seo" } );

		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );

	it( "swallows analysis errors so a failed re-score never disrupts editing", async() => {
		mockAnalyze.mockRejectedValue( new Error( "worker boom" ) );

		const scoreFields = createFieldScorer( { dataProvider, remoteDataProvider } );

		await expect( scoreFields( { id: 7, title: "A title", description: "A description", keyphrase: "seo" } ) ).resolves.toBeUndefined();
		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );
} );
