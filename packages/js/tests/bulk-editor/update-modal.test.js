import { render, screen, fireEvent } from "../test-utils";
import { useSelect } from "@wordpress/data";
import { UpdateModal } from "../../src/bulk-editor/components/update-modal";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
} ) );

/**
 * Configures the useSelect mock to return the given premiumUpdateUrl from the store.
 *
 * @param {string} url The URL to return for the premiumUpdateUrl preference.
 */
const mockPremiumUpdateUrl = ( url = "" ) => {
	useSelect.mockImplementation( ( selector ) =>
		selector( () => ( {
			selectPreference: ( key, defaultVal ) => key === "premiumUpdateUrl" ? url : defaultVal,
		} ) )
	);
};

const baseProps = {
	isOpen: true,
	onClose: jest.fn(),
};

describe( "UpdateModal", () => {
	beforeEach( () => {
		jest.clearAllMocks();
		mockPremiumUpdateUrl();
	} );

	it( "renders the heading and body text", () => {
		render( <UpdateModal { ...baseProps } /> );

		expect( screen.getByRole( "heading", { name: "Your plugin needs an update" } ) ).toBeInTheDocument();
		expect( screen.getByText( /please update Yoast SEO Premium/ ) ).toBeInTheDocument();
	} );

	it( "renders the 'Update now' link with the correct href and attributes when premiumUpdateUrl is set", () => {
		mockPremiumUpdateUrl( "https://example.com/update.php?_wpnonce=abc" );
		render( <UpdateModal { ...baseProps } /> );

		const link = screen.getByRole( "link", { name: /Update now/ } );
		expect( link ).toHaveAttribute( "href", "https://example.com/update.php?_wpnonce=abc" );
		expect( link ).toHaveAttribute( "target", "_blank" );
		expect( link ).toHaveAttribute( "rel", "noopener noreferrer" );
	} );

	it( "hides the 'Update now' button when premiumUpdateUrl is empty (SEO Manager case)", () => {
		// The server withholds the URL for users who lack update_plugins, so the button must not render.
		render( <UpdateModal { ...baseProps } /> );

		expect( screen.queryByRole( "link", { name: /Update now/ } ) ).not.toBeInTheDocument();
	} );

	it( "still renders the Close button when premiumUpdateUrl is empty", () => {
		render( <UpdateModal { ...baseProps } /> );

		expect( screen.getByRole( "button", { name: "Close" } ) ).toBeInTheDocument();
	} );

	it( "calls onClose when the Close button is clicked", () => {
		const onClose = jest.fn();
		render( <UpdateModal { ...baseProps } onClose={ onClose } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Close" } ) );

		expect( onClose ).toHaveBeenCalledTimes( 1 );
	} );

	it( "renders nothing when closed", () => {
		render( <UpdateModal { ...baseProps } isOpen={ false } /> );

		expect( screen.queryByRole( "heading", { name: "Your plugin needs an update" } ) ).not.toBeInTheDocument();
	} );
} );
