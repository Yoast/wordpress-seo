/* External dependencies */
import React from "react";
import { render } from "@testing-library/react";

/* Internal dependencies */
import HelpText from "../src/HelpText";

describe( "HelpText", () => {
	it( "matches the snapshot by default", () => {
		const { container } = render(
			<HelpText>
				{ "Some help text." }
			</HelpText>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "matches the snapshot when an array is provided as text", () => {
		const { container } = render(
			<HelpText>
				{ [ "Text ", <a key="1" href="https://www.example.org">with a link</a>, " in the middle." ] }
			</HelpText>
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
