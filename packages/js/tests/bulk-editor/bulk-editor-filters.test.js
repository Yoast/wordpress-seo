import { dispatch, select } from "@wordpress/data";
import { fireEvent, render, screen } from "../test-utils";
import { BulkEditorFilters } from "../../src/bulk-editor/components/bulk-editor-filters";
import { FIELD_SET_SOCIAL, STORE_NAME } from "../../src/bulk-editor/constants";
import registerStore from "../../src/bulk-editor/store";

describe( "BulkEditorFilters", () => {
	beforeAll( () => {
		registerStore();
	} );

	beforeEach( () => {
		// Reset the filters and tab so the tests stay order-independent.
		dispatch( STORE_NAME ).setStatuses( [] );
		dispatch( STORE_NAME ).setNeedsImprovement( [] );
		dispatch( STORE_NAME ).setActiveFieldSet( "search" );
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

		expect( screen.getByRole( "checkbox", { name: "SEO title needs improvement" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "checkbox", { name: "Meta description needs improvement" } ) ).toBeInTheDocument();
	} );

	it( "relabels the needs-improvement options for the social tab", () => {
		dispatch( STORE_NAME ).setActiveFieldSet( FIELD_SET_SOCIAL );
		render( <BulkEditorFilters /> );

		fireEvent.click( screen.getByRole( "button", { name: /Filters/ } ) );

		expect( screen.getByRole( "checkbox", { name: "Social title needs improvement" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "checkbox", { name: "Social description needs improvement" } ) ).toBeInTheDocument();
	} );

	it( "applies a needs-improvement filter, updates the store and counts it in the badge", () => {
		render( <BulkEditorFilters /> );

		fireEvent.click( screen.getByRole( "button", { name: /Filters/ } ) );
		fireEvent.click( screen.getByRole( "checkbox", { name: "SEO title needs improvement" } ) );

		expect( select( STORE_NAME ).selectNeedsImprovement() ).toEqual( [ "title" ] );
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
