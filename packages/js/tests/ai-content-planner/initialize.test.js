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
} ) );

jest.mock( "@wordpress/blocks", () => ( {
	createBlock: jest.fn( ( name ) => ( { name } ) ),
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

jest.mock( "../../src/ai-content-planner/components/feature-modal", () => ( {
	FeatureModal: ( props ) => props.isOpen ? <div data-testid="feature-modal" /> : null,
} ) );

jest.mock( "../../src/ai-content-planner/store", () => ( {
	registerStore: jest.fn(),
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
		expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "core/paragraph" }, 0, undefined, false );
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
		expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "yoast/content-planner-banner" }, 1, undefined, false );
	} );

	test( "should insert the banner after the first paragraph even when it is not the first block", () => {
		const blocks = [ { name: "core/heading" }, { name: "core/paragraph" }, { name: "core/image" } ];
		const result = insertBannerAfterFirstParagraph( blocks, mockInsertBlock );
		expect( result ).toBe( true );
		expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "yoast/content-planner-banner" }, 2, undefined, false );
	} );
} );

describe( "ContentPlannerEditorPlugin", () => {
	let mockInsertBlock;
	let mockRemoveBlock;
	let mockCloseModal;

	const defaultSelectOptions = {
		isNewPost: true,
		postType: "post",
		blocks: [],
		isModalOpen: false,
		skipApprove: false,
		isPremium: false,
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
				getEditedPostContent: () => "",
			},
			"core/block-editor": {
				getBlocks: () => opts.blocks,
			},
			"yoast-seo/content-planner": {
				selectIsModalOpen: () => opts.isModalOpen,
				selectShouldSkipApprove: () => opts.skipApprove,
			},
			"yoast-seo/editor": {
				getIsPremium: () => opts.isPremium,
				selectLink: () => "https://example.com/upsell",
			},
		};
		useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => stores[ storeName ] ) );
	};

	beforeEach( () => {
		mockInsertBlock = jest.fn();
		mockRemoveBlock = jest.fn();
		mockCloseModal = jest.fn();
		useDispatch.mockImplementation( ( storeName ) => {
			if ( storeName === "core/block-editor" ) {
				return { insertBlock: mockInsertBlock, removeBlock: mockRemoveBlock };
			}
			if ( storeName === "yoast-seo/content-planner" ) {
				return { closeModal: mockCloseModal };
			}
			return {};
		} );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	test( "should not render the feature modal when the store says it is closed", () => {
		mockSelect( { isModalOpen: false } );
		const { queryByTestId } = render( <ContentPlannerEditorPlugin /> );
		expect( queryByTestId( "feature-modal" ) ).not.toBeInTheDocument();
	} );

	test( "should render the feature modal when the store says it is open", () => {
		mockSelect( { isModalOpen: true } );
		const { getByTestId } = render( <ContentPlannerEditorPlugin /> );
		expect( getByTestId( "feature-modal" ) ).toBeInTheDocument();
	} );

	test( "should insert a paragraph block when canvas is empty on a new post", () => {
		mockSelect( { isNewPost: true, postType: "post", blocks: [] } );
		render( <ContentPlannerEditorPlugin /> );
		expect( createBlock ).toHaveBeenCalledWith( "core/paragraph" );
		expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "core/paragraph" }, 0, undefined, false );
	} );

	test( "should insert the banner after the first paragraph on a new post", () => {
		mockSelect( { isNewPost: true, postType: "post", blocks: [ { name: "core/paragraph" } ] } );
		render( <ContentPlannerEditorPlugin /> );
		expect( createBlock ).toHaveBeenCalledWith( "yoast/content-planner-banner" );
		expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "yoast/content-planner-banner" }, 1, undefined, false );
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
