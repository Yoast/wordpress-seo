import { render } from "../test-utils";
import { useSelect, useDispatch } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";
import { insertBannerAfterFirstParagraph, ContentPlannerEditorPlugin } from "../../src/ai-content-planner/initialize";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
	useDispatch: jest.fn(),
	select: jest.fn( () => ( {
		getBlocks: () => [],
	} ) ),
	combineReducers: ( reducers ) => ( state = {}, action ) => Object.keys( reducers ).reduce(
		( nextState, key ) => ( { ...nextState, [ key ]: reducers[ key ]( state[ key ], action ) } ),
		{}
	),
	createReduxStore: jest.fn(),
	register: jest.fn(),
} ) );

jest.mock( "@wordpress/blocks", () => ( {
	createBlock: jest.fn( ( name, attributes, innerBlocks ) => ( { name, attributes, innerBlocks } ) ),
	registerBlockType: jest.fn(),
} ) );

jest.mock( "@wordpress/block-editor", () => ( {
	useBlockProps: jest.fn( () => ( {} ) ),
} ) );

jest.mock( "@wordpress/plugins", () => ( {
	registerPlugin: jest.fn(),
} ) );

jest.mock( "@wordpress/wordcount", () => ( {
	count: jest.fn( () => 0 ),
} ) );

jest.mock( "../../src/ai-content-planner/components/inline-banner", () => ( {
	InlineBanner: () => null,
} ) );

jest.mock( "../../src/ai-content-planner/components/app", () => ( {
	App: () => <div data-testid="app" />,
} ) );

jest.mock( "../../src/ai-content-planner/components/content-suggestion-block", () => ( {
	ContentSuggestionBlock: () => null,
} ) );

