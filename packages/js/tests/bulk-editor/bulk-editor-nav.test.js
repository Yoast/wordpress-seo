import { SidebarNavigation } from "@yoast/ui-library";
import { noop } from "lodash";
import { fireEvent, render, screen } from "../test-utils";
import { BulkEditorNavMenu } from "../../src/bulk-editor/components/bulk-editor-nav";

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
	onChange: noop,
	backToToolsUrl: "https://example.test/wp-admin/admin.php?page=wpseo_tools",
	logoHref: "https://example.test/wp-admin/admin.php?page=wpseo_dashboard",
};

/**
 * Renders the menu inside the SidebarNavigation context, mirroring the page shell.
 *
 * @param {Object} [props]      Extra props for the menu.
 * @param {string} [activePath] The active content type id.
 *
 * @returns {void}
 */
const renderNav = ( props = {}, activePath = "page" ) => render(
	<SidebarNavigation activePath={ activePath }>
		<SidebarNavigation.Sidebar aria-label="Bulk editor menu">
			<BulkEditorNavMenu { ...defaultProps } { ...props } />
		</SidebarNavigation.Sidebar>
	</SidebarNavigation>
);

describe( "BulkEditorNavMenu", () => {
	it( "renders a labeled navigation landmark", () => {
		renderNav();

		expect( screen.getByRole( "navigation", { name: "Bulk editor menu" } ) ).toBeInTheDocument();
	} );

	it( "renders the Back to Tools link", () => {
		renderNav();

		const link = screen.getByRole( "link", { name: "Back to Tools" } );
		expect( link ).toHaveAttribute( "href", defaultProps.backToToolsUrl );
	} );

	it( "renders the Yoast SEO logo linking to the dashboard", () => {
		renderNav();

		expect( screen.getByRole( "link", { name: "Yoast SEO" } ) ).toHaveAttribute( "href", defaultProps.logoHref );
	} );

	it( "labels the logo Yoast SEO Premium when Premium is active", () => {
		renderNav( { isPremium: true } );

		expect( screen.getByRole( "link", { name: "Yoast SEO Premium" } ) ).toBeInTheDocument();
	} );

	it( "marks the active content type with aria-current", () => {
		renderNav();

		expect( screen.getByRole( "button", { name: "Pages" } ) ).toHaveAttribute( "aria-current", "page" );
		expect( screen.getByRole( "button", { name: "Posts" } ) ).not.toHaveAttribute( "aria-current" );
	} );

	it( "calls onChange with the content type id when an item is selected", () => {
		const onChange = jest.fn();
		renderNav( { onChange } );

		fireEvent.click( screen.getByRole( "button", { name: "Posts" } ) );
		expect( onChange ).toHaveBeenCalledWith( "post" );
	} );

	it( "routes the Back to Tools click through onNavigate with the target URL", () => {
		const onNavigate = jest.fn( ( event ) => event.preventDefault() );
		renderNav( { onNavigate } );

		fireEvent.click( screen.getByRole( "link", { name: "Back to Tools" } ) );
		expect( onNavigate ).toHaveBeenCalledWith( expect.objectContaining( { type: "click" } ), defaultProps.backToToolsUrl );
	} );

	it( "routes the logo click through onNavigate with the target URL", () => {
		const onNavigate = jest.fn( ( event ) => event.preventDefault() );
		renderNav( { onNavigate } );

		fireEvent.click( screen.getByRole( "link", { name: "Yoast SEO" } ) );
		expect( onNavigate ).toHaveBeenCalledWith( expect.objectContaining( { type: "click" } ), defaultProps.logoHref );
	} );

	it( "collapses content types beyond the limit behind a Show more toggle", () => {
		renderNav();

		const toggle = screen.getByRole( "button", { name: "Show 3 more" } );
		expect( toggle ).toHaveAttribute( "aria-expanded", "false" );
		expect( toggle ).toHaveAttribute( "aria-controls", "bulk-editor-nav-more" );

		fireEvent.click( toggle );
		expect( screen.getByRole( "button", { name: "Show less" } ) ).toHaveAttribute( "aria-expanded", "true" );
	} );

	it( "renders no toggle when everything fits within the limit", () => {
		renderNav( { contentTypes: contentTypes.slice( 0, 4 ) } );

		expect( screen.queryByRole( "button", { name: /Show \d+ more/ } ) ).not.toBeInTheDocument();
	} );

	it( "does not call onChange when disabled and a content type is clicked", () => {
		const onChange = jest.fn();
		renderNav( { onChange, disabled: true } );

		fireEvent.click( screen.getByRole( "button", { name: "Posts" } ) );

		expect( onChange ).not.toHaveBeenCalled();
	} );

	it( "does not call onNavigate when disabled and the Back to Tools link is clicked", () => {
		const onNavigate = jest.fn();
		renderNav( { onNavigate, disabled: true } );

		fireEvent.click( screen.getByRole( "link", { name: "Back to Tools" } ) );

		expect( onNavigate ).not.toHaveBeenCalled();
	} );

	it( "does not call onNavigate when disabled and the logo is clicked", () => {
		const onNavigate = jest.fn();
		renderNav( { onNavigate, disabled: true } );

		fireEvent.click( screen.getByRole( "link", { name: "Yoast SEO" } ) );

		expect( onNavigate ).not.toHaveBeenCalled();
	} );

	it( "marks the Back to Tools link as aria-disabled when disabled", () => {
		renderNav( { disabled: true } );

		expect( screen.getByRole( "link", { name: "Back to Tools" } ) ).toHaveAttribute( "aria-disabled", "true" );
	} );

	it( "marks the logo as aria-disabled when disabled", () => {
		renderNav( { disabled: true } );

		expect( screen.getByRole( "link", { name: "Yoast SEO" } ) ).toHaveAttribute( "aria-disabled", "true" );
	} );
} );
