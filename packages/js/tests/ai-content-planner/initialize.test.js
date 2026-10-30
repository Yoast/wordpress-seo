import { render } from "../test-utils";
import { ContentPlannerEditorPlugin, insertFirstParagraph, registerInlineBanner } from "../../src/ai-content-planner/initialize";
import { addFilter } from "@wordpress/hooks";

const mockSelectHasAiGeneratorConsent = jest.fn( () => false );
const mockSelectIsMinPostsMet = jest.fn( () => false );
const mockSelectIsBannerRendered = jest.fn( () => false );

const buildMockSelect = ( { postTypeTemplate = null } = {} ) => {
	const storeMap = {
		"yoast-seo/ai-generator": { selectHasAiGeneratorConsent: mockSelectHasAiGeneratorConsent },
		"yoast-seo/content-planner": {
			selectIsMinPostsMet: mockSelectIsMinPostsMet,
			selectIsBannerRendered: mockSelectIsBannerRendered,
		},
		"core/editor": {
			isEditedPostNew: () => false,
			getCurrentPostType: () => "post",
			getEditedPostAttribute: () => "",
		},
		"core/block-editor": { getBlocks: () => [] },
		core: { getPostType: () => ( { template: postTypeTemplate } ) },
		"yoast-seo/editor": { getSnippetEditorTemplates: () => ( { title: "", description: "" } ) },
	};
	return ( storeName ) => storeMap[ storeName ] ?? {};
};

