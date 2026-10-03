/* eslint-disable jsdoc/require-jsdoc -- Inline test doubles do not need JSDoc. */
// The researcher is a module-level singleton; the module is reset per test (see beforeEach) so each test
// starts with a fresh researcher and can observe the researcher filter being applied.
let createFieldScorer;
let createSingleFieldScorer;

// The analysis package and hooks are mocked so the service can be tested in isolation.
// Jest requires mock-factory-referenced variables to be prefixed with "mock".
const mockApplyFilters = jest.fn( ( hookName, value ) => value );
const mockSeoTitleAssess = jest.fn();
const mockMetaAssess = jest.fn();
let mockSeoTitleScore = 0;
let mockMetaScore = 0;

jest.mock( "@wordpress/hooks", () => ( { applyFilters: ( ...args ) => mockApplyFilters( ...args ) } ) );

jest.mock( "yoastseo", () => ( {
	Paper: class {
		constructor( text, attributes ) {
			this.text = text;
			this.attributes = attributes;
		}
	},
	assessors: {
		SeoTitleAssessor: class {
			assess( paper ) {
				mockSeoTitleAssess( paper );
			}
			calculateOverallScore() {
				return mockSeoTitleScore;
			}
		},
		MetaDescriptionAssessor: class {
			assess( paper ) {
				mockMetaAssess( paper );
			}
			calculateOverallScore() {
				return mockMetaScore;
			}
		},
	},
} ) );

jest.mock( "../../../src/helpers/measureTextWidth", () => ( { __esModule: true, "default": () => 300 } ) );

