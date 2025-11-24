import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CallToActionButton } from "../../src/task-list/components/call-to-action-button";

describe( "CallToActionButton", () => {
	const onClickMock = jest.fn();
	it( "renders with the correct label", () => {
		render( <CallToActionButton label="Do it" type="create" onClick={ onClickMock } /> );
		expect( screen.getByRole( "button", { name: /do it/i } ) ).toBeInTheDocument();
	} );

	it( "calls onClick when clicked (delete/default types)", () => {
		const handleClick = jest.fn();
		render( <CallToActionButton label="Delete" type="delete" onClick={ handleClick } /> );
		fireEvent.click( screen.getByRole( "button", { name: /delete/i } ) );
		expect( handleClick ).toHaveBeenCalledTimes( 1 );
	} );

	it( "renders as a link when type is 'link'", () => {
		render( <CallToActionButton label="Go" type="link" href="https://example.com" /> );
		const link = screen.getByRole( "link", { name: /go/i } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "https://example.com" );
	} );

	it( "renders as a link when type is 'add'", () => {
		render( <CallToActionButton label="Add" type="add" href="https://example.com" /> );
		const link = screen.getByRole( "link", { name: /add/i } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "https://example.com" );
	} );

	it( "is disabled when disabled prop is true", () => {
		render( <CallToActionButton label="Disabled" type="add" onClick={ onClickMock } disabled={ true } /> );
		expect( screen.getByRole( "button", { name: /disabled/i } ) ).toBeDisabled();
	} );

	it.each( [
		[ "add", { label: "Create", type: "add", href: "https://example.com" } ],
		[ "delete", { label: "Delete", type: "delete", onClick: onClickMock } ],
		[ "link", { label: "Go", type: "link", href: "https://example.com" } ],
		[ "default", { label: "Default", onClick: onClickMock } ],
	] )( "matches snapshot for type '%s'", ( type, props ) => {
		const { container } = render( <CallToActionButton { ...props } /> );
		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
