import React from "react";
import renderer from "react-test-renderer";

import { YoastLinkButton } from "../components/YoastLinkButton";

test( "the YoastLinkButton matches the snapshot", () => {
	const component = renderer.create(
		<YoastLinkButton>YoastLinkButtonValue</YoastLinkButton>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
