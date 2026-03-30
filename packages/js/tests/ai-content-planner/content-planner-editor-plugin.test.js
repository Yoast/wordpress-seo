import { render } from "@testing-library/react";
import { useSelect, useDispatch } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";
import { ContentPlannerEditorPlugin } from "../../src/ai-content-planner/content-planner-editor-plugin";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
	useDispatch: jest.fn(),
	combineReducers: ( reducers ) => ( state = {}, action ) => Object.keys( reducers ).reduce(
		( nextState, key ) => ( { ...nextState, [ key ]: reducers[ key ]( state[ key ], action ) } ),
		{}
	),
	createReduxStore: jest.fn(),
	register: jest.fn(),
} ) );

jest.mock( "@wordpress/blocks", () => ( {
	createBlock: jest.fn(),
} ) );

const mockInsertBlock = jest.fn();

const setupMocks = ( { isBannerDismissed = false, blocks = [] } = {} ) => {
	useSelect.mockReturnValue( { isBannerDismissed, blocks } );
	useDispatch.mockReturnValue( { insertBlock: mockInsertBlock } );
	createBlock.mockReturnValue( { name: "core/paragraph" } );
};

describe( "ContentPlannerEditorPlugin", () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( "renders nothing", () => {
		setupMocks();
		const { container } = render( <ContentPlannerEditorPlugin /> );
		expect( container ).toBeEmptyDOMElement();
	} );

	it( "inserts a paragraph block when canvas is empty and banner is not dismissed", () => {
		setupMocks( { blocks: [], isBannerDismissed: false } );
		render( <ContentPlannerEditorPlugin /> );
		expect( createBlock ).toHaveBeenCalledWith( "core/paragraph" );

		expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "core/paragraph" }, 0, undefined, false );
	} );

	it( "does not insert a block when canvas already has blocks", () => {
		setupMocks( { blocks: [ { clientId: "abc", name: "core/paragraph" } ], isBannerDismissed: false } );
		render( <ContentPlannerEditorPlugin /> );
		expect( mockInsertBlock ).not.toHaveBeenCalled();
	} );

	it( "does not insert a block when the banner is dismissed", () => {
		setupMocks( { blocks: [], isBannerDismissed: true } );
		render( <ContentPlannerEditorPlugin /> );
		expect( mockInsertBlock ).not.toHaveBeenCalled();
	} );

	it( "does not insert a second paragraph block on re-render", () => {
		setupMocks( { blocks: [], isBannerDismissed: false } );
		const { rerender } = render( <ContentPlannerEditorPlugin /> );
		expect( mockInsertBlock ).toHaveBeenCalledTimes( 1 );

		// Simulate re-render (e.g. blocks is still empty but component re-renders).
		rerender( <ContentPlannerEditorPlugin /> );
		expect( mockInsertBlock ).toHaveBeenCalledTimes( 1 );
	} );
} );
