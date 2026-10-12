import { SlotFillProvider } from "@wordpress/components";
import { OverviewSelectionNotice } from "../../src/bulk-editor/components/overview-selection-notice";
import { BulkEditorContent } from "../../src/bulk-editor/components/bulk-editor-content";
import { DataProvider } from "../../src/bulk-editor/services";
import registerStore from "../../src/bulk-editor/store";
import { fireEvent, render, screen } from "../test-utils";

const NOTICE_TEXT = "Only the first 20 items from your selection were carried over. The bulk editor supports up to 20 items at a time.";

// The store registers once for the whole file: the WP data registry is global, so a second register would
// clash. Seeded like initialize.js does for a selection carried over from the WP admin overview.
beforeAll( () => {
	registerStore( {
		initialState: {
			activeContentType: "post",
			selection: { selectedIds: Array.from( { length: 20 }, ( _, index ) => index + 1 ), preselectedTotal: 25 },
		},
	} );
} );

describe( "OverviewSelectionNotice", () => {
	it( "explains that only the first batch of the overview selection is selected", () => {
		render( <OverviewSelectionNotice total={ 25 } onDismiss={ jest.fn() } /> );

		expect( screen.getByText( NOTICE_TEXT ) ).toBeInTheDocument();
	} );

	it( "calls onDismiss when the dismiss button is clicked", () => {
		const onDismiss = jest.fn();
		render( <OverviewSelectionNotice total={ 25 } onDismiss={ onDismiss } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Dismiss" } ) );

		expect( onDismiss ).toHaveBeenCalledTimes( 1 );
	} );

	it( "renders nothing while the whole selection fits the batch", () => {
		const { container } = render( <OverviewSelectionNotice total={ 20 } onDismiss={ jest.fn() } /> );

		expect( container ).toBeEmptyDOMElement();
	} );
} );

describe( "BulkEditorContent with a carried-over overview selection", () => {
	const dataProvider = new DataProvider( {
		contentTypes: [ { name: "post", label: "Posts", singularLabel: "Post" } ],
		endpoints: { posts: "https://example.com/wp-json/yoast/v1/bulk_editor/posts" },
		links: {},
	} );
	// The data layer is covered by use-posts.test.js; the request stays pending here.
	const remoteDataProvider = { fetchJson: jest.fn( () => new Promise( () => {} ) ) };

	const renderContent = () => render(
		<SlotFillProvider>
			<BulkEditorContent
				dataProvider={ dataProvider }
				remoteDataProvider={ remoteDataProvider }
				contentType="post"
				contentTypeLabel="Posts"
				contentTypeSingularLabel="Post"
			/>
		</SlotFillProvider>
	);

	it( "shows the notice inside the expanded bulk-actions row and hides it on dismiss", () => {
		const { container } = renderContent();

		const notice = screen.getByText( NOTICE_TEXT );
		expect( notice ).toBeInTheDocument();
		// The notice renders inside the table's bulk-actions row (between the Select toolbar and the band),
		// which the notice itself keeps expanded.
		const bandRow = notice.closest( "tr" );
		expect( bandRow ).not.toBeNull();
		expect( bandRow ).toHaveAttribute( "aria-hidden", "false" );

		fireEvent.click( screen.getByRole( "button", { name: "Dismiss" } ) );

		expect( document.activeElement ).toBe( screen.getByRole( "button", { name: "Select" } ) );
		expect( screen.queryByText( NOTICE_TEXT ) ).not.toBeInTheDocument();
		// Nothing else occupies the band here (AI is disabled, no edits), so dismissing collapses the row.
		container.querySelectorAll( "tr[aria-hidden]" ).forEach( ( row ) => {
			expect( row ).toHaveAttribute( "aria-hidden", "true" );
		} );
	} );
} );
