import { render, fireEvent } from "../../test-utils";
import { Collapsible } from "../../../src/general/components/collapsible";

describe( "Collapsible", () => {
	it( "should hide children when collapsible is closed", () => {
		const { queryByText } = render( <Collapsible label="5 hidden notificaions">
			<div>Test Children</div>
		</Collapsible> );

		const childrenElement = queryByText( "Test Children" );
		expect( childrenElement ).not.toBeInTheDocument();
	} );
	it( "should show children when collapsible is open", () => {
		const { queryByText, getByRole } = render( <Collapsible label="5 hidden notificaions">
			<div>Test Children</div>
		</Collapsible> );

		const buttonElement = getByRole( "button" );
		fireEvent.click( buttonElement );

		const childrenElement = queryByText( "Test Children" );
		expect( childrenElement ).toBeInTheDocument();
	} );
} );
