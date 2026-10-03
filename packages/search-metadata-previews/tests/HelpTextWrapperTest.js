/* External dependencies */
import React from "react";
import { fireEvent, render, screen } from "./test-utils";

/* Internal dependencies */
import HelpTextWrapper from "../src/snippet-preview/HelpTextWrapper";


describe( "HelpTextWrapper", () => {
	it( "matches the snapshot by default", () => {
		const { container } = render( <HelpTextWrapper helpTextButtonLabel="Open help" /> );
		expect( container ).toMatchSnapshot();
	} );

	it( "matches the snapshot when the help text button is focused", async() => {
		const { container } = render( <HelpTextWrapper helpTextButtonLabel="Open help" /> );

		fireEvent.click( screen.getByLabelText( "Open help" ) );
		expect( container ).toMatchSnapshot();
	} );
} );
