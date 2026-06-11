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
} );
