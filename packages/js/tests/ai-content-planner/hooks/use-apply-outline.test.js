/* eslint-disable camelcase */
import { renderHook, act } from "@testing-library/react";
import { useDispatch, select as mockSelect } from "@wordpress/data";
import { useApplyOutline } from "../../../src/ai-content-planner/hooks/use-apply-outline";
import { buildBlocksFromOutline } from "../../../src/ai-content-planner/helpers/build-blocks-from-outline";
import { CONTENT_PLANNER_STORE } from "../../../src/ai-content-planner/constants";

jest.mock( "@wordpress/data", () => ( {
	useDispatch: jest.fn(),
	select: jest.fn(),
} ) );

const mockBlocks = [ { name: "core/heading", attributes: {} } ];
jest.mock( "../../../src/ai-content-planner/helpers/build-blocks-from-outline", () => ( {
	buildBlocksFromOutline: jest.fn( () => mockBlocks ),
} ) );

const mockEditPost = jest.fn();
const mockCloseModal = jest.fn();
const mockSetBannerDismissed = jest.fn();

const apiOutline = [ { heading: "Intro" } ];
// The API suggestion mirrors the snake_case shape returned by the Yoast Content Planner endpoint.
const apiSuggestion = {
	title: "API title",

	meta_description: "API meta",
	keyphrase: "api keyphrase",
	category: { name: "API", id: 7 },
};

beforeEach( () => {
	mockEditPost.mockClear();
	mockCloseModal.mockClear();
	mockSetBannerDismissed.mockClear();
	buildBlocksFromOutline.mockClear();

	useDispatch.mockImplementation( ( storeName ) => {
		if ( storeName === "core/editor" ) {
			return { editPost: mockEditPost };
		}
		if ( storeName === CONTENT_PLANNER_STORE ) {
			return { closeModal: mockCloseModal, setBannerDismissed: mockSetBannerDismissed };
		}
		return {};
	} );

	mockSelect.mockImplementation( ( storeName ) => {
		if ( storeName === CONTENT_PLANNER_STORE ) {
			return {
				selectContentOutline: () => apiOutline,
				selectSuggestion: () => apiSuggestion,
			};
		}
		return {};
	} );
} );

describe( "useApplyOutline", () => {
	it( "writes blocks, title, and categories in a single editPost call when a category is provided", async() => {
		const editedOutline = {
			title: "Edited title",
			metaDescription: "Edited meta",
			focusKeyphrase: "edited keyphrase",
			category: { name: "Edited", id: 9 },
			structure: [ { heading: "Edited section" } ],
		};
		const editedOutlineRef = { current: editedOutline };
		const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

		await act( async() => {
			await result.current();
		} );

		expect( mockEditPost ).toHaveBeenCalledTimes( 1 );
		expect( mockEditPost ).toHaveBeenCalledWith( {
			title: "Edited title",
			blocks: mockBlocks,
			categories: [ 9 ],
			meta: {
				_yoast_wpseo_title: "Edited title",
				_yoast_wpseo_metadesc: "Edited meta",
				_yoast_wpseo_focuskw: "edited keyphrase",
			},
		} );
		expect( buildBlocksFromOutline ).toHaveBeenCalledWith( editedOutline.structure );
	} );

	it( "omits the categories field when category is null", async() => {
		const editedOutline = {
			title: "T",
			metaDescription: "M",
			focusKeyphrase: "K",
			category: null,
			structure: [],
		};
		const editedOutlineRef = { current: editedOutline };
		const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

		await act( async() => {
			await result.current();
		} );

		expect( mockEditPost ).toHaveBeenCalledTimes( 1 );
		expect( mockEditPost ).toHaveBeenCalledWith( {
			title: "T",
			blocks: mockBlocks,
			meta: {
				_yoast_wpseo_title: "T",
				_yoast_wpseo_metadesc: "M",
				_yoast_wpseo_focuskw: "K",
			},
		} );
	} );

	it( "omits the categories field when the empty-category sentinel is given", async() => {
		const editedOutline = {
			title: "T",
			metaDescription: "M",
			focusKeyphrase: "K",
			category: { name: "", id: -1 },
			structure: [],
		};
		const editedOutlineRef = { current: editedOutline };
		const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

		await act( async() => {
			await result.current();
		} );

		expect( mockEditPost ).toHaveBeenCalledTimes( 1 );
		expect( mockEditPost ).toHaveBeenCalledWith( {
			title: "T",
			blocks: mockBlocks,
			meta: {
				_yoast_wpseo_title: "T",
				_yoast_wpseo_metadesc: "M",
				_yoast_wpseo_focuskw: "K",
			},
		} );
	} );

	it( "includes Yoast meta fields in the editPost call", async() => {
		const editedOutline = {
			title: "Edited title",
			metaDescription: "Edited meta",
			focusKeyphrase: "edited keyphrase",
			category: { name: "Edited", id: 9 },
			structure: [],
		};
		const editedOutlineRef = { current: editedOutline };
		const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

		await act( async() => {
			await result.current();
		} );

		expect( mockEditPost ).toHaveBeenCalledWith( expect.objectContaining( {
			meta: {
				_yoast_wpseo_title: "Edited title",
				_yoast_wpseo_metadesc: "Edited meta",
				_yoast_wpseo_focuskw: "edited keyphrase",
			},
		} ) );
	} );

	it( "falls back to the API suggestion when no edited outline is present", async() => {
		const editedOutlineRef = { current: null };
		const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

		await act( async() => {
			await result.current();
		} );

		expect( buildBlocksFromOutline ).toHaveBeenCalledWith( apiOutline );
		expect( mockEditPost ).toHaveBeenCalledWith( {
			title: apiSuggestion.title,
			blocks: mockBlocks,
			categories: [ apiSuggestion.category.id ],
			meta: {
				_yoast_wpseo_title: apiSuggestion.title,
				_yoast_wpseo_metadesc: apiSuggestion.meta_description,
				_yoast_wpseo_focuskw: apiSuggestion.keyphrase,
			},
		} );
	} );

	it( "dismisses the banner after applying the outline", async() => {
		const editedOutlineRef = { current: null };
		const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

		await act( async() => {
			await result.current();
		} );

		expect( mockSetBannerDismissed ).toHaveBeenCalledTimes( 1 );
	} );

	it( "closes the modal at the end of the apply flow", async() => {
		const editedOutlineRef = { current: null };
		const { result } = renderHook( () => useApplyOutline( { editedOutlineRef } ) );

		await act( async() => {
			await result.current();
		} );

		expect( mockCloseModal ).toHaveBeenCalledTimes( 1 );
	} );
} );
