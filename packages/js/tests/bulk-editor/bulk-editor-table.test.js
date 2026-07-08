import { fireEvent, render, screen } from "../test-utils";
import { BulkEditorTable } from "../../src/bulk-editor/components/table/bulk-editor-table";
import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL, PAGE_SIZE } from "../../src/bulk-editor/constants";
import { getFieldSets } from "../../src/bulk-editor/field-sets";

const fieldSets = getFieldSets();
const searchFieldSet = fieldSets[ FIELD_SET_SEARCH ];
const socialFieldSet = fieldSets[ FIELD_SET_SOCIAL ];

const items = [
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
		render( <BulkEditorTable items={ items } fieldSet={ searchFieldSet } /> );

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
		render( <BulkEditorTable items={ items } fieldSet={ socialFieldSet } /> );

		expect( screen.getByRole( "columnheader", { name: "Social title" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "columnheader", { name: "Social description" } ) ).toBeInTheDocument();
		expect( screen.getByText( "Social: What Is SEO" ) ).toBeInTheDocument();
		// The Search-only fields are not rendered on the Social tab.
		expect( screen.queryByText( "What Is SEO? Complete Guide" ) ).not.toBeInTheDocument();
	} );

	it( "shows a status label for non-published content only", () => {
		render( <BulkEditorTable items={ items } fieldSet={ searchFieldSet } /> );

		// Plain muted text per the design, not a badge.
		const draftLabels = screen.getAllByText( "- Draft" );
		expect( draftLabels ).toHaveLength( 1 );
	} );

	it( "links the title to the post's edit screen, falling back to plain text without an edit link", () => {
		const rows = [
			{ ...items[ 0 ] },
			{ ...items[ 1 ], title: "No Link Post", editLink: "" },
		];
		render( <BulkEditorTable items={ rows } fieldSet={ searchFieldSet } /> );

		const link = screen.getByRole( "link", { name: /What Is SEO/ } );
		expect( link ).toHaveAttribute( "href", items[ 0 ].editLink );
		// The title link opens the editor in a new tab, with a safe rel and a hidden hint for screen readers.
		expect( link ).toHaveAttribute( "target", "_blank" );
		expect( link ).toHaveAttribute( "rel", "noopener noreferrer" );
		expect( link ).toHaveAccessibleName( "What Is SEO (Opens in a new browser tab)" );

		// A row without an edit link shows the title as plain text, not a link.
		expect( screen.queryByRole( "link", { name: "No Link Post" } ) ).not.toBeInTheDocument();
		expect( screen.getByText( "No Link Post" ) ).toBeInTheDocument();
	} );

	it( "reflects the selected rows and calls the row selection seam", () => {
		const onToggleRow = jest.fn();
		render(
			<BulkEditorTable
				items={ items }
				fieldSet={ searchFieldSet }
				selection={ { selectedIds: [ 1 ], onToggleRow } }
			/>
		);

		expect( screen.getByRole( "checkbox", { name: "Select What Is SEO" } ) ).toBeChecked();
		expect( screen.getByRole( "checkbox", { name: "Select On-Page SEO Checklist" } ) ).not.toBeChecked();

		fireEvent.click( screen.getByRole( "checkbox", { name: "Select On-Page SEO Checklist" } ) );
		expect( onToggleRow ).toHaveBeenCalledWith( 2 );
	} );

	it( "enters edit mode through the editing seam with a row-specific Edit name", () => {
		const onStartEdit = jest.fn();
		render( <BulkEditorTable items={ items } fieldSet={ searchFieldSet } editing={ { onStartEdit } } /> );

		// Accessible names are contextual, so there is no ambiguous "Edit" button.
		expect( screen.queryByRole( "button", { name: "Edit" } ) ).not.toBeInTheDocument();
		fireEvent.click( screen.getByRole( "button", { name: "Edit On-Page SEO Checklist" } ) );
		expect( onStartEdit ).toHaveBeenCalledWith( 2 );
	} );

	it( "marks column and row headers with scope", () => {
		render( <BulkEditorTable items={ items } fieldSet={ searchFieldSet } /> );

		expect( screen.getByRole( "columnheader", { name: "Title" } ) ).toHaveAttribute( "scope", "col" );
		// The title cell is the row header.
		const rowHeader = screen.getByRole( "rowheader", { name: /What Is SEO/ } );
		expect( rowHeader ).toHaveAttribute( "scope", "row" );
	} );

	it( "renders skeleton rows on the initial load when there are no previous items", () => {
		render( <BulkEditorTable items={ [] } fieldSet={ searchFieldSet } isLoading={ true } /> );

		expect( screen.queryAllByRole( "button" ) ).toHaveLength( 0 );
		// The column header row and a full page of skeleton rows.
		expect( screen.getAllByRole( "row" ) ).toHaveLength( 1 + PAGE_SIZE );
		// The table reports it is busy and the loading state is announced.
		expect( screen.getByRole( "table" ) ).toHaveAttribute( "aria-busy", "true" );
		expect( screen.getByRole( "status" ) ).toHaveTextContent( "Loading content…" );
	} );

	it( "keeps existing rows visible while reloading and exposes aria-busy", () => {
		render( <BulkEditorTable items={ items } fieldSet={ searchFieldSet } isLoading={ true } /> );

		// Items stay in the DOM (dimmed via opacity transition) instead of being replaced by skeleton rows.
		expect( screen.getByText( "What Is SEO? Complete Guide" ) ).toBeInTheDocument();
		expect( screen.getByRole( "table" ) ).toHaveAttribute( "aria-busy", "true" );
		expect( screen.getByRole( "status" ) ).toHaveTextContent( "Loading content…" );
	} );

	it( "renders an empty state when there are no rows", () => {
		render( <BulkEditorTable items={ [] } fieldSet={ searchFieldSet } /> );

		expect( screen.getByText( "No content found." ) ).toBeInTheDocument();
	} );

	it( "renders the bulk-actions content when provided", () => {
		render(
			<BulkEditorTable
				items={ items }
				fieldSet={ searchFieldSet }
				bulkActions={ <span>Bulk actions</span> }
				showBulkActions={ true }
			/>
		);

		expect( screen.getByText( "Bulk actions" ) ).toBeInTheDocument();
	} );

	it( "renders the footer in a tfoot and squares the last body row only when a footer is present", () => {
		const { rerender, container } = render(
			<BulkEditorTable items={ items } fieldSet={ searchFieldSet } footer={ <span>Footer content</span> } />
		);

		// The footer renders inside the table's own tfoot, so it sits in the table card.
		const tfoot = container.querySelector( "table tfoot" );
		expect( tfoot ).toBeInTheDocument();
		expect( tfoot ).toContainElement( screen.getByText( "Footer content" ) );
		// With a footer, the last body row's bottom corners are squared so the footer owns them.
		expect( screen.getByRole( "table" ).className ).toContain( "yst-rounded-none" );

		// Without a footer: no tfoot row, and the last-row rounding override is dropped.
		rerender( <BulkEditorTable items={ items } fieldSet={ searchFieldSet } footer={ null } /> );
		expect( container.querySelector( "table tfoot" ) ).not.toBeInTheDocument();
		expect( screen.queryByText( "Footer content" ) ).not.toBeInTheDocument();
		expect( screen.getByRole( "table" ).className ).not.toContain( "yst-rounded-none" );
	} );

	it( "renders a textarea per open field with a single row-level Save and Cancel", () => {
		render(
			<BulkEditorTable
				items={ items }
				fieldSet={ searchFieldSet }
				editing={ {
					editingRows: {
						2: { openFields: [ "seoTitle", "metaDescription" ], draft: { seoTitle: "Draft title", metaDescription: "Draft description" }, savingFields: {} },
					},
				} }
			/>
		);

		const title = screen.getByRole( "textbox", { name: "SEO title for On-Page SEO Checklist" } );
		const description = screen.getByRole( "textbox", { name: "Meta description for On-Page SEO Checklist" } );
		expect( title ).toHaveValue( "Draft title" );
		expect( description ).toHaveValue( "Draft description" );
		// Equal-height two-line fields per the design (full text view, no scrollbar).
		expect( title.tagName ).toBe( "TEXTAREA" );
		expect( description.tagName ).toBe( "TEXTAREA" );
		expect( title ).toHaveAttribute( "rows", "2" );

		// No per-field Apply/Discard: the row has a single Save and Cancel.
		expect( screen.queryByRole( "button", { name: "Apply SEO title for On-Page SEO Checklist" } ) ).not.toBeInTheDocument();
		expect( screen.queryByRole( "button", { name: "Discard SEO title for On-Page SEO Checklist" } ) ).not.toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Save On-Page SEO Checklist" } ) ).toBeEnabled();
		expect( screen.getByRole( "button", { name: "Cancel editing On-Page SEO Checklist" } ) ).toBeEnabled();

		// The editing row no longer offers Edit.
		expect( screen.queryByRole( "button", { name: "Edit On-Page SEO Checklist" } ) ).not.toBeInTheDocument();
	} );

	it( "cancels all of a row's open fields at once through the editing seam", () => {
		const onCancelEdit = jest.fn();
		render(
			<BulkEditorTable
				items={ items }
				fieldSet={ searchFieldSet }
				editing={ {
					editingRows: { 2: { openFields: [ "seoTitle", "metaDescription" ], draft: { seoTitle: "A", metaDescription: "B" }, savingFields: {} } },
					onCancelEdit,
				} }
			/>
		);

		fireEvent.click( screen.getByRole( "button", { name: "Cancel editing On-Page SEO Checklist" } ) );
		expect( onCancelEdit ).toHaveBeenCalledWith( 2 );
	} );

	it( "edits the focus keyphrase, which leads both field sets", () => {
		render(
			<BulkEditorTable
				items={ items }
				fieldSet={ searchFieldSet }
				editing={ { editingRows: { 2: { openFields: [ "focusKeyphrase" ], draft: { focusKeyphrase: "draft keyphrase" }, savingFields: {} } } } }
			/>
		);

		const input = screen.getByRole( "textbox", { name: "Focus keyphrase for On-Page SEO Checklist" } );
		expect( input ).toHaveValue( "draft keyphrase" );
		expect( screen.getByRole( "button", { name: "Save On-Page SEO Checklist" } ) ).toBeInTheDocument();
	} );

	it( "renders only the open fields as inputs, the rest as text", () => {
		render(
			<BulkEditorTable
				items={ items }
				fieldSet={ searchFieldSet }
				editing={ { editingRows: { 2: { openFields: [ "metaDescription" ], draft: { metaDescription: "Draft description" }, savingFields: {} } } } }
			/>
		);

		expect( screen.getByRole( "textbox", { name: "Meta description for On-Page SEO Checklist" } ) ).toBeInTheDocument();
		// The SEO title was resolved/closed, so it is no longer an input.
		expect( screen.queryByRole( "textbox", { name: "SEO title for On-Page SEO Checklist" } ) ).not.toBeInTheDocument();
	} );

	it( "calls onChangeField on input, and onApplyField for every open field when Save is clicked", () => {
		const onChangeField = jest.fn();
		const onApplyField = jest.fn();
		render(
			<BulkEditorTable
				items={ items }
				fieldSet={ searchFieldSet }
				editing={ {
					editingRows: { 2: { openFields: [ "seoTitle", "metaDescription" ], draft: { seoTitle: "Draft title", metaDescription: "Draft description" }, savingFields: {} } },
					onChangeField,
					onApplyField,
				} }
			/>
		);

		fireEvent.change(
			screen.getByRole( "textbox", { name: "SEO title for On-Page SEO Checklist" } ),
			{ target: { value: "Changed" } }
		);
		expect( onChangeField ).toHaveBeenCalledWith( { id: 2, key: "seoTitle", value: "Changed" } );

		// Save saves every open field on the row.
		fireEvent.click( screen.getByRole( "button", { name: "Save On-Page SEO Checklist" } ) );
		expect( onApplyField ).toHaveBeenCalledTimes( 2 );
		expect( onApplyField ).toHaveBeenCalledWith( { id: 2, key: "seoTitle" } );
		expect( onApplyField ).toHaveBeenCalledWith( { id: 2, key: "metaDescription" } );
	} );

	it( "disables the row's inputs and actions while it is saving", () => {
		render(
			<BulkEditorTable
				items={ items }
				fieldSet={ searchFieldSet }
				editing={ {
					editingRows: {
						2: { openFields: [ "seoTitle", "metaDescription" ], draft: { seoTitle: "Draft title", metaDescription: "Draft description" }, savingFields: { seoTitle: true } },
					},
				} }
			/>
		);

		// While any field on the row is saving, the whole row is locked.
		expect( screen.getByRole( "textbox", { name: "SEO title for On-Page SEO Checklist" } ) ).toBeDisabled();
		expect( screen.getByRole( "textbox", { name: "Meta description for On-Page SEO Checklist" } ) ).toBeDisabled();
		expect( screen.getByRole( "button", { name: "Save On-Page SEO Checklist" } ) ).toBeDisabled();
		expect( screen.getByRole( "button", { name: "Cancel editing On-Page SEO Checklist" } ) ).toBeDisabled();
	} );

	it( "leaves other rows' Edit enabled while one row is being edited", () => {
		render(
			<BulkEditorTable
				items={ items }
				fieldSet={ searchFieldSet }
				editing={ { editingRows: { 2: { openFields: [ "seoTitle" ], draft: { seoTitle: "Draft title" }, savingFields: {} } } } }
			/>
		);

		// The editing row shows Cancel; the other row keeps its (enabled) Edit.
		expect( screen.getByRole( "button", { name: "Cancel editing On-Page SEO Checklist" } ) ).toBeEnabled();
		expect( screen.getByRole( "button", { name: "Edit What Is SEO" } ) ).toBeEnabled();
	} );

	it( "edits several rows at the same time", () => {
		render(
			<BulkEditorTable
				items={ items }
				fieldSet={ searchFieldSet }
				editing={ {
					editingRows: {
						1: { openFields: [ "seoTitle" ], draft: { seoTitle: "First" }, savingFields: {} },
						2: { openFields: [ "seoTitle" ], draft: { seoTitle: "Second" }, savingFields: {} },
					},
				} }
			/>
		);

		expect( screen.getByRole( "textbox", { name: "SEO title for What Is SEO" } ) ).toHaveValue( "First" );
		expect( screen.getByRole( "textbox", { name: "SEO title for On-Page SEO Checklist" } ) ).toHaveValue( "Second" );
	} );
} );
