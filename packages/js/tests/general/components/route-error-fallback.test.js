import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { createMemoryRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from "react-router-dom";
import { RouteErrorFallback } from "../../../src/general/components";
import { render } from "../../test-utils";

const ERROR_MESSAGE = "Foo";
const LINK = "https://yoa.st/general-error-support";

jest.mock( "@wordpress/data", () => ( {
	useSelect: () => LINK,
} ) );

/**
 * @returns {JSX.Element} The element.
 */
const ErrorComponent = () => {
	throw new Error( ERROR_MESSAGE );
};

const consoleErrorImplementation = console.error;

const router = createMemoryRouter(
	createRoutesFromElements(
		<Route path="/" element={ <ErrorComponent /> } errorElement={ <RouteErrorFallback /> } />
	),
	{
		initialEntries: [ "/" ],
		initialIndex: 0,
	}
);

/**
 * @returns {JSX.Element} The element.
 */
const Page = () => (
	<RouterProvider router={ router }>
		<Outlet />
	</RouterProvider>
);

describe( "RouteErrorFallback", () => {
	beforeAll( () => {
		// Disable the console.error implementation.
		console.error = jest.fn();
	} );

	afterAll( () => {
		// Reset the console.error implementation.
		console.error = consoleErrorImplementation;
	} );

	it( "should contain an alert", () => {
		const { getByRole } = render( <Page /> );
		expect( getByRole( "alert" ) ).toBeInTheDocument();
	} );

	it( "should contain a heading", () => {
		const { getByRole } = render( <Page /> );
		const role = getByRole( "heading" );
		expect( role ).toBeInTheDocument();
		expect( role ).toHaveTextContent( "Something went wrong. An unexpected error occurred." );
	} );

	it( "should contain a status ", () => {
		const { getByRole } = render( <Page /> );
		const role = getByRole( "status" );
		expect( role ).toBeInTheDocument();
		// The error message should be displayed in the status role.
		expect( role ).toHaveTextContent( ERROR_MESSAGE );
	} );

	it( "should contain a button", () => {
		const { getByRole } = render( <Page /> );
		const role = getByRole( "button" );
		expect( role ).toBeInTheDocument();
		expect( role ).toHaveTextContent( "Refresh this page" );
	} );

	it( "should contain a link", () => {
		const { getByRole } = render( <Page /> );
		const role = getByRole( "link" );
		expect( role ).toBeInTheDocument();
		expect( role ).toHaveTextContent( "Contact support" );
		expect( role ).toHaveAttribute( "href", LINK );
		expect( role ).toHaveAttribute( "target", "_blank" );
		expect( role ).toHaveAttribute( "rel", "noopener" );
	} );
} );
