import { render, screen, fireEvent } from "@testing-library/react";
import { useSelect } from "@wordpress/data";
import { ContentPlannerEditorItem } from "../../../src/ai-content-planner/components/content-planner-editor-item";
import { FEATURE_MODAL_STATUS } from "../../../src/ai-content-planner/constants";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
} ) );

const renderEditorItem = ( { setFeatureModalStatus = jest.fn(), location = "sidebar", ...props } = {} ) => render(
	<ContentPlannerEditorItem
		setFeatureModalStatus={ setFeatureModalStatus }
		location={ location }
		{ ...props }
	/>
);

describe( "ContentPlannerEditorItem", () => {
	beforeEach( () => {
		useSelect.mockImplementation( ( selector ) => selector( () => ( {
			selectIsMinPostsMet: () => true,
		} ) ) );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( "renders the Get content suggestions button", () => {
		renderEditorItem();
		expect( screen.getByRole( "button", { name: "Get content suggestions" } ) ).toBeInTheDocument();
	} );

	it( "calls setFeatureModalStatus with idle when the button is clicked", () => {
		const setFeatureModalStatus = jest.fn();
		renderEditorItem( { setFeatureModalStatus } );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		expect( setFeatureModalStatus ).toHaveBeenCalledWith( FEATURE_MODAL_STATUS.idle );
	} );

	it( "applies the full-width class when location is sidebar", () => {
		renderEditorItem( { location: "sidebar" } );
		expect( screen.getByRole( "button", { name: "Get content suggestions" } ) ).toHaveClass( "yst-w-full" );
	} );

	it( "does not apply the full-width class when location is metabox", () => {
		renderEditorItem( { location: "metabox" } );
		expect( screen.getByRole( "button", { name: "Get content suggestions" } ) ).not.toHaveClass( "yst-w-full" );
	} );
} );
