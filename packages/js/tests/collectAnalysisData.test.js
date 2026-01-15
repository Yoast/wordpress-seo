import { serialize } from "@wordpress/blocks";
import collectAnalysisData, { mapGutenbergBlocks } from "../src/analysis/collectAnalysisData";
import gutenbergBlocks from "./__test-data__/gutenbergBlocksTestData";

const originalWindow = { ...window };
const windowSpy = jest.spyOn( global, "window", "get" );
windowSpy.mockImplementation( () => ( {
	...originalWindow,
	// eslint-disable-next-line camelcase
	wpseoScriptData: { analysis: { plugins: { shortcodes: { wpseo_shortcode_tags: [] } } } },
} ) );

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
	 * @returns {{getBlocks: (function(): *), getBlocksByName: (function(): *)}} The mocked data module.
	 */
	function mockBlockEditorDataModule( blocks ) {
		return {
			getBlocks: () => blocks,
			getBlocksByName: () => [],
		};
	}

	it( "should not filter the content from blocks", () => {
		const edit = mockEdit( "<p>some content</p>" );
		const store = mockStore( storeData );
		const customData = mockCustomAnalysisData();
		const pluggable = mockPluggable();
		const blockEditorDataModule = mockBlockEditorDataModule( gutenbergBlocks );

		const results = collectAnalysisData( edit, store, customData, pluggable, blockEditorDataModule );

		expect( results ).toHaveProperty( "_attributes.wpBlocks" );
		expect( results._attributes.wpBlocks ).toEqual( gutenbergBlocks );
	} );

	it( "should not modify the original blocks array when filtering", () => {
		const edit = mockEdit( "<p>some content</p>" );
		const store = mockStore( storeData );
		const customData = mockCustomAnalysisData();
		const pluggable = mockPluggable();

		const getFirstColumnBlocks = ( blocks ) => blocks
			.find( block => block.name === "core/columns" ).innerBlocks
			.find( block => block.name === "core/column" ).innerBlocks;
		const invalidBlock = { isValid: false, innerBlocks: [], name: "core/paragraph" };

		const firstColumnBlocks = getFirstColumnBlocks( gutenbergBlocks );
		firstColumnBlocks.push( invalidBlock );
		const blockEditorDataModule = mockBlockEditorDataModule( gutenbergBlocks );

		// The original blocks array should contain the invalid block.
		expect( getFirstColumnBlocks( gutenbergBlocks ) ).toContainEqual( invalidBlock );

		// When collecting the analysis data, the invalid block should be removed from the results, but not from the original blocks array.
		const results = collectAnalysisData( edit, store, customData, pluggable, blockEditorDataModule );
		expect( getFirstColumnBlocks( results._attributes.wpBlocks ) ).not.toContainEqual( invalidBlock );
		expect( getFirstColumnBlocks( gutenbergBlocks ) ).toContainEqual( invalidBlock );
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

	describe( "template-locked mode handling", () => {
		/**
		 * Mocks the WordPress block editor data module with template-locked specific methods.
		 *
		 * @param {Object[]} blocks           The blocks that getBlocks() should return.
		 * @param {Object[]} postContentBlocks The post-content blocks that getBlocksByName() should return.
		 * @param {string}   postContentId     The ID of the post-content block.
		 * @param {Object[]} innerBlocks       The blocks inside the post-content block.
		 *
		 * @returns {Object} The mocked block editor data module.
		 */
		function mockBlockEditorDataModuleForTemplates( blocks, postContentBlocks = [], postContentId = "post-content-1", innerBlocks = [] ) {
			return {
				getBlocks: jest.fn( ( blockId ) => {
					if ( blockId && blockId.id === postContentId ) {
						return innerBlocks;
					}
					return blocks;
				} ),
				getBlocksByName: jest.fn( ( blockName ) => {
					if ( blockName === "core/post-content" ) {
						return postContentBlocks;
					}
					return [];
				} ),
			};
		}

		/**
		 * Mocks the WordPress editor data module.
		 *
		 * @param {string} renderingMode The rendering mode to return.
		 *
		 * @returns {Object} The mocked editor data module.
		 */
		function mockEditorDataModuleForTemplates( renderingMode = "template-locked" ) {
			return {
				getRenderingMode: jest.fn( () => renderingMode ),
			};
		}

		it( "should use regular blocks when not in template-locked mode", () => {
			const edit = mockEdit( "<p>some content</p>" );
			const store = mockStore( storeData );
			const customData = mockCustomAnalysisData();
			const pluggable = mockPluggable();

			const regularBlocks = [
				{ isValid: true, name: "core/paragraph", innerBlocks: [] },
				{ isValid: true, name: "core/heading", innerBlocks: [] },
			];

			const postContentBlock = { id: "post-content-1" };
			const postContentBlocks = [ postContentBlock ];
			const innerBlocks = [
				{ isValid: true, name: "core/paragraph", innerBlocks: [] },
			];

			const blockEditorDataModule = mockBlockEditorDataModuleForTemplates(
				regularBlocks,
				postContentBlocks,
				"post-content-1",
				innerBlocks
			);
			const editorDataModule = mockEditorDataModuleForTemplates( "standard" );

			const results = collectAnalysisData( edit, store, customData, pluggable, blockEditorDataModule, editorDataModule );

			expect( blockEditorDataModule.getBlocks ).toHaveBeenCalledWith();
			expect( blockEditorDataModule.getBlocks ).not.toHaveBeenCalledWith( postContentBlock );
			expect( results._attributes.wpBlocks ).toHaveLength( 2 );
		} );

		it( "should use post-content blocks when in template-locked mode and post-content blocks exist", () => {
			const edit = mockEdit( "<p>some content</p>" );
			const store = mockStore( storeData );
			const customData = mockCustomAnalysisData();
			const pluggable = mockPluggable();

			const regularBlocks = [
				{ isValid: true, name: "core/paragraph", innerBlocks: [] },
				{ isValid: true, name: "core/heading", innerBlocks: [] },
			];

			const postContentBlock = { id: "post-content-1" };
			const postContentBlocks = [ postContentBlock ];
			const innerBlocks = [
				{ isValid: true, name: "core/paragraph", innerBlocks: [] },
			];

			const blockEditorDataModule = mockBlockEditorDataModuleForTemplates(
				regularBlocks,
				postContentBlocks,
				"post-content-1",
				innerBlocks
			);
			const editorDataModule = mockEditorDataModuleForTemplates( "template-locked" );

			const results = collectAnalysisData( edit, store, customData, pluggable, blockEditorDataModule, editorDataModule );

			expect( blockEditorDataModule.getBlocksByName ).toHaveBeenCalledWith( "core/post-content" );
			expect( blockEditorDataModule.getBlocks ).toHaveBeenCalledWith( postContentBlock );
			expect( results._attributes.wpBlocks ).toHaveLength( 1 );
		} );

		it( "should fall back to regular blocks when in template-locked mode but no post-content blocks exist", () => {
			const edit = mockEdit( "<p>some content</p>" );
			const store = mockStore( storeData );
			const customData = mockCustomAnalysisData();
			const pluggable = mockPluggable();

			const regularBlocks = [
				{ isValid: true, name: "core/paragraph", innerBlocks: [] },
				{ isValid: true, name: "core/heading", innerBlocks: [] },
			];

			const postContentBlocks = [];

			const blockEditorDataModule = mockBlockEditorDataModuleForTemplates(
				regularBlocks,
				postContentBlocks
			);
			const editorDataModule = mockEditorDataModuleForTemplates( "template-locked" );

			const results = collectAnalysisData( edit, store, customData, pluggable, blockEditorDataModule, editorDataModule );

			expect( blockEditorDataModule.getBlocksByName ).toHaveBeenCalledWith( "core/post-content" );
			expect( blockEditorDataModule.getBlocks ).toHaveBeenCalledWith();
			expect( results._attributes.wpBlocks ).toHaveLength( 2 );
		} );

		it( "should fall back to regular blocks when in template-locked mode but post-content blocks array is empty", () => {
			const edit = mockEdit( "<p>some content</p>" );
			const store = mockStore( storeData );
			const customData = mockCustomAnalysisData();
			const pluggable = mockPluggable();

			const regularBlocks = [
				{ isValid: true, name: "core/paragraph", innerBlocks: [] },
			];

			const postContentBlocks = null;

			const blockEditorDataModule = mockBlockEditorDataModuleForTemplates(
				regularBlocks,
				postContentBlocks
			);
			const editorDataModule = mockEditorDataModuleForTemplates( "template-locked" );

			const results = collectAnalysisData( edit, store, customData, pluggable, blockEditorDataModule, editorDataModule );

			expect( blockEditorDataModule.getBlocksByName ).toHaveBeenCalledWith( "core/post-content" );
			expect( blockEditorDataModule.getBlocks ).toHaveBeenCalledWith();
			expect( results._attributes.wpBlocks ).toHaveLength( 1 );
		} );

		it( "should handle when editorDataModule is not provided", () => {
			const edit = mockEdit( "<p>some content</p>" );
			const store = mockStore( storeData );
			const customData = mockCustomAnalysisData();
			const pluggable = mockPluggable();

			const regularBlocks = [
				{ isValid: true, name: "core/paragraph", innerBlocks: [] },
			];

			const blockEditorDataModule = mockBlockEditorDataModuleForTemplates( regularBlocks );

			const results = collectAnalysisData( edit, store, customData, pluggable, blockEditorDataModule );

			expect( blockEditorDataModule.getBlocks ).toHaveBeenCalledWith();
			expect( results._attributes.wpBlocks ).toHaveLength( 1 );
		} );

		it( "should handle when getRenderingMode returns undefined", () => {
			const edit = mockEdit( "<p>some content</p>" );
			const store = mockStore( storeData );
			const customData = mockCustomAnalysisData();
			const pluggable = mockPluggable();

			const regularBlocks = [
				{ isValid: true, name: "core/paragraph", innerBlocks: [] },
			];

			const blockEditorDataModule = mockBlockEditorDataModuleForTemplates( regularBlocks );
			const editorDataModule = {
				getRenderingMode: jest.fn( () => undefined ),
			};

			const results = collectAnalysisData( edit, store, customData, pluggable, blockEditorDataModule, editorDataModule );

			expect( blockEditorDataModule.getBlocks ).toHaveBeenCalledWith();
			expect( results._attributes.wpBlocks ).toHaveLength( 1 );
		} );
	} );
} );

