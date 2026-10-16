import React, { useCallback, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ContentTabs } from "../src";

/**
 * A ResizeObserver stand-in whose observed width the tests set.
 */
class ResizeObserverMock {
	static instances = [];

	/**
	 * @param {Function} callback Called with the resize entries.
	 */
	constructor( callback ) {
		this.callback = callback;
		ResizeObserverMock.instances.push( this );
	}

	/**
	 * Starts observing.
	 *
	 * @returns {void}
	 */
	observe() {}

	/**
	 * Stops observing.
	 *
	 * @returns {void}
	 */
	disconnect() {}
}

/**
 * Reports a new width to every observer, like a resize.
 *
 * @param {number} width The width.
 *
 * @returns {void}
 */
const resizeTo = ( width ) => act( () => {
	ResizeObserverMock.instances.forEach( ( observer ) => observer.callback( [ { contentRect: { width } } ] ) );
} );

/**
 * A panel with local state, to tell a remount from a hidden panel.
 *
 * @param {Object} props The props.
 * @param {string} props.label The label.
 *
 * @returns {JSX.Element} The counter.
 */
const Counter = ( { label } ) => {
	const [ count, setCount ] = useState( 0 );
	const increment = useCallback( () => setCount( ( current ) => current + 1 ), [] );
	return <button type="button" onClick={ increment }>{ `${ label } ${ count }` }</button>;
};

/**
 * Renders two tabs.
 *
 * @param {Object} props The ContentTabs props.
 *
 * @returns {Object} The render result.
 */
const renderTabs = ( props = {} ) => render(
	<ContentTabs defaultActiveTab="one" { ...props }>
		<ContentTabs.TabList>
			<ContentTabs.TabButton id="one">One</ContentTabs.TabButton>
			<ContentTabs.TabButton id="two">Two</ContentTabs.TabButton>
		</ContentTabs.TabList>
		<ContentTabs.Content>
			<ContentTabs.Panel tabId="one"><Counter label="Panel one" /></ContentTabs.Panel>
			<ContentTabs.Panel tabId="two"><Counter label="Panel two" /></ContentTabs.Panel>
		</ContentTabs.Content>
	</ContentTabs>,
);

const getTabButton = ( name ) => screen.getByRole( "button", { name } );

const isAccordion = ( container ) => container.firstChild.classList.contains( "yst-content-tabs--accordion" );

const isHidden = ( element ) => Boolean( element.closest( "[hidden]" ) );

describe( "ContentTabs accordion", () => {
	let originalResizeObserver;

	beforeEach( () => {
		originalResizeObserver = window.ResizeObserver;
		window.ResizeObserver = ResizeObserverMock;
		ResizeObserverMock.instances = [];
		window.requestAnimationFrame = ( callback ) => callback();
	} );

	afterEach( () => {
		window.ResizeObserver = originalResizeObserver;
	} );

	it( "renders side by side without an accordionBreakpoint", () => {
		const { container } = renderTabs();
		resizeTo( 300 );

		expect( isAccordion( container ) ).toBe( false );
		expect( getTabButton( "One" ).hasAttribute( "aria-expanded" ) ).toBe( false );
		expect( container.querySelector( ".yst-content-tabs__content" ).contains( screen.getByText( "Panel one 0" ) ) ).toBe( true );
	} );

	it( "renders side by side when wider than the breakpoint", () => {
		const { container } = renderTabs( { accordionBreakpoint: 640 } );
		resizeTo( 800 );

		expect( isAccordion( container ) ).toBe( false );
		expect( getTabButton( "One" ).hasAttribute( "aria-expanded" ) ).toBe( false );
	} );

	it( "opens the active panel below its tab button when narrower than the breakpoint", () => {
		const { container } = renderTabs( { accordionBreakpoint: 640 } );
		resizeTo( 400 );

		expect( isAccordion( container ) ).toBe( true );
		const one = getTabButton( "One" );
		expect( one.getAttribute( "aria-expanded" ) ).toBe( "true" );
		expect( one.getAttribute( "aria-controls" ) ).toBe( "one-accordion-panel" );
		expect( getTabButton( "Two" ).getAttribute( "aria-expanded" ) ).toBe( "false" );
		expect( getTabButton( "Two" ).hasAttribute( "aria-controls" ) ).toBe( false );
		expect( one.closest( "li" ).contains( screen.getByText( "Panel one 0" ) ) ).toBe( true );
	} );

	it( "collapses the open tab when it is activated again, without changing the active tab", () => {
		const onTabChange = jest.fn();
		renderTabs( { accordionBreakpoint: 640, activeTab: "one", onTabChange } );
		resizeTo( 400 );

		fireEvent.click( getTabButton( "One" ) );

		expect( onTabChange ).not.toHaveBeenCalled();
		expect( getTabButton( "One" ).getAttribute( "aria-expanded" ) ).toBe( "false" );
		expect( screen.queryByText( "Panel one 0" ) ).toBeNull();
	} );

	it( "opens another tab when it is activated", () => {
		renderTabs( { accordionBreakpoint: 640 } );
		resizeTo( 400 );

		fireEvent.click( getTabButton( "Two" ) );

		expect( getTabButton( "One" ).getAttribute( "aria-expanded" ) ).toBe( "false" );
		expect( getTabButton( "Two" ).getAttribute( "aria-expanded" ) ).toBe( "true" );
		expect( getTabButton( "Two" ).closest( "li" ).contains( screen.getByText( "Panel two 0" ) ) ).toBe( true );
	} );

	it( "opens a collapsed tab again when it is activated", () => {
		renderTabs( { accordionBreakpoint: 640 } );
		resizeTo( 400 );

		fireEvent.click( getTabButton( "One" ) );
		fireEvent.click( getTabButton( "One" ) );

		expect( getTabButton( "One" ).getAttribute( "aria-expanded" ) ).toBe( "true" );
		expect( isHidden( screen.getByText( "Panel one 0" ) ) ).toBe( false );
	} );

	it( "unmounts a collapsed panel, so its state resets", () => {
		renderTabs( { accordionBreakpoint: 640 } );
		resizeTo( 400 );
		fireEvent.click( screen.getByText( "Panel one 0" ) );

		fireEvent.click( getTabButton( "One" ) );
		fireEvent.click( getTabButton( "One" ) );

		expect( screen.queryByText( "Panel one 0" ) ).not.toBeNull();
	} );

	it( "only hides a collapsed panel with keepMounted, so its state survives", () => {
		renderTabs( { accordionBreakpoint: 640, keepMounted: true } );
		resizeTo( 400 );
		fireEvent.click( screen.getByText( "Panel one 0" ) );

		fireEvent.click( getTabButton( "One" ) );
		expect( isHidden( screen.getByText( "Panel one 1" ) ) ).toBe( true );

		fireEvent.click( getTabButton( "One" ) );
		expect( isHidden( screen.getByText( "Panel one 1" ) ) ).toBe( false );
	} );

	it( "opens the active tab when the accordion takes over", () => {
		renderTabs( { accordionBreakpoint: 640 } );
		resizeTo( 400 );
		fireEvent.click( getTabButton( "One" ) );

		resizeTo( 800 );
		resizeTo( 400 );

		expect( getTabButton( "One" ).getAttribute( "aria-expanded" ) ).toBe( "true" );
	} );

	it( "keeps the layout when the element measures 0 wide, like when it is hidden", () => {
		const { container } = renderTabs( { accordionBreakpoint: 640 } );
		resizeTo( 800 );

		resizeTo( 0 );

		expect( isAccordion( container ) ).toBe( false );
	} );
} );
