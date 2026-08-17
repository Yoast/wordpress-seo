import { Fill, SlotFillProvider } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { addFilter, removeFilter } from "@wordpress/hooks";
import { fireEvent, render, screen } from "../test-utils";
import { BulkActions, ManualReviewActions, ManualSaveErrorNotice, SelectionToolbar } from "../../src/bulk-editor/components/bulk-action-bar";
import { BULK_ACTIONS_SLOT, SELECT_MENU_ITEMS_FILTER } from "../../src/bulk-editor/constants";

// The hook is covered by use-ai-upsell.test.js; here it just feeds the modal a static upsell.
jest.mock( "../../src/bulk-editor/hooks/use-ai-upsell", () => ( {
	useAiUpsell: () => ( {
		upsellLabel: "Unlock with Yoast SEO Premium",
		upsellLink: "https://yoa.st/bulk-editor-ai-upsell",
		ctbId: "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
	} ),
} ) );

// FreeBulkActions reads isPremium / isPremiumVersionSupported / isAiEnabled from the store.
// Mock the whole module so we can control those values per test without needing a real store.
jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
} ) );

/**
 * Sets up the useSelect mock to return the given store preferences.
 *
 * @param {Object} prefs Partial preference overrides; unset keys fall back to safe defaults.
 */
const mockPreferences = ( prefs = {} ) => {
	const defaults = { isPremium: false, isPremiumVersionSupported: false, isAiEnabled: false, premiumUpdateUrl: "" };
	const merged = { ...defaults, ...prefs };
	useSelect.mockImplementation( ( selector ) =>
		selector( () => ( {
			selectPreference: ( key, defaultVal ) => ( key in merged ? merged[ key ] : defaultVal ),
		} ) )
	);
};

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

	it( "renders a smart-select item with a short label but a full accessible name, and runs its onClick", () => {
		const onClick = jest.fn();
		const smartSelectItems = [ {
			key: "needs-improvement",
			label: "SEO titles",
			ariaLabel: "Select pages with SEO titles that need improvement",
			onClick,
		} ];

		render( <SelectionToolbar { ...toolbarProps } smartSelectItems={ smartSelectItems } /> );
		fireEvent.click( screen.getByRole( "button", { name: "Select" } ) );

		const item = screen.getByRole( "menuitem", { name: "Select pages with SEO titles that need improvement" } );
		expect( item ).toHaveTextContent( "SEO titles" );

		fireEvent.click( item );
		expect( onClick ).toHaveBeenCalled();
	} );
} );

