import React from "react";
import renderer from "react-test-renderer";

import VideoTutorial from "../VideoTutorial.js";

test( "the VideoTutorial component matches the snapshot", () => {
	const component = renderer.create(
		<VideoTutorial
			src="https:/www.youtube.com/embed/bIgcj_pPIbw"
			title="Video title"
			items={[
				{
					title: "Need some help?",
					description: "Go Premium!",
					link: "#1",
					linkText: "Get Yoast SEO Premium now »",
				},
				{
					title: "Need some help?",
					description: "Go Premium!",
					link: "#2",
					linkText: "Get Yoast SEO Premium now »",
				},
			] }/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