jest.mock( "@wordpress/blocks", () => ( {
	serialize: jest.fn(),
} ) );

describe( "mapGutenbergBlocks", () => {
	it( "should return an empty array if input blocks array is empty", () => {
		const blocks = [];
		const result = mapGutenbergBlocks( blocks );
		expect( result ).toEqual( [] );
	} );

	it( "should filter out invalid blocks", () => {
		const blocks = [
			{ isValid: true, innerBlocks: [] },
			{ isValid: false, innerBlocks: [] },
		];
		const result = mapGutenbergBlocks( blocks );
		expect( result ).toHaveLength( 1 );
	} );

	it( "should calculate blockLength for each block", () => {
		const blocks = [
			{ isValid: true, innerBlocks: [] },
		];
		const mockSerializedBlock = "serialized block";
		serialize.mockImplementation( jest.fn().mockReturnValue( mockSerializedBlock ) );
		const result = mapGutenbergBlocks( blocks );
		expect( result[ 0 ].blockLength ).toEqual( mockSerializedBlock.length );
	} );

	it( "should recursively map inner blocks", () => {
		const blocks = [
			{
				isValid: true,
				innerBlocks: [
					{ isValid: true, innerBlocks: [] },
				],
			},
		];
		const result = mapGutenbergBlocks( blocks );
		expect( result[ 0 ].innerBlocks[ 0 ] ).toHaveProperty( "blockLength" );
	} );
} );
