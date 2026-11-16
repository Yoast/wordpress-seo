import React from "react";
import { render } from "@testing-library/react";

import Heading from "../src/Heading.js";

test( "the Heading without props matches the snapshot", () => {
	const { container } = render(
		<Heading>Text</Heading>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the Heading with props matches the snapshot", () => {
	const { container } = render(
		<Heading level={ 2 } className="some-class">Text</Heading>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
