import React from "react";
import renderer from "react-test-renderer";

import HelpCenterWrapper from "../HelpCenterWrapper.js"

let tabItems = [
	{
		label: "Video tutorial",
		id: "video_tutorial",
		content: <h1>VideoTutorial</h1>
	},
	{

		label: "Knowledge base",
		id: "knowledge_base",
		content: <h1>KB</h1>
	},
	{
		label: "Support",
		id: "support",
		content: <h1>Support</h1>
	},
];

test( "the HelpCenterWrapper matches the snapshot", () => {
	const component = renderer.create(
		<HelpCenterWrapper items={ tabItems }/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
