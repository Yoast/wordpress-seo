import { render, screen } from "../test-utils";
import { RelatedKeyphraseButton } from "../../src/components/RelatedKeyphraseButton";

// Mock Heroicons
jest.mock( "@heroicons/react/outline", () => ( {
	SearchIcon: ( { className } ) => <svg className={ className } data-testid="search-icon" />,
} ) );

describe( "RelatedKeyphraseButton", () => {
	const defaultProps = {
		location: "metabox",
		onModalOpen: jest.fn(),
		onLinkClick: jest.fn(),
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( "when logged in", () => {
		it( "renders a button that triggers onModalOpen on click", () => {
			render( <RelatedKeyphraseButton { ...defaultProps } isLoggedIn={ true } /> );

			const button = screen.getByRole( "button", { name: /Discover related keyphrases/i } );
			expect( button ).toBeInTheDocument();
			expect( button ).toHaveAttribute( "id", "yoast-get-related-keyphrases-metabox" );

			button.click();
			expect( defaultProps.onModalOpen ).toHaveBeenCalledTimes( 1 );
		} );

		it( "does not render a link element", () => {
			render( <RelatedKeyphraseButton { ...defaultProps } isLoggedIn={ true } /> );

			expect( screen.queryByRole( "link" ) ).not.toBeInTheDocument();
		} );

		it( "does not render screen-reader text about opening a new tab", () => {
			render( <RelatedKeyphraseButton { ...defaultProps } isLoggedIn={ true } /> );

			expect( screen.queryByText( "(Opens in a new browser tab)" ) ).not.toBeInTheDocument();
		} );
	} );

	describe( "when not logged in", () => {
		it( "renders a link to the Semrush OAuth page", () => {
			render( <RelatedKeyphraseButton { ...defaultProps } isLoggedIn={ false } /> );

			const link = screen.getByRole( "link", { name: /Discover related keyphrases/i } );
			expect( link ).toBeInTheDocument();
			expect( link ).toHaveAttribute( "href", expect.stringContaining( "oauth.semrush.com" ) );
		} );

		it( "calls onLinkClick when clicked", () => {
			render( <RelatedKeyphraseButton { ...defaultProps } isLoggedIn={ false } /> );

			const link = screen.getByRole( "link", { name: /Discover related keyphrases/i } );
			link.click();
			expect( defaultProps.onLinkClick ).toHaveBeenCalledTimes( 1 );
		} );

		it( "renders screen-reader text about opening a new tab", () => {
			render( <RelatedKeyphraseButton { ...defaultProps } isLoggedIn={ false } /> );

			expect( screen.getByText( "(Opens in a new browser tab)" ) ).toBeInTheDocument();
		} );
	} );

	describe( "defaults", () => {
		it( "defaults isLoggedIn to false and renders as a link", () => {
			render( <RelatedKeyphraseButton { ...defaultProps } /> );

			expect( screen.getByRole( "link", { name: /Discover related keyphrases/i } ) ).toBeInTheDocument();
		} );
	} );

	describe( "location prop", () => {
		it( "uses the location prop in the element id", () => {
			render( <RelatedKeyphraseButton { ...defaultProps } location="sidebar" isLoggedIn={ true } /> );

			expect( screen.getByRole( "button" ) ).toHaveAttribute( "id", "yoast-get-related-keyphrases-sidebar" );
		} );
	} );

	it( "renders the SearchIcon", () => {
		render( <RelatedKeyphraseButton { ...defaultProps } /> );

		expect( screen.getByTestId( "search-icon" ) ).toBeInTheDocument();
	} );

	it( "wraps content in a div with the yoast class", () => {
		const { container } = render( <RelatedKeyphraseButton { ...defaultProps } /> );

		expect( container.firstChild ).toHaveClass( "yoast" );
	} );
} );





