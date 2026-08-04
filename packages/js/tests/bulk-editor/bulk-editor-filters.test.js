import { dispatch, select } from "@wordpress/data";
import { fireEvent, render, screen } from "../test-utils";
import { BulkEditorFilters } from "../../src/bulk-editor/components/bulk-editor-filters";
import { FIELD_SET_SOCIAL, STORE_NAME } from "../../src/bulk-editor/constants";
import registerStore from "../../src/bulk-editor/store";

describe( "BulkEditorFilters", () => {
	beforeAll( () => {
		// Seeded with a carried-over overview selection, like initialize.js does, so the
		// "Overview selection" filter is offered.
		registerStore( { initialState: { query: { overviewIds: [ 5, 3 ], isOverviewFilterActive: true } } } );
	} );

	beforeEach( () => {
		// Reset the filters and tab so the tests stay order-independent.
		dispatch( STORE_NAME ).setStatuses( [] );
		dispatch( STORE_NAME ).setNeedsImprovement( [] );
		dispatch( STORE_NAME ).setActiveFieldSet( "search" );
		dispatch( STORE_NAME ).setOverviewFilterActive( false );
	} );

	it( "renders the Filters button without a count badge when nothing is applied", () => {
		render( <BulkEditorFilters /> );

		expect( screen.getByRole( "button", { name: /Filters/ } ) ).toBeInTheDocument();
		expect( screen.queryByText( "1" ) ).not.toBeInTheDocument();
	} );

	it( "opens the popover with the four status options", () => {
		render( <BulkEditorFilters /> );

		fireEvent.click( screen.getByRole( "button", { name: /Filters/ } ) );

		expect( screen.getByRole( "checkbox", { name: "Published" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "checkbox", { name: "Scheduled" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "checkbox", { name: "Pending" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "checkbox", { name: "Draft" } ) ).toBeInTheDocument();
	} );

	it( "applies a status filter, updates the store and shows the applied-count badge", () => {
		render( <BulkEditorFilters /> );

		fireEvent.click( screen.getByRole( "button", { name: /Filters/ } ) );
		fireEvent.click( screen.getByRole( "checkbox", { name: "Draft" } ) );

		expect( select( STORE_NAME ).selectStatuses() ).toEqual( [ "draft" ] );
		expect( screen.getByText( "1" ) ).toBeInTheDocument();
	} );

	it( "shows the SEO-worded needs-improvement options on the search tab", () => {
		render( <BulkEditorFilters /> );

		fireEvent.click( screen.getByRole( "button", { name: /Filters/ } ) );

		expect( screen.getByRole( "checkbox", { name: "SEO titles" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "checkbox", { name: "Meta descriptions" } ) ).toBeInTheDocument();
	} );

	it( "relabels the needs-improvement options for the social tab", () => {
		dispatch( STORE_NAME ).setActiveFieldSet( FIELD_SET_SOCIAL );
		render( <BulkEditorFilters /> );

		fireEvent.click( screen.getByRole( "button", { name: /Filters/ } ) );

		expect( screen.getByRole( "checkbox", { name: "Social titles" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "checkbox", { name: "Social descriptions" } ) ).toBeInTheDocument();
	} );

	it( "groups the needs-improvement options under an accessible 'Needs improvement' legend, so the red dot's meaning is not colour-only", () => {
		render( <BulkEditorFilters /> );

		fireEvent.click( screen.getByRole( "button", { name: /Filters/ } ) );

		expect( screen.getByRole( "group", { name: "Needs improvement" } ) ).toBeInTheDocument();
	} );

	it( "applies a needs-improvement filter, updates the store and counts it in the badge", () => {
		render( <BulkEditorFilters /> );

		fireEvent.click( screen.getByRole( "button", { name: /Filters/ } ) );
		fireEvent.click( screen.getByRole( "checkbox", { name: "SEO titles" } ) );

		expect( select( STORE_NAME ).selectNeedsImprovement() ).toEqual( [ "title" ] );
		expect( screen.getByText( "1" ) ).toBeInTheDocument();
	} );

	it( "offers the Overview selection filter while a carried-over selection exists", () => {
		render( <BulkEditorFilters /> );

		fireEvent.click( screen.getByRole( "button", { name: /Filters/ } ) );

		expect( screen.getByRole( "checkbox", { name: "Overview selection" } ) ).toBeInTheDocument();
	} );

	it( "activates the overview filter, updates the store and counts it in the badge", () => {
		render( <BulkEditorFilters /> );

		fireEvent.click( screen.getByRole( "button", { name: /Filters/ } ) );
		fireEvent.click( screen.getByRole( "checkbox", { name: "Overview selection" } ) );

		expect( select( STORE_NAME ).selectIsOverviewFilterActive() ).toBe( true );
		expect( screen.getByText( "1" ) ).toBeInTheDocument();
	} );

	it( "returns focus to the trigger when the dialog is closed with Escape", () => {
		render( <BulkEditorFilters /> );

		const trigger = screen.getByRole( "button", { name: /Filters/ } );
		fireEvent.click( trigger );
		// Move focus into the dialog, mirroring a keyboard user tabbing onto a checkbox.
		screen.getByRole( "checkbox", { name: "Published" } ).focus();

		fireEvent.keyDown( document, { key: "Escape" } );

		expect( screen.queryByRole( "checkbox", { name: "Published" } ) ).not.toBeInTheDocument();
		expect( trigger ).toHaveFocus();
	} );
} );
