import { render } from "../test-utils";
import { ContentPlannerEditorPlugin, registerInlineBanner } from "../../src/ai-content-planner/initialize";
import { addFilter } from "@wordpress/hooks";

jest.mock( "@wordpress/data", () => ( {
	dispatch: jest.fn( () => ( {
		updateData: jest.fn(),
		setFocusKeyword: jest.fn(),
	} ) ),
	useSelect: jest.fn( () => ( {
		isNewPost: false,
		postType: "post",
		blocks: [],
		minPostsMet: false,
		isBannerRendered: false,
		yoastTitle: "",
		yoastMetaDesc: "",
		yoastFocusKw: "",
	} ) ),
	useDispatch: jest.fn( () => ( { insertBlock: jest.fn() } ) ),
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

jest.mock( "../../src/ai-content-planner/components/inline-banner", () => ( {
	InlineBanner: () => null,
} ) );

jest.mock( "../../src/ai-content-planner/components/app", () => ( {
	App: () => <div data-testid="app" />,
} ) );

jest.mock( "../../src/ai-content-planner/components/content-suggestion-block", () => ( {
	ContentSuggestionBlock: () => null,
} ) );

describe( "ContentPlannerEditorPlugin", () => {
	test( "renders the App without crashing", () => {
		const { getByTestId } = render( <ContentPlannerEditorPlugin /> );
		expect( getByTestId( "app" ) ).toBeInTheDocument();
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
