import React from "react";
import { render } from "@testing-library/react";

import YouTubeVideo from "../src/YouTubeVideo.js";

test( "the YouTubeVideo component matches the snapshot", () => {
	const { container } = render(
		<YouTubeVideo src="https://www.youtube.com/embed/bIgcj_pPIbw" title="Video title" />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
