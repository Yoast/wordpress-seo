import React from "react";

import renderer from "react-test-renderer";
import HelpCenter from "../HelpCenter";

const tabItems = [
	{
		label: "Video tutorial",
		id: "video_tutorial",
		content: <h1>VideoTutorial</h1>,
	},
	{

		label: "Knowledge base",
		id: "knowledge_base",
		content: <h1>KB</h1>,
	},
	{
		label: "Get support",
		id: "support",
		content: <h1>Support</h1>,
	},
];

test( "the HelpCenter matches the snapshot", () => {
	const component = renderer.create(
		<HelpCenter items={ tabItems } />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the HelpCenter with props matches the snapshot", () => {
	const component = renderer.create(
		<HelpCenter
			buttonBackgroundColor="#c30"
			buttonTextColor="#fff"
			buttonIconColor="#fff"
			buttonWithTextShadow={ false }
			tabsTextColor="#ff0"
			tabsFontSize="16px"
			tabsTextTransform="uppercase"
			tabsFontWeight="600"
			tabsBaseWidth="250px"
			items={ tabItems }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
