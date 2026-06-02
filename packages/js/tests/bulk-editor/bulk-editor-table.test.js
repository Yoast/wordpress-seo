import { fireEvent, render, screen } from "../test-utils";
import { noop } from "lodash";
import { BulkEditorTable } from "../../src/bulk-editor/components/bulk-editor-table";
import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL, getFieldSets } from "../../src/bulk-editor/field-sets";

const fieldSets = getFieldSets();
const searchFieldSet = fieldSets[ FIELD_SET_SEARCH ];
const socialFieldSet = fieldSets[ FIELD_SET_SOCIAL ];

const rows = [
	{
		id: 1,
		title: "What Is SEO",
		status: "publish",
		editLink: "https://example.test/wp-admin/post.php?post=1&action=edit",
		focusKeyphrase: "what is seo",
		seoTitle: "What Is SEO? Complete Guide",
		metaDescription: "Learn what SEO is.",
		socialTitle: "Social: What Is SEO",
		socialDescription: "Social description for SEO.",
	},
	{
		id: 2,
		title: "On-Page SEO Checklist",
		status: "draft",
		editLink: "https://example.test/wp-admin/post.php?post=2&action=edit",
		focusKeyphrase: "on page seo",
		seoTitle: "On-Page SEO Checklist",
		metaDescription: "Follow this on-page checklist.",
		socialTitle: "Social: On-Page SEO",
		socialDescription: "Social description for on-page.",
	},
];

describe( "BulkEditorTable", () => {
	it( "renders the Search field set columns and a row's data", () => {
		render( <BulkEditorTable rows={ rows } fieldSet={ searchFieldSet } /> );

		// Fixed + field-set headers.
		expect( screen.getByRole( "columnheader", { name: "Title" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "columnheader", { name: "Focus keyphrase" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "columnheader", { name: "SEO title" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "columnheader", { name: "Meta description" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "columnheader", { name: "Actions" } ) ).toBeInTheDocument();

		// Row data for the Search field set.
		expect( screen.getByText( "What Is SEO? Complete Guide" ) ).toBeInTheDocument();
		expect( screen.getByText( "Learn what SEO is." ) ).toBeInTheDocument();
	} );

	it( "renders the Social field set columns and values", () => {
		render( <BulkEditorTable rows={ rows } fieldSet={ socialFieldSet } /> );

		expect( screen.getByRole( "columnheader", { name: "Social title" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "columnheader", { name: "Social description" } ) ).toBeInTheDocument();
		expect( screen.getByText( "Social: What Is SEO" ) ).toBeInTheDocument();
		// The Search-only fields are not rendered on the Social tab.
		expect( screen.queryByText( "What Is SEO? Complete Guide" ) ).not.toBeInTheDocument();
	} );

	it( "shows a status label for non-published content only", () => {
		render( <BulkEditorTable rows={ rows } fieldSet={ searchFieldSet } /> );

		const draftLabels = screen.getAllByText( "Draft" );
		expect( draftLabels ).toHaveLength( 1 );
	} );

	it( "reflects the selected rows and calls the selection seams", () => {
		const onToggleRow = jest.fn();
		const onToggleAll = jest.fn();
		render(
			<BulkEditorTable
				rows={ rows }
				fieldSet={ searchFieldSet }
				selection={ { selectedIds: [ 1 ], onToggleRow, onToggleAll } }
			/>
		);

		expect( screen.getByRole( "checkbox", { name: "Select What Is SEO" } ) ).toBeChecked();
		expect( screen.getByRole( "checkbox", { name: "Select On-Page SEO Checklist" } ) ).not.toBeChecked();

		fireEvent.click( screen.getByRole( "checkbox", { name: "Select On-Page SEO Checklist" } ) );
		expect( onToggleRow ).toHaveBeenCalledWith( 2 );

		fireEvent.click( screen.getByRole( "checkbox", { name: "Select all pages" } ) );
		expect( onToggleAll ).toHaveBeenCalled();
	} );

	it( "gives each Edit button a row-specific accessible name", () => {
		const onEdit = jest.fn();
		render( <BulkEditorTable rows={ rows } fieldSet={ searchFieldSet } onEdit={ onEdit } /> );

		// Accessible names are contextual, so there is no ambiguous "Edit" button.
		expect( screen.queryByRole( "button", { name: "Edit" } ) ).not.toBeInTheDocument();
		fireEvent.click( screen.getByRole( "button", { name: "Edit On-Page SEO Checklist" } ) );
		expect( onEdit ).toHaveBeenCalledWith( 2 );
	} );

	it( "marks column and row headers with scope", () => {
		render( <BulkEditorTable rows={ rows } fieldSet={ searchFieldSet } /> );

		expect( screen.getByRole( "columnheader", { name: "Title" } ) ).toHaveAttribute( "scope", "col" );
		// The title cell is the row header.
		const rowHeader = screen.getByRole( "rowheader", { name: /What Is SEO/ } );
		expect( rowHeader ).toHaveAttribute( "scope", "row" );
	} );

	it( "renders skeleton rows while loading, announces it, and exposes aria-busy", () => {
		render( <BulkEditorTable rows={ rows } fieldSet={ searchFieldSet } isLoading={ true } /> );

		expect( screen.queryByText( "What Is SEO? Complete Guide" ) ).not.toBeInTheDocument();
		expect( screen.queryAllByRole( "button" ) ).toHaveLength( 0 );
		// The "select all" checkbox is disabled while loading.
		expect( screen.getByRole( "checkbox", { name: "Select all pages" } ) ).toBeDisabled();
		// The table reports it is busy and the loading state is announced.
		expect( screen.getByRole( "table" ) ).toHaveAttribute( "aria-busy", "true" );
		expect( screen.getByRole( "status" ) ).toHaveTextContent( "Loading content…" );
	} );

	it( "renders an empty state when there are no rows", () => {
		render( <BulkEditorTable rows={ [] } fieldSet={ searchFieldSet } onEdit={ noop } /> );

		expect( screen.getByText( "No content found." ) ).toBeInTheDocument();
	} );
} );
