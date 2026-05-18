import { render, screen } from "@testing-library/react";
import { IntentBadge } from "../../../src/ai-content-planner/components/intent-badge";

/**
 * Finds a known-intent IntentBadge root element (the Badge span that contains the label text).
 *
 * @param {string} label The visible label text (e.g. "Informational").
 * @returns {HTMLElement} The badge element (span.yst-badge).
 */
const getBadge = ( label ) => screen.getByText( label ).closest( ".yst-badge" );

/**
 * Finds the tooltip trigger element wrapping the given IntentBadge.
 *
 * @param {string} label The visible label text (e.g. "Informational").
 * @returns {HTMLElement} The trigger element (span.yst-tooltip-trigger).
 */
const getTrigger = ( label ) => screen.getByText( label ).closest( ".yst-tooltip-trigger" );

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

	describe( "tooltip content and wiring", () => {
		it.each( [
			[ "informational", "Informational", "The user wants to find an answer to a specific question." ],
			[ "navigational", "Navigational", "The user wants to find a specific page or site." ],
			[ "commercial", "Commercial", "The user wants to investigate brands or services." ],
			[ "transactional", "Transactional", "The user wants to complete an action (conversion)." ],
		] )( "renders the %s tooltip text", ( intent, label, expectedTooltip ) => {
			render( <IntentBadge intent={ intent } /> );
			expect( screen.getByRole( "tooltip", { hidden: true } ) ).toHaveTextContent( expectedTooltip );
		} );

		it( "wires aria-describedby on the trigger to the tooltip id", () => {
			render( <IntentBadge intent="informational" /> );
			const describedBy = getTrigger( "Informational" ).getAttribute( "aria-describedby" );
			expect( describedBy ).toMatch( /^intent-tooltip-informational-/ );
			expect( screen.getByRole( "tooltip", { hidden: true } ) ).toHaveAttribute( "id", describedBy );
		} );

		it( "generates unique tooltip ids for multiple instances of the same intent", () => {
			render( <>
				<IntentBadge intent="informational" />
				<IntentBadge intent="informational" />
			</> );
			const triggers = screen.getAllByText( "Informational" ).map( ( el ) => el.closest( ".yst-tooltip-trigger" ) );
			expect( triggers[ 0 ].getAttribute( "aria-describedby" ) ).not.toEqual( triggers[ 1 ].getAttribute( "aria-describedby" ) );
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