describe( "ManualReviewActions", () => {
	const reviewProps = { editCount: 2, onApplyAll: jest.fn(), onDiscardAll: jest.fn() };

	it( "shows a singular summary for a single edited row", () => {
		render( <ManualReviewActions { ...reviewProps } editCount={ 1 } /> );

		expect( screen.getByText( "1 row with unsaved changes" ) ).toBeInTheDocument();
	} );

	it( "shows a plural summary for multiple edited rows", () => {
		render( <ManualReviewActions { ...reviewProps } editCount={ 3 } /> );

		expect( screen.getByText( "3 rows with unsaved changes" ) ).toBeInTheDocument();
	} );

	it( "applies and discards all from the actions", () => {
		const onApplyAll = jest.fn();
		const onDiscardAll = jest.fn();
		render( <ManualReviewActions { ...reviewProps } onApplyAll={ onApplyAll } onDiscardAll={ onDiscardAll } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Save edits" } ) );
		expect( onApplyAll ).toHaveBeenCalled();

		fireEvent.click( screen.getByRole( "button", { name: "Cancel edits" } ) );
		expect( onDiscardAll ).toHaveBeenCalled();
	} );

	it( "disables both actions while an apply-all is in flight", () => {
		render( <ManualReviewActions { ...reviewProps } isApplying={ true } /> );

		expect( screen.getByRole( "button", { name: "Save edits" } ) ).toBeDisabled();
		expect( screen.getByRole( "button", { name: "Cancel edits" } ) ).toBeDisabled();
	} );
} );

describe( "ManualSaveErrorNotice", () => {
	it( "shows the heading and the alert copy", () => {
		render( <ManualSaveErrorNotice onDismiss={ jest.fn() } /> );

		expect( screen.getByText( "Couldn't save your edits." ) ).toBeInTheDocument();
		expect( screen.getByRole( "alert" ) ).toHaveTextContent( "Something went wrong. Please try again." );
	} );

	it( "dismisses from the close button", () => {
		const onDismiss = jest.fn();
		render( <ManualSaveErrorNotice onDismiss={ onDismiss } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Dismiss" } ) );
		expect( onDismiss ).toHaveBeenCalled();
	} );
} );

describe( "BulkActions", () => {
	beforeEach( () => mockPreferences() );

	it( "shows the Free AI generate affordances when not Premium", () => {
		mockPreferences( { isAiEnabled: true } );
		render( <BulkActions /> );

		expect( screen.getByRole( "button", { name: "Generate SEO titles" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Generate meta descriptions" } ) ).toBeInTheDocument();
	} );

	it( "shows the review actions alongside the still-enabled Free generate affordances while editing", () => {
		mockPreferences( { isAiEnabled: true } );
		render(
			<BulkActions
				isActive={ true } hasUnsavedEdits={ true }
				editCount={ 2 } onApplyAll={ jest.fn() } onDiscardAll={ jest.fn() }
			/>
		);

		expect( screen.getByRole( "button", { name: "Save edits" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Cancel edits" } ) ).toBeInTheDocument();
		// Free's generate buttons stay put and enabled so the upsell can still be triggered while editing.
		expect( screen.getByRole( "button", { name: "Generate SEO titles" } ) ).toBeEnabled();
		expect( screen.getByRole( "button", { name: "Generate meta descriptions" } ) ).toBeEnabled();
	} );

	it( "does not render the Free affordances for Premium", () => {
		// isAiEnabled defaults to false → FreeBulkActions returns null.
		render( <BulkActions /> );

		expect( screen.queryByRole( "button", { name: "Generate SEO titles" } ) ).not.toBeInTheDocument();
	} );

	it( "hides the Free AI generate affordances when the AI feature is disabled", () => {
		// isAiEnabled defaults to false → FreeBulkActions returns null.
		render( <BulkActions /> );

		expect( screen.queryByRole( "button", { name: "Generate SEO titles" } ) ).not.toBeInTheDocument();
		expect( screen.queryByRole( "button", { name: "Generate meta descriptions" } ) ).not.toBeInTheDocument();
	} );

	it( "shows the Free AI generate affordances when the AI feature is enabled", () => {
		mockPreferences( { isAiEnabled: true } );
		render( <BulkActions /> );

		expect( screen.getByRole( "button", { name: "Generate SEO titles" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Generate meta descriptions" } ) ).toBeInTheDocument();
	} );

	it( "passes the selection and active view to the Premium slot fill", () => {
		let received = null;
		render(
			<SlotFillProvider>
				<BulkActions isActive={ true } selectedIds={ [ 1, 2 ] } activeFieldSet="search" contentType="post" />
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
		mockPreferences( { isAiEnabled: true, isPremium: false } );
		render( <BulkActions contentType="post" /> );

		// The modal stays closed until a Generate button is clicked.
		expect( screen.queryByRole( "heading", { name: "Generate Metadata in Bulk" } ) ).not.toBeInTheDocument();

		fireEvent.click( screen.getByRole( "button", { name: "Generate SEO titles" } ) );

		expect( screen.getByRole( "heading", { name: "Generate Metadata in Bulk" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "link", { name: /Unlock with Yoast SEO Premium/ } ) ).toHaveAttribute( "href", "https://yoa.st/bulk-editor-ai-upsell" );
	} );

	it( "shows the save-error notice on the active tab when a save failed", () => {
		const onDismissSaveError = jest.fn();
		render( <BulkActions isActive={ true } hasSaveError={ true } onDismissSaveError={ onDismissSaveError } /> );

		expect( screen.getByText( "Couldn't save your edits." ) ).toBeInTheDocument();
		fireEvent.click( screen.getByRole( "button", { name: "Dismiss" } ) );
		expect( onDismissSaveError ).toHaveBeenCalled();
	} );

	it( "does not show the save-error notice when there is no error", () => {
		render( <BulkActions isActive={ true } hasSaveError={ false } /> );

		expect( screen.queryByText( "Couldn't save your edits." ) ).not.toBeInTheDocument();
	} );
} );
