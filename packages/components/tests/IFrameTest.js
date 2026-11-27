import React from "react";
import { render } from "@testing-library/react";

import IFrame from "../src/IFrame.js";

test( "the IFrame without props matches the snapshot", () => {
	const { container } = render(
		<IFrame title="IFrame title" />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the IFrame with props matches the snapshot", () => {
	const { container } = render(
		<IFrame title="IFrame title" className="test-class-name" />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
