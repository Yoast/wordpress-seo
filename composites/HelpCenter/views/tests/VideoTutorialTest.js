import React from "react";
import renderer from "react-test-renderer";

import VideoTutorial from "../VideoTutorial.js";

test( "the VideoTutorial component matches the snapshot", () => {
	const component = renderer.create(
		<VideoTutorial src="https:/www.youtube.com/embed/bIgcj_pPIbw" title="Video title" description="Video description"/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

