import React from "react";
import renderer from "react-test-renderer";

import YoastTabs from "../components/YoastTabs";

const items = [
	{
		id: "tab1",
		label: "tab1",
		content: <p>This is some content for tab 1. <a href="#1">focusable element 1</a></p>,
	},
	{
		id: "tab2",
		label: "tab2",
		content: <p>This is some content for tab 2. <a href="#2">focusable element 2</a></p>,
	},
	{
		id: "tab3",
		label: "tab3",
		content: <p>This is some content for tab 3. <a href="#3">focusable element 3</a></p>,
	},
];

test( "the YoastTabs matches the snapshot", () => {
	const component = renderer.create(
		<YoastTabs items={ items } />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the YoastTabs with props matches the snapshot", () => {
	const component = renderer.create(
		<YoastTabs
			tabsTextColor="#0f0"
			tabsFontSize="2em"
			tabsTextTransform="uppercase"
			tabsFontWeight="600"
			tabsBaseWidth="300px"
			items={ items }
			onTabsMounted={ () => {
				return "mounted";
			} }
			onTabSelect={ () => {
				return "selected";
			} }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