jest.mock( "@wordpress/data", () => ( {
	dispatch: jest.fn( () => ( {
		updateData: jest.fn(),
		setFocusKeyword: jest.fn(),
	} ) ),
	useSelect: jest.fn( ( mapSelect ) => mapSelect( buildMockSelect() ) ),
	useDispatch: jest.fn( () => ( {
		insertBlock: jest.fn(),
		updateData: jest.fn(),
		setFocusKeyword: jest.fn(),
		setCornerstoneContent: jest.fn(),
	} ) ),
	select: jest.fn( () => ( {
		getBlocks: () => [],
		isEditedPostNew: () => true,
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
	getBlockType: jest.fn( () => null ),
} ) );

jest.mock( "@wordpress/block-editor", () => ( {
	useBlockProps: jest.fn( () => ( {} ) ),
} ) );

jest.mock( "@wordpress/plugins", () => ( {
	registerPlugin: jest.fn(),
} ) );

jest.mock( "@wordpress/hooks", () => ( {
	addFilter: jest.fn(),
} ) );

jest.mock( "@wordpress/wordcount", () => ( {
	count: jest.fn( () => 0 ),
} ) );

jest.mock( "@yoast/ui-library", () => ( {
	ErrorBoundary: ( { children } ) => children,
} ) );

jest.mock( "../../src/ai-content-planner/components/inline-banner", () => ( {
	InlineBanner: () => null,
} ) );

jest.mock( "../../src/ai-content-planner/components/app", () => ( {

	App: ( { hasConsent } ) => <div data-testid="app" data-has-consent={ String( hasConsent ) } />,
} ) );

jest.mock( "../../src/ai-content-planner/components/content-suggestion-block", () => ( {
	ContentSuggestionBlock: () => null,
} ) );

describe( "ContentPlannerEditorPlugin", () => {
	test( "renders the App without crashing", () => {
		const { getByTestId } = render( <ContentPlannerEditorPlugin /> );
		expect( getByTestId( "app" ) ).toBeInTheDocument();
	} );

	test( "renders null when the AI generator store is not registered", () => {
		const { useSelect } = require( "@wordpress/data" );
		useSelect.mockImplementation( ( mapSelect ) => mapSelect( buildMockSelect() ) );

		// Override only the ai-generator store to simulate it being absent.
		useSelect.mockImplementation( ( mapSelect ) => mapSelect( ( storeName ) => {
			if ( storeName === "yoast-seo/ai-generator" ) {
				return undefined;
			}
			return buildMockSelect()( storeName );
		} ) );

		const { container } = render( <ContentPlannerEditorPlugin /> );
		expect( container.firstChild ).toBeNull();
	} );

	test( "passes hasConsent=true to App when consent is granted", () => {
		mockSelectHasAiGeneratorConsent.mockReturnValue( true );

		const { useSelect } = require( "@wordpress/data" );
		useSelect.mockImplementation( ( mapSelect ) => mapSelect( buildMockSelect() ) );

		const { getByTestId } = render( <ContentPlannerEditorPlugin /> );
		expect( getByTestId( "app" ).dataset.hasConsent ).toBe( "true" );

		mockSelectHasAiGeneratorConsent.mockReturnValue( false );
	} );

	test( "passes hasConsent=false to App when consent is not granted", () => {
		mockSelectHasAiGeneratorConsent.mockReturnValue( false );

		const { getByTestId } = render( <ContentPlannerEditorPlugin /> );
		expect( getByTestId( "app" ).dataset.hasConsent ).toBe( "false" );
	} );
} );

describe( "insertFirstParagraph", () => {
	const mockInsertBlock = jest.fn();

	beforeEach( () => {
		mockInsertBlock.mockClear();
	} );

	test( "returns true immediately when the banner is already rendered", () => {
		const result = insertFirstParagraph( [], mockInsertBlock, true );

		expect( result ).toBe( true );
		expect( mockInsertBlock ).not.toHaveBeenCalled();
	} );

	test( "inserts a paragraph and returns false when the canvas is empty", () => {
		const result = insertFirstParagraph( [], mockInsertBlock, false );

		expect( mockInsertBlock ).toHaveBeenCalledTimes( 1 );
		expect( result ).toBe( false );
	} );

	test( "returns true without inserting when the canvas already has a paragraph", () => {
		const blocks = [ { name: "core/paragraph" } ];

		const result = insertFirstParagraph( blocks, mockInsertBlock, false );

		expect( mockInsertBlock ).not.toHaveBeenCalled();
		expect( result ).toBe( true );
	} );

	test( "returns false without inserting when blocks exist but none is a paragraph", () => {
		const blocks = [ { name: "core/heading" } ];

		const result = insertFirstParagraph( blocks, mockInsertBlock, false );

		expect( mockInsertBlock ).not.toHaveBeenCalled();
		expect( result ).toBe( false );
	} );
} );

describe( "ContentPlannerEditorPlugin — block template guard", () => {
	const mockInsertBlock = jest.fn();

	beforeEach( () => {
		mockInsertBlock.mockClear();
	} );

	test( "does not insert a paragraph when the post type has a block template", () => {
		const { useSelect, useDispatch } = require( "@wordpress/data" );

		mockSelectIsMinPostsMet.mockReturnValue( true );
		useDispatch.mockImplementation( () => ( { insertBlock: mockInsertBlock, updateData: jest.fn(), setFocusKeyword: jest.fn() } ) );
		useSelect.mockImplementation( ( mapSelect ) => mapSelect( ( storeName ) => {
			if ( storeName === "core/editor" ) {
				return {
					isEditedPostNew: () => true,
					getCurrentPostType: () => "post",
					getEditedPostAttribute: () => "",
				};
			}
			return buildMockSelect( { postTypeTemplate: [ [ "core/group", {} ] ] } )( storeName );
		} ) );

		render( <ContentPlannerEditorPlugin /> );

		expect( mockInsertBlock ).not.toHaveBeenCalled();

		mockSelectIsMinPostsMet.mockReturnValue( false );
	} );
} );

describe( "registerInlineBanner", () => {
	beforeEach( () => {
		addFilter.mockClear();
	} );

	test( "registers the editor.BlockListBlock filter", () => {
		registerInlineBanner();

		expect( addFilter ).toHaveBeenCalledWith(
			"editor.BlockListBlock",
			"yoast/content-planner-banner",
			expect.any( Function )
		);
	} );

	test( "registers the filter only once per call", () => {
		registerInlineBanner();

		expect( addFilter ).toHaveBeenCalledTimes( 1 );
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

describe( "content-suggestion block registration guard", () => {
	test( "skips registerBlockType when the block is already registered", () => {
		const { registerBlockType: mockRegisterBlockType, getBlockType: mockGetBlockType } = require( "@wordpress/blocks" );

		mockGetBlockType.mockReturnValueOnce( { name: "yoast-seo/content-suggestion" } );
		mockRegisterBlockType.mockClear();

		jest.isolateModules( () => {
			require( "../../src/ai-content-planner/blocks/content-suggestion-block" );
		} );

		expect( mockRegisterBlockType ).not.toHaveBeenCalled();
	} );
} );
