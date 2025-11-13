import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CallToActionButton } from "../../../src/components/task-list/call-to-action-button";

describe( "CallToActionButton", () => {
	const onClickMock = jest.fn();
	it( "renders with the correct label", () => {
		render( <CallToActionButton label="Do it" type="create" onClick={ onClickMock } /> );
		expect( screen.getByRole( "button", { name: /do it/i } ) ).toBeInTheDocument();
	} );

	it( "calls onClick when clicked (create/delete/default types)", () => {
		const handleClick = jest.fn();
		render( <CallToActionButton label="Create" type="create" onClick={ handleClick } /> );
		fireEvent.click( screen.getByRole( "button", { name: /create/i } ) );
		expect( handleClick ).toHaveBeenCalledTimes( 1 );
	} );

	it( "renders as a link when type is 'link'", () => {
		render( <CallToActionButton label="Go" type="link" href="https://example.com" /> );
		const link = screen.getByRole( "link", { name: /go/i } );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "https://example.com" );
	} );

	it( "is disabled when disabled prop is true", () => {
		render( <CallToActionButton label="Disabled" type="create" onClick={ onClickMock } disabled={ true } /> );
		expect( screen.getByRole( "button", { name: /disabled/i } ) ).toBeDisabled();
	} );

	it.each( [
		[ "create", { label: "Create", type: "create", onClick: onClickMock } ],
		[ "delete", { label: "Delete", type: "delete", onClick: onClickMock } ],
		[ "link", { label: "Go", type: "link", href: "https://example.com" } ],
		[ "default", { label: "Default", onClick: onClickMock } ],
	] )( "matches snapshot for type '%s'", ( type, props ) => {
		const { container } = render( <CallToActionButton { ...props } /> );
		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
