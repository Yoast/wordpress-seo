import React from "react";
import renderer from "react-test-renderer";

import StackedProgressBar from "../components/StackedProgressBar";

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

	const component = renderer.create(
		<StackedProgressBar
			items={ items }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
