import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { RenderInPortalIfElementExists } from "../../src/elementor/components/render-in-portal-if-element-exists";
import { act, render, waitFor } from "../test-utils";

/**
 * Creates an HTML element.
 * @param {string} id The ID.
 * @returns {HTMLElement} The HTML element.
 */
const createHtmlElement = ( id ) => {
	const element = document.createElement( "div" );
	element.setAttribute( "id", id );
	document.body.appendChild( element );

	return element;
};

// Just to be sure we leave the document body as before.
const innerHtml = document.body.innerHTML;

describe( RenderInPortalIfElementExists.name, () => {
	jest.doMock( "@wordpress/element", () => {
		const actual = jest.requireActual( "@wordpress/element" );

		return {
			...actual,
			createPortal: jest.fn( actual.createPortal ),
		};
	} );

	afterEach( () => {
		/**
		 * Clean up the document body.
		 * - when creating our HTML element we need to remove it from the document body.
		 * - the `createPortal` function adds a separate div element that is not cleaned up on unmount.
		 */
		document.body.innerHTML = innerHtml;
	} );

	it( "should return null if the element does not exist", () => {
		const { queryByText } = render( <RenderInPortalIfElementExists id="does-not-exist">foo</RenderInPortalIfElementExists> );
		expect( queryByText( "foo" ) ).toBeNull();
	} );

	it( "should return the children if the element exists", () => {
		const id = "exists";
		createHtmlElement( id );
		const { getByText, unmount } = render( <RenderInPortalIfElementExists id={ id }>foo</RenderInPortalIfElementExists> );

		try {
			expect( getByText( "foo" ) ).toBeInTheDocument();
		} finally {
			// Needed to remove the mutation observer, or we trigger again due to the afterEach cleanup.
			unmount();
		}
	} );

	it( "should return the children once the element is created", async() => {
		const id = "exists";
		const { getByText, queryByText, unmount } = render( <RenderInPortalIfElementExists id={ id }>foo</RenderInPortalIfElementExists> );

		try {
			expect( queryByText( "foo" ) ).toBeNull();

			act( () => {
				createHtmlElement( id );
			} );

			await waitFor( () => {
				expect( getByText( "foo" ) ).toBeInTheDocument();
			} );
		} finally {
			// Needed to remove the mutation observer, or we trigger again due to the afterEach cleanup.
			unmount();
		}
	} );
} );
