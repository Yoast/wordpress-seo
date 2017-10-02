import React from "react";
import renderer from "react-test-renderer";

import { HelpCenter } from "../../../Plugin/HelpCenter/HelpCenter.js";

let tabItems = [
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
		<HelpCenter items={ tabItems }/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
