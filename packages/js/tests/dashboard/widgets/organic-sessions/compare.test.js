import { describe, expect, test } from "@jest/globals";
import { OrganicSessionsCompare } from "../../../../src/dashboard/widgets/organic-sessions/compare";
import { render } from "../../../test-utils";

describe( "OrganicSessionsCompare", () => {
	const data = {
		sessions: "11",
		difference: 1.1428571428571428,
		formattedDifference: "114.29%",
	};
	const supportLink = "https://yoa.st/support";

	test( "renders component with data", () => {
		const { getByRole, getByText } = render( <OrganicSessionsCompare
			data={ data } isPending={ false } supportLink={ supportLink }
		/> );
		expect( getByRole( "heading", { name: "11" } ) ).toBeInTheDocument();
		expect( getByText( "+114.29%" ) ).toBeInTheDocument();
		expect( getByText( "Last 28 days" ) ).toBeInTheDocument();
	} );

	test( "renders component with pending state", () => {
		const { getByText } = render( <OrganicSessionsCompare
			data={ data } isPending={ true } supportLink={ supportLink }
		/> );
		expect( getByText( "10_000" ) ).toBeInTheDocument();
		expect( getByText( "^ +100%" ) ).toBeInTheDocument();
		expect( getByText( "Last 28 days" ) ).toBeInTheDocument();
	} );

	test( "renders component with error", () => {
		const error = new Error( "An error occurred" );
		const { getByRole } = render( <OrganicSessionsCompare
			data={ data } isPending={ false } error={ error } supportLink={ supportLink }
		/> );
		expect( getByRole( "status" ) )
			.toHaveTextContent( "Something went wrong. Try refreshing the page. If the problem persists, please check our Support page." );
		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", supportLink );
	} );
} );

