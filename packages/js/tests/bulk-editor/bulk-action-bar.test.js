import { addFilter, removeFilter } from "@wordpress/hooks";
import { fireEvent, render, screen } from "../test-utils";
import { BulkActions, SelectionToolbar } from "../../src/bulk-editor/components/bulk-action-bar";
import { SELECT_MENU_ITEMS_FILTER } from "../../src/bulk-editor/constants";

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

	it( "toggles all rows from the master checkbox", () => {
		const onToggleAll = jest.fn();
		render( <SelectionToolbar { ...toolbarProps } onToggleAll={ onToggleAll } /> );

		fireEvent.click( screen.getByRole( "checkbox", { name: "Select all" } ) );
		expect( onToggleAll ).toHaveBeenCalled();
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

	it( "does not render the Free affordances for Premium (the slot is filled instead)", () => {
		render( <BulkActions isPremium={ true } /> );

		expect( screen.queryByRole( "button", { name: "Generate SEO titles" } ) ).not.toBeInTheDocument();
	} );
} );
