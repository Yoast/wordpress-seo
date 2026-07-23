import { SlotFillProvider } from "@wordpress/components";
import { OverviewExclusionNotice } from "../../src/bulk-editor/components/overview-exclusion-notice";
import { BulkEditorContent } from "../../src/bulk-editor/components/bulk-editor-content";
import { DataProvider } from "../../src/bulk-editor/services";
import registerStore from "../../src/bulk-editor/store";
import { fireEvent, render, screen, within } from "../test-utils";

const NOTICE_TEXT = "Your selection has been updated. Private, password-protected, or non-indexed posts can't be bulk edited and were excluded.";
const TRUNCATION_TEXT = "Only the first 20 posts from your selection were carried over. The bulk editor supports up to 20 posts at a time.";

describe( "OverviewExclusionNotice", () => {
	it( "explains that carried-over items were excluded, naming the content type", () => {
		render( <OverviewExclusionNotice hasExclusions={ true } contentTypeLabel="Posts" onDismiss={ jest.fn() } /> );

		expect( screen.getByText( NOTICE_TEXT ) ).toBeInTheDocument();
	} );

	it( "falls back to a generic noun without a content type label", () => {
		render( <OverviewExclusionNotice hasExclusions={ true } onDismiss={ jest.fn() } /> );

		expect( screen.getByText(
			"Your selection has been updated. Private, password-protected, or non-indexed items can't be bulk edited and were excluded."
		) ).toBeInTheDocument();
	} );

	it( "calls onDismiss when the dismiss button is clicked", () => {
		const onDismiss = jest.fn();
		render( <OverviewExclusionNotice hasExclusions={ true } contentTypeLabel="Posts" onDismiss={ onDismiss } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Dismiss" } ) );

		expect( onDismiss ).toHaveBeenCalledTimes( 1 );
	} );

	it( "renders nothing while nothing was excluded", () => {
		const { container } = render( <OverviewExclusionNotice hasExclusions={ false } contentTypeLabel="Posts" onDismiss={ jest.fn() } /> );

		expect( container ).toBeEmptyDOMElement();
	} );
} );

describe( "BulkEditorContent with a truncated and pruned carried-over selection", () => {
	const dataProvider = new DataProvider( {
		contentTypes: [ { name: "post", label: "Posts", singularLabel: "Post" } ],
		endpoints: { posts: "https://example.com/wp-json/yoast/v1/bulk_editor/posts" },
		links: {},
	} );
	// The data layer is covered by use-posts.test.js; the request stays pending here.
	const remoteDataProvider = { fetchJson: jest.fn( () => new Promise( () => {} ) ) };

	// The store registers once for the whole file: the WP data registry is global, so a second register would
	// clash. Seeded as if 25 items were selected on the overview and pruning dropped some of the carried 20.
	beforeAll( () => {
		registerStore( {
			initialState: {
				activeContentType: "post",
				selection: {
					selectedIds: Array.from( { length: 18 }, ( _, index ) => index + 1 ),
					preselectedTotal: 25,
					hasExcludedPreselected: true,
				},
			},
		} );
	} );

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

	it( "shows the truncation and exclusion notices together, dismissible independently", () => {
		const { container } = renderContent();

		const truncation = screen.getByText( TRUNCATION_TEXT );
		const exclusion = screen.getByText( NOTICE_TEXT );
		expect( truncation ).toBeInTheDocument();
		expect( exclusion ).toBeInTheDocument();
		// Both render inside the expanded bulk-actions row, the truncation notice first.
		expect( exclusion.closest( "tr" ) ).toBe( truncation.closest( "tr" ) );
		expect( truncation.closest( "tr" ) ).toHaveAttribute( "aria-hidden", "false" );
		// eslint-disable-next-line no-bitwise -- compareDocumentPosition returns a bitmask.
		expect( truncation.compareDocumentPosition( exclusion ) & Node.DOCUMENT_POSITION_FOLLOWING ).toBeTruthy();

		fireEvent.click( within( exclusion.closest( "[role='status']" ) ).getByRole( "button", { name: "Dismiss" } ) );

		// The exclusion notice is gone; the truncation notice keeps the row expanded.
		expect( screen.queryByText( NOTICE_TEXT ) ).not.toBeInTheDocument();
		expect( screen.getByText( TRUNCATION_TEXT ) ).toBeInTheDocument();
		expect( screen.getByText( TRUNCATION_TEXT ).closest( "tr" ) ).toHaveAttribute( "aria-hidden", "false" );

		fireEvent.click( screen.getByRole( "button", { name: "Dismiss" } ) );

		// Nothing else occupies the band here (AI is disabled, no edits), so dismissing both collapses the row.
		expect( screen.queryByText( TRUNCATION_TEXT ) ).not.toBeInTheDocument();
		container.querySelectorAll( "tr[aria-hidden]" ).forEach( ( row ) => {
			expect( row ).toHaveAttribute( "aria-hidden", "true" );
		} );
	} );
} );