describe( "insertBannerAfterFirstParagraph", () => {
	let mockInsertBlock;

	beforeEach( () => {
		mockInsertBlock = jest.fn();
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	test( "should return true and skip insertion when banner already exists", () => {
		const blocks = [ { name: "core/paragraph" }, { name: "yoast/content-planner-banner" } ];
		const result = insertBannerAfterFirstParagraph( blocks, mockInsertBlock );
		expect( result ).toBe( true );
		expect( mockInsertBlock ).not.toHaveBeenCalled();
	} );

	test( "should insert a paragraph block when canvas is empty and return false", () => {
		const result = insertBannerAfterFirstParagraph( [], mockInsertBlock );
		expect( result ).toBe( false );
		expect( createBlock ).toHaveBeenCalledWith( "core/paragraph" );
		expect( mockInsertBlock ).toHaveBeenCalledWith( expect.objectContaining( { name: "core/paragraph" } ), 0, undefined, false );
	} );

	test( "should return false when there is no paragraph block to insert after", () => {
		const blocks = [ { name: "core/heading" } ];
		const result = insertBannerAfterFirstParagraph( blocks, mockInsertBlock );
		expect( result ).toBe( false );
		expect( mockInsertBlock ).not.toHaveBeenCalled();
	} );

	test( "should insert the banner after the first paragraph", () => {
		const blocks = [ { name: "core/paragraph" }, { name: "core/heading" } ];
		const result = insertBannerAfterFirstParagraph( blocks, mockInsertBlock );
		expect( result ).toBe( true );
		expect( createBlock ).toHaveBeenCalledWith( "yoast/content-planner-banner" );
		expect( mockInsertBlock ).toHaveBeenCalledWith( expect.objectContaining( { name: "yoast/content-planner-banner" } ), 1, undefined, false );
	} );

	test( "should insert the banner after the first paragraph even when it is not the first block", () => {
		const blocks = [ { name: "core/heading" }, { name: "core/paragraph" }, { name: "core/image" } ];
		const result = insertBannerAfterFirstParagraph( blocks, mockInsertBlock );
		expect( result ).toBe( true );
		expect( mockInsertBlock ).toHaveBeenCalledWith( expect.objectContaining( { name: "yoast/content-planner-banner" } ), 2, undefined, false );
	} );
} );

describe( "ContentPlannerEditorPlugin", () => {
	let mockInsertBlock;
	let mockRemoveBlock;

	const defaultSelectOptions = {
		isNewPost: true,
		postType: "post",
		blocks: [],
	};

	/**
	 * Mocks the useSelect hook with store-based selectors.
	 *
	 * @param {Object} options The mock options, merged with defaults.
	 * @returns {void}
	 */
	const mockSelect = ( options = {} ) => {
		const opts = { ...defaultSelectOptions, ...options };
		const stores = {
			"core/editor": {
				isEditedPostNew: () => opts.isNewPost,
				getCurrentPostType: () => opts.postType,
			},
			"core/block-editor": {
				getBlocks: () => opts.blocks,
			},
		};
		useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => stores[ storeName ] ) );
	};

	beforeEach( () => {
		mockInsertBlock = jest.fn();
		mockRemoveBlock = jest.fn();
		useDispatch.mockImplementation( ( storeName ) => {
			if ( storeName === "core/block-editor" ) {
				return { insertBlock: mockInsertBlock, removeBlock: mockRemoveBlock };
			}
			return {};
		} );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	test( "should render without crashing", () => {
		mockSelect();
		const { container } = render( <ContentPlannerEditorPlugin /> );
		expect( container ).toBeInTheDocument();
	} );

	test( "should insert a paragraph block when canvas is empty on a new post", () => {
		mockSelect( { isNewPost: true, postType: "post", blocks: [] } );
		render( <ContentPlannerEditorPlugin /> );
		expect( createBlock ).toHaveBeenCalledWith( "core/paragraph" );
		expect( mockInsertBlock ).toHaveBeenCalledWith( expect.objectContaining( { name: "core/paragraph" } ), 0, undefined, false );
	} );

	test( "should insert the banner after the first paragraph on a new post", () => {
		mockSelect( { isNewPost: true, postType: "post", blocks: [ { name: "core/paragraph" } ] } );
		render( <ContentPlannerEditorPlugin /> );
		expect( createBlock ).toHaveBeenCalledWith( "yoast/content-planner-banner" );
		expect( mockInsertBlock ).toHaveBeenCalledWith( expect.objectContaining( { name: "yoast/content-planner-banner" } ), 1, undefined, false );
	} );

	test( "should not insert a block when the post is not new", () => {
		mockSelect( { isNewPost: false, postType: "post", blocks: [] } );
		render( <ContentPlannerEditorPlugin /> );
		expect( mockInsertBlock ).not.toHaveBeenCalled();
	} );

	test( "should not insert a block when the post type is not 'post'", () => {
		mockSelect( { isNewPost: true, postType: "page", blocks: [] } );
		render( <ContentPlannerEditorPlugin /> );
		expect( mockInsertBlock ).not.toHaveBeenCalled();
	} );

	test( "should not insert a duplicate banner", () => {
		mockSelect( {
			isNewPost: true,
			postType: "post",
			blocks: [ { name: "core/paragraph" }, { name: "yoast/content-planner-banner" } ],
		} );
		render( <ContentPlannerEditorPlugin /> );
		expect( mockInsertBlock ).not.toHaveBeenCalled();
	} );

	test( "should not re-insert on re-render after successful insertion", () => {
		mockSelect( { isNewPost: true, postType: "post", blocks: [ { name: "core/paragraph" } ] } );
		const { rerender } = render( <ContentPlannerEditorPlugin /> );
		expect( mockInsertBlock ).toHaveBeenCalledTimes( 1 );

		rerender( <ContentPlannerEditorPlugin /> );
		expect( mockInsertBlock ).toHaveBeenCalledTimes( 1 );
	} );
} );

describe( "content-suggestion block transform", () => {
	const { registerBlockType: mockRegisterBlockType } = require( "@wordpress/blocks" );
	const registrationCall = mockRegisterBlockType.mock.calls.find( ( [ name ] ) => name === "yoast-seo/content-suggestion" );
	const transform = registrationCall[ 1 ].transforms.to[ 0 ].transform;

	test( "should transform suggestions into a list block with list-item children", () => {
		const result = transform( {
			suggestions: [ "First suggestion", "Second suggestion" ],
		} );

		expect( result.name ).toBe( "core/list" );
		expect( result.innerBlocks ).toHaveLength( 2 );
		expect( result.innerBlocks[ 0 ] ).toEqual( expect.objectContaining( {
			name: "core/list-item",
			attributes: { content: "First suggestion" },
		} ) );
		expect( result.innerBlocks[ 1 ] ).toEqual( expect.objectContaining( {
			name: "core/list-item",
			attributes: { content: "Second suggestion" },
		} ) );
	} );

	test( "should return an empty list block when there are no suggestions", () => {
		const result = transform( { suggestions: [] } );

		expect( result.name ).toBe( "core/list" );
		expect( result.innerBlocks ).toHaveLength( 0 );
	} );
} );
