import { render } from "@testing-library/react";
import { ErrorAlert } from "../../../src/dashboard/components/error-alert";

describe( "ErrorAlert", () => {
	const supportLink = "admin.php?page=wpseo_page_support";

	it( "should render null if no error is provided", () => {
		const { container } = render( <ErrorAlert supportLink={ supportLink } /> );
		expect( container.firstChild ).toBeNull();
	} );

	it( "should render timeout error message", () => {
		const error = { status: 408 };
		const { getByRole } = render( <ErrorAlert error={ error } supportLink={ supportLink } /> );
		expect( getByRole( "status" ) )
			.toHaveTextContent( "The request timed out. Try refreshing the page. If the problem persists, please check our Support page." );

		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "admin.php?page=wpseo_page_support" );
	} );

	it( "should render permission error message", () => {
		const error = { status: 403 };
		const { getByRole } = render( <ErrorAlert error={ error } supportLink={ supportLink } /> );
		expect( getByRole( "status" ) )
			.toHaveTextContent( "You don’t have permission to access this resource. Please contact your admin for access. In case you need further help, please check our Support page." );

		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "admin.php?page=wpseo_page_support" );
	} );

	it( "should render default error message", () => {
		const error = { status: 500 };
		const { getByRole } = render( <ErrorAlert error={ error } supportLink={ supportLink } /> );
		expect( getByRole( "status" ) )
			.toHaveTextContent( "Something went wrong. Try refreshing the page. If the problem persists, please check our Support page." );
		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "admin.php?page=wpseo_page_support" );
	} );
} );