describe( "createFieldScorer", () => {
	let remoteDataProvider;
	let dataProvider;

	beforeEach( () => {
		jest.resetModules();
		createFieldScorer = require( "../../../src/bulk-editor/services/field-scores" ).createFieldScorer;
		mockApplyFilters.mockClear();
		mockSeoTitleAssess.mockReset();
		mockMetaAssess.mockReset();
		mockSeoTitleScore = 63;
		mockMetaScore = 85;
		remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( {} ) ) };
		dataProvider = { getEndpoint: jest.fn( () => "https://example.com/wp-json/yoast/v1/bulk_editor/update_scores" ) };
		global.window.yoast = { Researcher: { "default": class {} } };
		global.window.wpseoBulkEditorData = { analysis: { contentLocale: "en_US", keywordAnalysisActive: true } };
	} );

	it( "runs the two field assessors and posts their scores to the score endpoint", async() => {
		const scoreFields = createFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreFields( { id: 7, title: "A title", description: "A description", keyphrase: "seo" } );

		expect( mockSeoTitleAssess ).toHaveBeenCalledTimes( 1 );
		expect( mockMetaAssess ).toHaveBeenCalledTimes( 1 );
		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledWith(
			"https://example.com/wp-json/yoast/v1/bulk_editor/update_scores",
			{},
			expect.objectContaining( {
				method: "POST",
				// eslint-disable-next-line camelcase -- The score endpoint expects snake_case request fields.
				body: JSON.stringify( { items: [ { id: 7, seo_title_score: 63, meta_description_score: 85 } ] } ),
			} )
		);
	} );

	it( "lets Premium augment the researcher through the configure-researcher filter", async() => {
		const configure = jest.fn();
		mockApplyFilters.mockReturnValueOnce( configure );

		const scoreFields = createFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreFields( { id: 7, title: "A title", description: "A description", keyphrase: "seo" } );

		// The filter is asked for a configurator, which then receives our researcher and the locale.
		expect( mockApplyFilters ).toHaveBeenCalledWith( "yoast.bulkEditor.analysis.configureResearcher", expect.any( Function ) );
		expect( configure ).toHaveBeenCalledWith( expect.anything(), "en_US" );
	} );

	it( "omits a not-derivable (0) score from the request", async() => {
		mockMetaScore = 0;

		const scoreFields = createFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreFields( { id: 7, title: "A title", description: "", keyphrase: "seo" } );

		const body = JSON.parse( remoteDataProvider.fetchJson.mock.calls[ 0 ][ 2 ].body );
		// eslint-disable-next-line camelcase -- The score endpoint expects snake_case request fields.
		expect( body.items[ 0 ] ).toEqual( { id: 7, seo_title_score: 63 } );
		expect( body.items[ 0 ] ).not.toHaveProperty( "meta_description_score" );
	} );

	it( "does nothing when keyword analysis is inactive", async() => {
		global.window.wpseoBulkEditorData = { analysis: { contentLocale: "en_US", keywordAnalysisActive: false } };

		const scoreFields = createFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreFields( { id: 7, title: "A title", description: "A description", keyphrase: "seo" } );

		expect( mockSeoTitleAssess ).not.toHaveBeenCalled();
		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );

	it( "does nothing when the score endpoint is unavailable", async() => {
		dataProvider = { getEndpoint: jest.fn( () => "" ) };

		const scoreFields = createFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreFields( { id: 7, title: "A title", description: "A description", keyphrase: "seo" } );

		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );

	it( "swallows assessment errors so a failed re-score never disrupts editing", async() => {
		mockSeoTitleAssess.mockImplementation( () => {
			throw new Error( "assess boom" );
		} );

		const scoreFields = createFieldScorer( { dataProvider, remoteDataProvider } );

		await expect( scoreFields( { id: 7, title: "A title", description: "A description", keyphrase: "seo" } ) ).resolves.toBeUndefined();
		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );
} );

describe( "createSingleFieldScorer", () => {
	let remoteDataProvider;
	let dataProvider;

	beforeEach( () => {
		jest.resetModules();
		createSingleFieldScorer = require( "../../../src/bulk-editor/services/field-scores" ).createSingleFieldScorer;
		mockApplyFilters.mockClear();
		mockSeoTitleAssess.mockReset();
		mockMetaAssess.mockReset();
		mockSeoTitleScore = 63;
		mockMetaScore = 85;
		remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( {} ) ) };
		dataProvider = { getEndpoint: jest.fn( () => "https://example.com/wp-json/yoast/v1/bulk_editor/update_scores" ) };
		global.window.yoast = { Researcher: { "default": class {} } };
		global.window.wpseoBulkEditorData = { analysis: { contentLocale: "en_US", keywordAnalysisActive: true } };
	} );

	it( "scores only the applied SEO title and posts only its score", async() => {
		const scoreField = createSingleFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreField( { id: 7, fieldKey: "seoTitle", value: "An AI title", keyphrase: "seo" } );

		// Only the title assessor runs; the meta description score is left untouched.
		expect( mockSeoTitleAssess ).toHaveBeenCalledTimes( 1 );
		expect( mockMetaAssess ).not.toHaveBeenCalled();
		const body = JSON.parse( remoteDataProvider.fetchJson.mock.calls[ 0 ][ 2 ].body );
		// eslint-disable-next-line camelcase -- The score endpoint expects snake_case request fields.
		expect( body.items[ 0 ] ).toEqual( { id: 7, seo_title_score: 63 } );
	} );

	it( "scores only the applied meta description and posts only its score", async() => {
		const scoreField = createSingleFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreField( { id: 7, fieldKey: "metaDescription", value: "An AI description", keyphrase: "seo" } );

		expect( mockMetaAssess ).toHaveBeenCalledTimes( 1 );
		expect( mockSeoTitleAssess ).not.toHaveBeenCalled();
		const body = JSON.parse( remoteDataProvider.fetchJson.mock.calls[ 0 ][ 2 ].body );
		// eslint-disable-next-line camelcase -- The score endpoint expects snake_case request fields.
		expect( body.items[ 0 ] ).toEqual( { id: 7, meta_description_score: 85 } );
	} );

	it( "does nothing for a field without a per-field score (e.g. a social field)", async() => {
		const scoreField = createSingleFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreField( { id: 7, fieldKey: "socialTitle", value: "A social title", keyphrase: "seo" } );

		expect( mockSeoTitleAssess ).not.toHaveBeenCalled();
		expect( mockMetaAssess ).not.toHaveBeenCalled();
		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );

	it( "omits a not-derivable (0) score, so the never-scored sentinel is not persisted", async() => {
		mockSeoTitleScore = 0;

		const scoreField = createSingleFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreField( { id: 7, fieldKey: "seoTitle", value: "An AI title", keyphrase: "seo" } );

		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );

	it( "does nothing when keyword analysis is inactive", async() => {
		global.window.wpseoBulkEditorData = { analysis: { contentLocale: "en_US", keywordAnalysisActive: false } };

		const scoreField = createSingleFieldScorer( { dataProvider, remoteDataProvider } );
		await scoreField( { id: 7, fieldKey: "seoTitle", value: "An AI title", keyphrase: "seo" } );

		expect( mockSeoTitleAssess ).not.toHaveBeenCalled();
		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );

	it( "swallows assessment errors so a failed re-score never disrupts editing", async() => {
		mockSeoTitleAssess.mockImplementation( () => {
			throw new Error( "assess boom" );
		} );

		const scoreField = createSingleFieldScorer( { dataProvider, remoteDataProvider } );

		await expect( scoreField( { id: 7, fieldKey: "seoTitle", value: "An AI title", keyphrase: "seo" } ) ).resolves.toBeUndefined();
		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );
} );
