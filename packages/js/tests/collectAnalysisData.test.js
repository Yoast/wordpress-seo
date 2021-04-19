import collectAnalysisData from "../src/analysis/collectAnalysisData";
import gutenbergBlocks from "./__test-data__/gutenbergBlocksTestData";
import expectedBlocks from "./__test-data__/blocksForAnalysisTestData";

describe( "collectAnalysisData", () => {
	const storeData = {
		focusKeyword: "focus keyword",
		synonyms: [],
		analysisData: {
			snippet: {
				description: "A meta description",
				title: "A meta title",
			},
		},
		snippetEditor: {
			data: {
				slug: "a-slug",
			},
		},
		settings: {
			snippetEditor: {
				baseUrl: "https://example.org/",
			},
		},
	};

	/**
	 * Mocks an edit store.
	 *
	 * @param {string} content The editors content.
	 *
	 * @returns {Edit} The mocked edit store.
	 */
	function mockEdit( content ) {
		return {
			getData: () => ( {
				getData: () => ( { content } ),
			} ),
		};
	}

	/**
	 * Mocks the Pluggable.
	 *
	 * @param {boolean} loaded If the pluggable is loaded.
	 *
	 * @returns {Pluggable} The mocked Pluggable.
	 */
	function mockPluggable( loaded = true ) {
		return {
			loaded: loaded,
			_applyModifications: ( modification, content ) => content,
		};
	}

	/**
	 * Mocks the Yoast SEO metabox Redux store.
	 *
	 * @param {Object} data The data stored in the store.
	 *
	 * @returns {{getState: (function(): *)}} The mocked store.
	 */
	function mockStore( data ) {
		return { getState: () => data };
	}

	/**
	 * Mocks customAnalysisData.
	 *
	 * @returns {CustomAnalysisData} The mocked custom analysis data.
	 */
	function mockCustomAnalysisData() {
		return { getData: () => {} };
	}

	/**
	 * Mocks the WordPress block editor data module.
	 *
	 * @param {Object[]} blocks The blocks that the data module should return.
	 *
	 * @returns {{getBlocks: (function(): *)}} The mocked data module.
	 */
	function mockBlockEditorDataModule( blocks ) {
		return { getBlocks: () => blocks };
	}

	it( "filters the content from blocks", () => {
		const edit = mockEdit( "<p>some content</p>" );
		const store = mockStore( storeData );
		const customData = mockCustomAnalysisData();
		const pluggable = mockPluggable();
		const blockEditorDataModule = mockBlockEditorDataModule( gutenbergBlocks );

		const results = collectAnalysisData( edit, store, customData, pluggable, blockEditorDataModule );

		expect( results ).toHaveProperty( "_attributes.wpBlocks" );
		expect( results._attributes.wpBlocks ).toEqual( expectedBlocks );
	} );

	it( "does not add wpBlocks if no blockEditorDataModule is added", () => {
		const edit = mockEdit( "<p>some content</p>" );
		const store = mockStore( storeData );
		const customData = mockCustomAnalysisData();
		const pluggable = mockPluggable();

		const results = collectAnalysisData( edit, store, customData, pluggable );

		expect( results ).toHaveProperty( "_attributes.wpBlocks" );
		expect( results._attributes.wpBlocks ).toBeNull();
	} );

	it( "does not modify the data through the pluggable if the pluggable is not loaded.", () => {
		const edit = mockEdit( "<p>some content</p>" );
		const store = mockStore( storeData );
		const customData = mockCustomAnalysisData();
		const pluggable = mockPluggable( false );

		// To be able to test whether the method is called.
		pluggable._applyModifications = jest.fn();

		collectAnalysisData( edit, store, customData, pluggable );

		expect( pluggable._applyModifications ).not.toBeCalled();
	} );
} );
