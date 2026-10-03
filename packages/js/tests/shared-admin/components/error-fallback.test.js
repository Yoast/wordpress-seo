import { describe, expect, it } from "@jest/globals";
import { noop } from "lodash";
import { ErrorFallback } from "../../../src/shared-admin/components";
import { render } from "../../test-utils";

const ERROR = { message: "Foo" };
const LINK = "https://yoa.st/error-support";

describe( "ErrorFallback", () => {
	it( "should contain an alert", () => {
		const { getByRole } = render( <ErrorFallback error={ ERROR } /> );
		expect( getByRole( "alert" ) ).toBeInTheDocument();
	} );

	it( "should contain a heading", () => {
		const { getByRole } = render( <ErrorFallback error={ ERROR } /> );
		const role = getByRole( "heading" );
		expect( role ).toBeInTheDocument();
		expect( role ).toHaveTextContent( "Something went wrong. An unexpected error occurred." );
	} );

	it( "should contain a status ", () => {
		const { getByRole } = render( <ErrorFallback error={ ERROR } /> );
		const role = getByRole( "status" );
		expect( role ).toBeInTheDocument();
		// The error message should be displayed in the status role.
		expect( role ).toHaveTextContent( ERROR.message );
	} );

	describe.each( [
		[ "HorizontalButtons", <ErrorFallback.HorizontalButtons key="HorizontalButtons" handleRefreshClick={ noop } supportLink={ LINK } /> ],
		[ "VerticalButtons", <ErrorFallback.VerticalButtons key="VerticalButtons" handleRefreshClick={ noop } supportLink={ LINK } /> ],
	] )( "%s", ( _, children ) => {
		it( "should contain a button", () => {
			const { getByRole } = render( <ErrorFallback error={ ERROR }>{ children }</ErrorFallback> );
			const role = getByRole( "button" );
			expect( role ).toBeInTheDocument();
			expect( role ).toHaveTextContent( "Refresh this page" );
		} );

		it( "should contain a link", () => {
			const { getByRole } = render( <ErrorFallback error={ ERROR }>{ children }</ErrorFallback> );
			const role = getByRole( "link" );
			expect( role ).toBeInTheDocument();
			expect( role ).toHaveTextContent( "Contact support" );
			expect( role ).toHaveAttribute( "href", LINK );
			expect( role ).toHaveAttribute( "target", "_blank" );
			expect( role ).toHaveAttribute( "rel", "noopener" );
		} );
	} );
} );
