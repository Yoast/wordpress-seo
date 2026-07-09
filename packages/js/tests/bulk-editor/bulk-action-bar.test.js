import { Fill, SlotFillProvider } from "@wordpress/components";
import { addFilter, removeFilter } from "@wordpress/hooks";
import { fireEvent, render, screen } from "../test-utils";
import { BulkActions, SelectionToolbar } from "../../src/bulk-editor/components/bulk-action-bar";
import { BULK_ACTIONS_SLOT, SELECT_MENU_ITEMS_FILTER } from "../../src/bulk-editor/constants";

// The hook is covered by use-ai-upsell.test.js; here it just feeds the modal a static upsell.
jest.mock( "../../src/bulk-editor/hooks/use-ai-upsell", () => ( {
	useAiUpsell: () => ( {
		upsellLabel: "Unlock with Yoast SEO Premium",
		upsellLink: "https://yoa.st/bulk-editor-ai-upsell",
		ctbId: "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
	} ),
} ) );

const toolbarProps = {
	isAllSelected: false,
	onToggleAll: jest.fn(),
	onSelectAll: jest.fn(),
	onDeselectAll: jest.fn(),
	selectedCount: 0,
	totalCount: 20,
};

describe( "SelectionToolbar", () => {
	it( "shows the selected count", () => {
		render( <SelectionToolbar { ...toolbarProps } selectedCount={ 3 } /> );

		expect( screen.getByText( "3 of 20 items selected" ) ).toBeInTheDocument();
	} );

	it( "hides the count when nothing is selected", () => {
		render( <SelectionToolbar { ...toolbarProps } selectedCount={ 0 } /> );

		expect( screen.queryByText( /selected/ ) ).not.toBeInTheDocument();
	} );

	it( "toggles all rows from the master checkbox", () => {
		const onToggleAll = jest.fn();
		render( <SelectionToolbar { ...toolbarProps } onToggleAll={ onToggleAll } /> );

		fireEvent.click( screen.getByRole( "checkbox", { name: "Select all" } ) );
		expect( onToggleAll ).toHaveBeenCalled();
	} );

	it( "renders the master checkbox as indeterminate on a partial selection", () => {
		render( <SelectionToolbar { ...toolbarProps } isIndeterminate={ true } selectedCount={ 3 } /> );

		const checkbox = screen.getByRole( "checkbox", { name: "Select all" } );
		expect( checkbox.indeterminate ).toBe( true );
		expect( checkbox ).not.toBeChecked();
	} );

	it( "renders the master checkbox as checked (not indeterminate) when all rows are selected", () => {
		render( <SelectionToolbar { ...toolbarProps } isAllSelected={ true } isIndeterminate={ false } selectedCount={ 20 } /> );

		const checkbox = screen.getByRole( "checkbox", { name: "Select all" } );
		expect( checkbox.indeterminate ).toBe( false );
		expect( checkbox ).toBeChecked();
	} );

	it( "selects and deselects all from the Select menu", () => {
		const onSelectAll = jest.fn();
		const onDeselectAll = jest.fn();
		render( <SelectionToolbar { ...toolbarProps } onSelectAll={ onSelectAll } onDeselectAll={ onDeselectAll } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Select" } ) );
		fireEvent.click( screen.getByRole( "menuitem", { name: "Select all" } ) );
		expect( onSelectAll ).toHaveBeenCalled();

		fireEvent.click( screen.getByRole( "button", { name: "Select" } ) );
		fireEvent.click( screen.getByRole( "menuitem", { name: "Deselect all" } ) );
		expect( onDeselectAll ).toHaveBeenCalled();
	} );

	it( "lets a filter add items to the Select menu", () => {
		addFilter( SELECT_MENU_ITEMS_FILTER, "test/smart-select", ( items ) => [
			...items,
			{ key: "needs-titles", label: "Select pages needing titles", onClick: jest.fn() },
		] );

		render( <SelectionToolbar { ...toolbarProps } /> );
		fireEvent.click( screen.getByRole( "button", { name: "Select" } ) );

		expect( screen.getByRole( "menuitem", { name: "Select pages needing titles" } ) ).toBeInTheDocument();

		removeFilter( SELECT_MENU_ITEMS_FILTER, "test/smart-select" );
	} );
} );

describe( "BulkActions", () => {
	it( "shows the Free AI generate affordances when not Premium", () => {
		render( <BulkActions isPremium={ false } /> );

		expect( screen.getByRole( "button", { name: "Generate SEO titles" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Generate meta descriptions" } ) ).toBeInTheDocument();
	} );

	it( "does not render the Free affordances for Premium", () => {
		render( <BulkActions isPremium={ true } /> );

		expect( screen.queryByRole( "button", { name: "Generate SEO titles" } ) ).not.toBeInTheDocument();
	} );

	it( "hides the Free AI generate affordances when the AI feature is disabled", () => {
		render( <BulkActions isPremium={ false } isAiEnabled={ false } /> );

		expect( screen.queryByRole( "button", { name: "Generate SEO titles" } ) ).not.toBeInTheDocument();
		expect( screen.queryByRole( "button", { name: "Generate meta descriptions" } ) ).not.toBeInTheDocument();
	} );

	it( "shows the Free AI generate affordances when the AI feature is enabled", () => {
		render( <BulkActions isPremium={ false } isAiEnabled={ true } /> );

		expect( screen.getByRole( "button", { name: "Generate SEO titles" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Generate meta descriptions" } ) ).toBeInTheDocument();
	} );

	it( "passes the selection and active view to the Premium slot fill", () => {
		let received = null;
		render(
			<SlotFillProvider>
				<BulkActions isPremium={ true } isActive={ true } selectedIds={ [ 1, 2 ] } activeFieldSet="search" contentType="post" />
				<Fill name={ BULK_ACTIONS_SLOT }>
					{ ( fillProps ) => {
						received = fillProps;
						return <span>Premium AI buttons</span>;
					} }
				</Fill>
			</SlotFillProvider>
		);

		expect( screen.getByText( "Premium AI buttons" ) ).toBeInTheDocument();
		expect( received ).toEqual( { selectedIds: [ 1, 2 ], activeFieldSet: "search", contentType: "post" } );
	} );

	it( "opens the upsell modal from a Free AI generate button", () => {
		render( <BulkActions isPremium={ false } contentType="post" /> );

		// The modal stays closed until a Generate button is clicked.
		expect( screen.queryByRole( "heading", { name: "Generate Metadata in Bulk" } ) ).not.toBeInTheDocument();

		fireEvent.click( screen.getByRole( "button", { name: "Generate SEO titles" } ) );

		expect( screen.getByRole( "heading", { name: "Generate Metadata in Bulk" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "link", { name: /Unlock with Yoast SEO Premium/ } ) ).toHaveAttribute( "href", "https://yoa.st/bulk-editor-ai-upsell" );
	} );
} );
