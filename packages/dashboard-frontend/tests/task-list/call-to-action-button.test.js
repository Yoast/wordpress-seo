import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CallToActionButton } from "../../src/task-list/components/call-to-action-button";

describe( "CallToActionButton", () => {
	const onClickMock = jest.fn();
	it( "renders with the correct label", () => {
		render( <CallToActionButton label="Do it" type="create" onClick={ onClickMock } /> );
		expect( screen.getByRole( "button", { name: /do it/i } ) ).toBeInTheDocument();
	} );

	it( "calls onClick when clicked (add/delete/default types)", () => {
		const handleClick = jest.fn();
		render( <CallToActionButton label="Create" type="add" onClick={ handleClick } /> );
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
		render( <CallToActionButton label="Disabled" type="add" onClick={ onClickMock } disabled={ true } /> );
		expect( screen.getByRole( "button", { name: /disabled/i } ) ).toBeDisabled();
	} );

	it.each( [
		[ "add", { label: "Create", type: "add", onClick: onClickMock } ],
		[ "delete", { label: "Delete", type: "delete", onClick: onClickMock } ],
		[ "link", { label: "Go", type: "link", href: "https://example.com" } ],
		[ "default", { label: "Default", onClick: onClickMock } ],
	] )( "matches snapshot for type '%s'", ( type, props ) => {
		const { container } = render( <CallToActionButton { ...props } /> );
		expect( container.firstChild ).toMatchSnapshot();
	} );

	describe( "when isLoading is true", () => {
		it( "shows loading state for delete type with correct text", () => {
			render( <CallToActionButton label="Delete" type="delete" onClick={ onClickMock } isLoading={ true } /> );
			const button = screen.getByRole( "button", { name: /deleting…/i } );
			expect( button ).toBeInTheDocument();
			// When loading, the button shows a loading spinner and the TrashIcon should not be shown
			expect( screen.getByRole( "img", { hidden: true } ) ).toBeInTheDocument();
		} );

		it( "shows loading state for default type with correct text", () => {
			render( <CallToActionButton label="Create Task" type="default" onClick={ onClickMock } isLoading={ true } /> );
			const button = screen.getByRole( "button", { name: /generating…/i } );
			expect( button ).toBeInTheDocument();
		} );

		it( "shows loading state for add type with unchanged label", () => {
			render( <CallToActionButton label="Add Item" type="add" onClick={ onClickMock } isLoading={ true } /> );
			const button = screen.getByRole( "button", { name: /add item/i } );
			expect( button ).toBeInTheDocument();
		} );

		it( "shows loading state for link type", () => {
			render( <CallToActionButton label="Go to Link" type="link" href="https://example.com" isLoading={ true } /> );
			const link = screen.getByRole( "link", { name: /go to link/i } );
			expect( link ).toBeInTheDocument();
			expect( link ).toHaveAttribute( "href", "https://example.com" );
		} );

		it( "shows loading spinner when isLoading is true", () => {
			render( <CallToActionButton label="Save" type="default" onClick={ onClickMock } isLoading={ true } /> );
			// Check for loading spinner by its role and class
			const loadingSpinner = screen.getByRole( "img", { hidden: true } );
			expect( loadingSpinner ).toBeInTheDocument();
			expect( loadingSpinner ).toHaveClass( "yst-animate-spin" );
		} );

		it( "still allows clicks when loading (not disabled by default)", () => {
			const handleClick = jest.fn();
			render( <CallToActionButton label="Save" type="default" onClick={ handleClick } isLoading={ true } /> );
			const button = screen.getByRole( "button", { name: /generating…/i } );
			fireEvent.click( button );
			expect( handleClick ).toHaveBeenCalledTimes( 1 );
		} );

		it( "applies cursor-wait class when loading", () => {
			render( <CallToActionButton label="Save" type="default" onClick={ onClickMock } isLoading={ true } /> );
			const button = screen.getByRole( "button", { name: /generating…/i } );
			expect( button ).toHaveClass( "yst-cursor-wait" );
		} );

		it.each( [
			[ "add", { label: "Create", type: "add", onClick: onClickMock, isLoading: true } ],
			[ "delete", { label: "Delete", type: "delete", onClick: onClickMock, isLoading: true } ],
			[ "link", { label: "Go", type: "link", href: "https://example.com", isLoading: true } ],
			[ "default", { label: "Default", onClick: onClickMock, isLoading: true } ],
		] )( "matches loading snapshot for type '%s'", ( type, props ) => {
			const { container } = render( <CallToActionButton { ...props } /> );
			expect( container.firstChild ).toMatchSnapshot();
		} );
	} );
} );
