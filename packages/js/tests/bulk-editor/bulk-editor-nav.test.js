import { fireEvent, render, screen } from "../test-utils";
import { noop } from "lodash";
import { BulkEditorNav } from "../../src/bulk-editor/components/bulk-editor-nav";

const contentTypes = [
	{ id: "page", label: "Pages" },
	{ id: "post", label: "Posts" },
	{ id: "product", label: "Products" },
	{ id: "podcast", label: "Podcasts" },
	{ id: "video", label: "Videos" },
	{ id: "book", label: "Books" },
	{ id: "movie", label: "Movies" },
	{ id: "recipe", label: "Recipes" },
];

const defaultProps = {
	contentTypes,
	activeContentType: "page",
	onChange: noop,
	backToToolsUrl: "https://example.test/wp-admin/admin.php?page=wpseo_tools",
	logoHref: "https://example.test/wp-admin/admin.php?page=wpseo_dashboard",
};

describe( "BulkEditorNav", () => {
	it( "renders a labeled navigation landmark", () => {
		render( <BulkEditorNav { ...defaultProps } /> );

		expect( screen.getByRole( "navigation", { name: "Bulk editor menu" } ) ).toBeInTheDocument();
	} );

	it( "renders the Back to Tools link", () => {
		render( <BulkEditorNav { ...defaultProps } /> );

		const link = screen.getByRole( "link", { name: "Back to Tools" } );
		expect( link ).toHaveAttribute( "href", defaultProps.backToToolsUrl );
	} );

	it( "renders the Yoast SEO logo linking to the dashboard", () => {
		render( <BulkEditorNav { ...defaultProps } /> );

		expect( screen.getByRole( "link", { name: "Yoast SEO" } ) ).toHaveAttribute( "href", defaultProps.logoHref );
	} );

	it( "labels the logo Yoast SEO Premium when Premium is active", () => {
		render( <BulkEditorNav { ...defaultProps } isPremium={ true } /> );

		expect( screen.getByRole( "link", { name: "Yoast SEO Premium" } ) ).toBeInTheDocument();
	} );

	it( "marks the active content type with aria-current", () => {
		render( <BulkEditorNav { ...defaultProps } /> );

		expect( screen.getByRole( "button", { name: "Pages" } ) ).toHaveAttribute( "aria-current", "page" );
		expect( screen.getByRole( "button", { name: "Posts" } ) ).not.toHaveAttribute( "aria-current" );
	} );

	it( "calls onChange with the content type id when an item is selected", () => {
		const onChange = jest.fn();
		render( <BulkEditorNav { ...defaultProps } onChange={ onChange } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Posts" } ) );
		expect( onChange ).toHaveBeenCalledWith( "post" );
	} );

	it( "collapses content types beyond the limit behind a Show more toggle", () => {
		render( <BulkEditorNav { ...defaultProps } /> );

		const toggle = screen.getByRole( "button", { name: "Show 3 more" } );
		expect( toggle ).toHaveAttribute( "aria-expanded", "false" );
		expect( toggle ).toHaveAttribute( "aria-controls", "bulk-editor-nav-more" );

		fireEvent.click( toggle );
		expect( screen.getByRole( "button", { name: "Show less" } ) ).toHaveAttribute( "aria-expanded", "true" );
	} );

	it( "renders no toggle when everything fits within the limit", () => {
		render( <BulkEditorNav { ...defaultProps } contentTypes={ contentTypes.slice( 0, 4 ) } /> );

		expect( screen.queryByRole( "button", { name: /Show \d+ more/ } ) ).not.toBeInTheDocument();
	} );
} );
