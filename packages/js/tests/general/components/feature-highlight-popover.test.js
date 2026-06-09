import { render, screen, fireEvent, act } from "../../test-utils";
import { FeatureHighlightPopover } from "../../../src/general/components/feature-highlight-popover";

// jsdom does not implement scrollIntoView, which the dismiss button calls on mount.
beforeAll( () => {
	Element.prototype.scrollIntoView = jest.fn();
} );

const defaultProps = {
	id: "test-popover",
	title: "Highlight title",
	content: "Highlight content",
	isVisible: true,
	setIsVisible: jest.fn(),
};

describe( "FeatureHighlightPopover", () => {
	it( "renders the title and content in a dialog when visible", () => {
		render( <FeatureHighlightPopover { ...defaultProps } /> );

		expect( screen.getByRole( "dialog" ) ).toBeInTheDocument();
		expect( screen.getByText( "Highlight title" ) ).toBeInTheDocument();
		expect( screen.getByText( "Highlight content" ) ).toBeInTheDocument();
	} );

	it( "renders nothing when not visible", () => {
		render( <FeatureHighlightPopover { ...defaultProps } isVisible={ false } /> );

		expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
	} );

	it( "hides the popover when the dismiss button is clicked", () => {
		const setIsVisible = jest.fn();
		render( <FeatureHighlightPopover { ...defaultProps } setIsVisible={ setIsVisible } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Got it!" } ) );

		expect( setIsVisible ).toHaveBeenCalledWith( false );
	} );

	it( "focuses the dismiss button shortly after opening", () => {
		jest.useFakeTimers();
		try {
			render( <FeatureHighlightPopover { ...defaultProps } /> );
			const dismissButton = screen.getByRole( "button", { name: "Got it!" } );

			act( () => {
				jest.advanceTimersByTime( 300 );
			} );

			expect( dismissButton ).toHaveFocus();
			expect( Element.prototype.scrollIntoView ).toHaveBeenCalled();
		} finally {
			jest.useRealTimers();
		}
	} );

	it( "omits the backdrop by default", () => {
		const { container } = render( <FeatureHighlightPopover { ...defaultProps } /> );

		expect( container.querySelector( ".yst-popover__backdrop" ) ).toBeNull();
	} );

	it( "renders the backdrop when hasBackdrop is set", () => {
		const { container } = render( <FeatureHighlightPopover { ...defaultProps } hasBackdrop={ true } /> );

		expect( container.querySelector( ".yst-popover__backdrop" ) ).toBeInTheDocument();
	} );
} );
