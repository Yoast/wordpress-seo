import { fireEvent, render, screen } from "../test-utils";
import MetaboxCollapsible from "../../src/components/MetaboxCollapsible";

/**
 * A stand-in for a real help link.
 *
 * @returns {JSX.Element} The link.
 */
const HelpLink = () => <a href="https://example.com/help">Help</a>;

/**
 * Builds a fresh help link component, the way an inline component in JSX would.
 *
 * @param {string} label The link text.
 *
 * @returns {function(): JSX.Element} A new component on every call.
 */
const buildHelpLink = ( label ) => function InlineHelpLink() {
	return <a href="https://example.com/help">{ label }</a>;
};

describe( "MetaboxCollapsible", () => {
	it( "renders no help link by default", () => {
		render( <MetaboxCollapsible title="Section" initialIsOpen={ true }>Content</MetaboxCollapsible> );

		expect( screen.queryByRole( "link" ) ).not.toBeInTheDocument();
	} );

	it( "renders the help link outside the toggle button", () => {
		render(
			<MetaboxCollapsible title="Section" initialIsOpen={ true } HeaderHelpLink={ HelpLink }>
				Content
			</MetaboxCollapsible>
		);

		const link = screen.getByRole( "link", { name: "Help" } );

		// A link in a button is invalid HTML, and one click would open the link and toggle the panel.
		expect( link.closest( "button" ) ).toBeNull();
		expect( screen.getByRole( "button", { name: "Section" } ) ).toBeInTheDocument();
	} );

	it( "keeps the suffix icon inside the toggle button", () => {
		const { container } = render(
			<MetaboxCollapsible title="Section" initialIsOpen={ true } HeaderHelpLink={ HelpLink }>
				Content
			</MetaboxCollapsible>
		);

		/*
		 * The icon is only moved with CSS: it has to stay in the button to keep toggling, and because
		 * integrations look it up and click its parent element.
		 */
		const chevron = container.querySelector( "[class*=chevron]" );
		expect( chevron ).not.toBeNull();
		expect( chevron.closest( "button" ) ).toBe( screen.getByRole( "button", { name: "Section" } ) );
	} );

	it( "still toggles when a help link is rendered", () => {
		render(
			<MetaboxCollapsible title="Section" initialIsOpen={ false } HeaderHelpLink={ HelpLink }>
				<span>Inner content</span>
			</MetaboxCollapsible>
		);

		expect( screen.queryByText( "Inner content" ) ).not.toBeInTheDocument();

		fireEvent.click( screen.getByRole( "button", { name: "Section" } ) );

		expect( screen.getByText( "Inner content" ) ).toBeInTheDocument();
	} );

	it( "keeps the toggle button mounted across re-renders", () => {
		const { rerender } = render(
			<MetaboxCollapsible title="Section" initialIsOpen={ true } HeaderHelpLink={ HelpLink }>
				Content
			</MetaboxCollapsible>
		);

		const button = screen.getByRole( "button", { name: "Section" } );
		button.focus();

		rerender(
			<MetaboxCollapsible title="Section" initialIsOpen={ true } HeaderHelpLink={ HelpLink }>
				Content
			</MetaboxCollapsible>
		);

		// A heading whose identity changed every render would remount the button and drop focus.
		expect( screen.getByRole( "button", { name: "Section" } ) ).toBe( button );
		expect( document.activeElement ).toBe( button );
	} );

	it( "keeps the toggle button mounted when the help link is an inline component", () => {
		const { rerender } = render(
			<MetaboxCollapsible title="Section" initialIsOpen={ true } HeaderHelpLink={ buildHelpLink( "Help" ) }>
				Content
			</MetaboxCollapsible>
		);

		const button = screen.getByRole( "button", { name: "Section" } );
		button.focus();

		rerender(
			<MetaboxCollapsible title="Section" initialIsOpen={ true } HeaderHelpLink={ buildHelpLink( "More help" ) }>
				Content
			</MetaboxCollapsible>
		);

		// The heading may not depend on the reference, but still has to render the current link.
		expect( screen.getByRole( "button", { name: "Section" } ) ).toBe( button );
		expect( document.activeElement ).toBe( button );
		expect( screen.getByRole( "link", { name: "More help" } ) ).toBeInTheDocument();
	} );
} );
