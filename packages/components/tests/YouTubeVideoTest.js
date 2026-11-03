import React, { act } from "react";
import renderer from "react-test-renderer";

import YouTubeVideo from "../src/YouTubeVideo.js";

test( "the YouTubeVideo component matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<YouTubeVideo src="https://www.youtube.com/embed/bIgcj_pPIbw" title="Video title" />
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
