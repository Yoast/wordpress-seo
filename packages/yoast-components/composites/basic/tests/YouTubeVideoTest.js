import React from "react";
import renderer from "react-test-renderer";

import YouTubeVideo from "../YouTubeVideo.js";

test( "the YouTubeVideo component matches the snapshot", () => {
	const component = renderer.create(
		<YouTubeVideo src="https://www.youtube.com/embed/bIgcj_pPIbw" title="Video title" />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
