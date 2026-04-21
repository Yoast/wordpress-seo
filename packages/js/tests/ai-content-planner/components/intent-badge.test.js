import { render, screen, fireEvent } from "@testing-library/react";
import { IntentBadge } from "../../../src/ai-content-planner/components/intent-badge";

/**
 * Finds a known-intent IntentBadge root element (the Badge span that contains the label text).
 *
 * @param {string} label The visible label text (e.g. "Informational").
 * @returns {HTMLElement} The badge element (span.yst-badge).
 */
const getBadge = ( label ) => screen.getByText( label ).closest( ".yst-badge" );

describe( "IntentBadge", () => {
	describe( "label rendering", () => {
		it.each( [
			[ "informational", "Informational" ],
			[ "navigational", "Navigational" ],
			[ "commercial", "Commercial" ],
			[ "transactional", "Transactional" ],
		] )( "renders the %s intent label", ( intent, expectedLabel ) => {
			render( <IntentBadge intent={ intent } /> );
			expect( screen.getByText( expectedLabel ) ).toBeInTheDocument();
		} );

		it( "falls back to the raw intent value for unknown intents", () => {
			render( <IntentBadge intent="unknown-intent" /> );
			expect( screen.getByText( "unknown-intent" ) ).toBeInTheDocument();
		} );
	} );

	describe( "tooltip behavior", () => {
		it.each( [
			[ "informational", "Informational", "The user wants to find an answer to a specific question." ],
			[ "navigational", "Navigational", "The user wants to find a specific page or site." ],
			[ "commercial", "Commercial", "The user wants to investigate brands or services." ],
			[ "transactional", "Transactional", "The user wants to complete an action (conversion)." ],
		] )( "shows the %s tooltip text on mouse enter", ( intent, label, expectedTooltip ) => {
			render( <IntentBadge intent={ intent } /> );
			fireEvent.mouseEnter( getBadge( label ) );
			expect( screen.getByRole( "tooltip" ) ).toHaveTextContent( expectedTooltip );
		} );

		it( "hides the tooltip on mouse leave", () => {
			render( <IntentBadge intent="informational" /> );
			const badge = getBadge( "Informational" );
			fireEvent.mouseEnter( badge );
			expect( screen.getByRole( "tooltip" ) ).toBeInTheDocument();
			fireEvent.mouseLeave( badge );
			expect( screen.queryByRole( "tooltip" ) ).not.toBeInTheDocument();
		} );

		it( "does not render a tooltip initially", () => {
			render( <IntentBadge intent="informational" /> );
			expect( screen.queryByRole( "tooltip" ) ).not.toBeInTheDocument();
		} );

		it( "does not set aria-describedby when the tooltip is hidden", () => {
			render( <IntentBadge intent="informational" /> );
			expect( getBadge( "Informational" ) ).not.toHaveAttribute( "aria-describedby" );
		} );

		it( "sets aria-describedby pointing to the tooltip id when the tooltip is visible", () => {
			render( <IntentBadge intent="informational" /> );
			const badge = getBadge( "Informational" );
			fireEvent.mouseEnter( badge );
			const describedBy = badge.getAttribute( "aria-describedby" );
			expect( describedBy ).toMatch( /^intent-tooltip-informational-/ );
			expect( screen.getByRole( "tooltip" ) ).toHaveAttribute( "id", describedBy );
		} );

		it( "generates unique tooltip ids for multiple instances of the same intent", () => {
			render( <>
				<IntentBadge intent="informational" />
				<IntentBadge intent="informational" />
			</> );
			const badges = screen.getAllByText( "Informational" ).map( ( el ) => el.closest( ".yst-badge" ) );
			fireEvent.mouseEnter( badges[ 0 ] );
			const firstId = badges[ 0 ].getAttribute( "aria-describedby" );
			fireEvent.mouseLeave( badges[ 0 ] );
			fireEvent.mouseEnter( badges[ 1 ] );
			const secondId = badges[ 1 ].getAttribute( "aria-describedby" );
			expect( firstId ).not.toEqual( secondId );
		} );
	} );

	describe( "cursor", () => {
		it( "applies the default cursor class when no cursor prop is provided", () => {
			render( <IntentBadge intent="informational" /> );
			const badge = getBadge( "Informational" );
			expect( badge ).toHaveClass( "yst-cursor-default" );
			expect( badge ).not.toHaveClass( "yst-cursor-pointer" );
		} );

		it( "applies the pointer cursor class when cursor=\"pointer\" is provided", () => {
			render( <IntentBadge intent="informational" cursor="pointer" /> );
			const badge = getBadge( "Informational" );
			expect( badge ).toHaveClass( "yst-cursor-pointer" );
			expect( badge ).not.toHaveClass( "yst-cursor-default" );
		} );
	} );
} );
