import React from "react";
import renderer from "react-test-renderer";

import YoastTabs from "../components/YoastTabs";

test( "the YoastTabs matches the snapshot", () => {
	const items = [
		{
			id: "tab1",
			label: "tab1",
			content: <p>This is some content for tab 1. <a href="#">focusable element 1</a></p>,
		},
		{
			id: "tab2",
			label: "tab2",
			content: <p>This is some content for tab 2. <a href="#">focusable element 2</a></p>,
		},
		{
			id: "tab3",
			label: "tab3",
			content: <p>This is some content for tab 3. <a href="#">focusable element 3</a></p>,
		},
	];

	const component = renderer.create(
		<YoastTabs items={ items } />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
