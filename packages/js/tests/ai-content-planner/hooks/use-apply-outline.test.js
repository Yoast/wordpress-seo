import { renderHook, act } from "@testing-library/react";
import { useDispatch, select } from "@wordpress/data";
import { useApplyOutline } from "../../../src/ai-content-planner/hooks/use-apply-outline";
import { buildBlocksFromOutline } from "../../../src/ai-content-planner/helpers/build-blocks-from-outline";
import { applyPostMetaFromOutline } from "../../../src/ai-content-planner/helpers/apply-post-meta-from-outline";

jest.mock( "@wordpress/data", () => ( {
	useDispatch: jest.fn(),
	select: jest.fn(),
} ) );

jest.mock( "../../../src/ai-content-planner/helpers/build-blocks-from-outline", () => ( {
	buildBlocksFromOutline: jest.fn( () => [ "block1" ] ),
} ) );

jest.mock( "../../../src/ai-content-planner/helpers/apply-post-meta-from-outline", () => ( {
	applyPostMetaFromOutline: jest.fn(),
} ) );

const mockApiOutline = [ { heading: "Intro" }, { heading: "Body" } ];

const mockApiSuggestion = {
	title: "API Title",
	// eslint-disable-next-line camelcase
	meta_description: "API Meta",
	keyphrase: "api keyphrase",
	category: "api-category",
};
const mockBanner = { name: "yoast/content-planner-banner", clientId: "banner-id" };

const resetBlocks = jest.fn();
const removeBlock = jest.fn();
const closeModal = jest.fn();

/**
 * Sets up useDispatch to return the correct mock per store.
 */
const setupUseDispatch = () => {
	useDispatch.mockImplementation( ( storeName ) => {
		if ( storeName === "core/block-editor" ) {
			return { resetBlocks, removeBlock };
		}
		return { closeModal };
	} );
};

/**
 * Sets up select to return the correct mock per store.
 *
 * @param {Object} params              Optional override values.
 * @param {Array}  params.blocks       Blocks returned by getBlocks.
 * @param {Array}  params.apiOutline   Outline returned by selectContentOutline.
 * @param {Object} params.apiSuggestion Suggestion returned by selectSuggestion.
 */
const setupSelect = ( { blocks = [], apiOutline = mockApiOutline, apiSuggestion = mockApiSuggestion } = {} ) => {
	select.mockImplementation( ( storeName ) => {
		if ( storeName === "core/block-editor" ) {
			return { getBlocks: jest.fn( () => blocks ) };
		}
		return {
			selectContentOutline: jest.fn( () => apiOutline ),
			selectSuggestion: jest.fn( () => apiSuggestion ),
		};
	} );
};

describe( "useApplyOutline", () => {
	beforeEach( () => {
		jest.clearAllMocks();
		setupUseDispatch();
		setupSelect();
	} );

	describe( "metadata from editedOutline", () => {
		it( "uses editedOutline data when the ref has a value", async() => {
			const editedOutline = {
				title: "Edited Title",
				metaDescription: "Edited Meta",
				focusKeyphrase: "edited keyphrase",
				category: "edited-category",
				structure: [ { heading: "Edited Section" } ],
			};
			const editedOutlineRef = { current: editedOutline };

			const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

			await act( async() => {
				await result.current();
			} );

			expect( applyPostMetaFromOutline ).toHaveBeenCalledWith( {
				title: "Edited Title",
				metaDescription: "Edited Meta",
				focusKeyphrase: "edited keyphrase",
				category: "edited-category",
			} );
		} );

		it( "uses editedOutline.structure as the block structure", async() => {
			const editedStructure = [ { heading: "Custom Section" } ];
			const editedOutlineRef = {
				current: {
					title: "T",
					metaDescription: "M",
					focusKeyphrase: "K",
					category: "C",
					structure: editedStructure,
				},
			};

			const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

			await act( async() => {
				await result.current();
			} );

			expect( buildBlocksFromOutline ).toHaveBeenCalledWith( editedStructure );
		} );
	} );

	describe( "metadata from apiSuggestion", () => {
		it( "falls back to apiSuggestion when editedOutlineRef.current is null", async() => {
			const editedOutlineRef = { current: null };

			const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

			await act( async() => {
				await result.current();
			} );

			expect( applyPostMetaFromOutline ).toHaveBeenCalledWith( {
				title: mockApiSuggestion.title,
				metaDescription: mockApiSuggestion.meta_description,
				focusKeyphrase: mockApiSuggestion.keyphrase,
				category: mockApiSuggestion.category,
			} );
		} );

		it( "uses apiOutline as the block structure when editedOutlineRef.current is null", async() => {
			const editedOutlineRef = { current: null };

			const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

			await act( async() => {
				await result.current();
			} );

			expect( buildBlocksFromOutline ).toHaveBeenCalledWith( mockApiOutline );
		} );
	} );

	describe( "block operations", () => {
		it( "calls resetBlocks with the built blocks", async() => {
			const editedOutlineRef = { current: null };

			const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

			await act( async() => {
				await result.current();
			} );

			expect( resetBlocks ).toHaveBeenCalledWith( [ "block1" ] );
		} );

		it( "removes the banner block when one is present", async() => {
			setupSelect( { blocks: [ mockBanner, { name: "core/paragraph", clientId: "p-id" } ] } );
			const editedOutlineRef = { current: null };

			const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

			await act( async() => {
				await result.current();
			} );

			expect( removeBlock ).toHaveBeenCalledWith( "banner-id" );
		} );

		it( "does not call removeBlock when no banner block is present", async() => {
			setupSelect( { blocks: [ { name: "core/paragraph", clientId: "p-id" } ] } );
			const editedOutlineRef = { current: null };

			const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

			await act( async() => {
				await result.current();
			} );

			expect( removeBlock ).not.toHaveBeenCalled();
		} );
	} );

	describe( "modal close", () => {
		it( "calls closeModal after applying the outline", async() => {
			const editedOutlineRef = { current: null };

			const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

			await act( async() => {
				await result.current();
			} );

			expect( closeModal ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "ref timing", () => {
		it( "reads editedOutlineRef.current at callback invocation time, not render time", async() => {
			const editedOutlineRef = { current: null };

			const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

			// Update the ref after the hook has rendered.
			editedOutlineRef.current = {
				title: "Late-set Title",
				metaDescription: "Late-set Meta",
				focusKeyphrase: "late keyphrase",
				category: "late-category",
				structure: [],
			};

			await act( async() => {
				await result.current();
			} );

			expect( applyPostMetaFromOutline ).toHaveBeenCalledWith( {
				title: "Late-set Title",
				metaDescription: "Late-set Meta",
				focusKeyphrase: "late keyphrase",
				category: "late-category",
			} );
		} );
	} );
} );
