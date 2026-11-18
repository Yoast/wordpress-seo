import React from "react";
import { render } from "@testing-library/react";

import Paper from "../src/Paper.js";

test( "the Paper without props matches the snapshot", () => {
	const { container } = render(
		<Paper />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the Paper with props matches the snapshot", () => {
	const { container } = render(
		<Paper backgroundColor="#eee" minHeight="10em" />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
