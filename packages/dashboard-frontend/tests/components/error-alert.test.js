import { render } from "../test-utils";
import { ErrorAlert, createLinkMessage } from "../../src/components/error-alert";
import { it, expect } from "@jest/globals";
import { createInterpolateElement } from "@wordpress/element";
import { sprintf } from "@wordpress/i18n";
import { Link } from "@yoast/ui-library";

describe( "ErrorAlert", () => {
	const supportLink = "admin.php?page=wpseo_page_support";

	it( "should render null if no error is provided", () => {
		const { container } = render( <ErrorAlert supportLink={ supportLink } /> );
		expect( container.firstChild ).toBeNull();
	} );

	it( "should render timeout error message", () => {
		const error = new Error( "time out request" );
		error.status = 408;
		const { getByRole } = render( <ErrorAlert error={ error } supportLink={ supportLink } /> );
		expect( getByRole( "status" ) )
			.toHaveTextContent( "The request timed out. Try refreshing the page. If the problem persists, please check our Support page." );

		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "admin.php?page=wpseo_page_support" );
	} );

	it( "should render timeout error message when timeout error on client side", () => {
		const error = new Error( "time out request" );
		error.name = "TimeoutError";
		error.status = 200;
		const { getByRole } = render( <ErrorAlert error={ error } supportLink={ supportLink } /> );
		expect( getByRole( "status" ) )
			.toHaveTextContent( "The request timed out. Try refreshing the page. If the problem persists, please check our Support page." );

		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "admin.php?page=wpseo_page_support" );
	} );

	it( "should render permission error message", () => {
		const error = new Error( "no permission" );
		error.status = 403;
		const { getByRole } = render( <ErrorAlert error={ error } supportLink={ supportLink } /> );
		expect( getByRole( "status" ) )
			.toHaveTextContent( "You don’t have permission to access this resource. Please contact your admin for access. In case you need further help, please check our Support page." );

		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "admin.php?page=wpseo_page_support" );
	} );

	it( "should render default error message", () => {
		const error = new Error( "Bad request" );
		error.status = 500;
		const { getByRole } = render( <ErrorAlert error={ error } supportLink={ supportLink } /> );
		expect( getByRole( "status" ) )
			.toHaveTextContent( "Something went wrong. Try refreshing the page. If the problem persists, please check our Support page." );
		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "admin.php?page=wpseo_page_support" );
	} );

	it( "should not render the alert when no error is provided", () => {
		const { container } = render( <ErrorAlert supportLink={ supportLink } /> );
		expect( container.firstChild ).toBeNull();
	} );

	it( "should render the alert when an error is provided but no link", () => {
		const error = new Error( "Bad request" );
		error.status = 500;
		const { getByRole } = render( <ErrorAlert error={ error } /> );
		expect( getByRole( "status" ) )
			.toHaveTextContent( "Something went wrong. Try refreshing the page. If the problem persists, please check our Support page." );
	} );

	describe( "createLinkMessage", () => {
		it( "should return interpolated element when message and link are provided", () => {
			const message = "Check our %1$sSupport page%2$s.";
			const link = <Link href="admin.php?page=wpseo_page_support">Support page</Link>;
			const result = createLinkMessage( message, link );

			expect( result ).toEqual(
				createInterpolateElement( sprintf( message, "<link>", "</link>" ), { link } )
			);
		} );

		it( "should return message without placeholders when an error occurs", () => {
			const message = "Check our %1$sSupport page%2$s.";
			const link = null;
			const result = createLinkMessage( message, link );

			expect( result ).toEqual( sprintf( message, "", "" ) );
		} );
	} );
} );
