import React from "react";
import { render } from "@testing-library/react";

import StackedProgressBar from "../src/StackedProgressBar";

test( "the StackedProgressBar matches the snapshot", () => {
	const items = [
		{
			value: 7,
			color: "#F00",
		},
		{
			value: 216,
			color: "#FF0",
		},
		{
			value: 1134,
			color: "#0FF",
		},
		{
			value: 76,
			color: "#333",
		},
	];

	const { container } = render(
		<StackedProgressBar
			items={ items }
		/>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
