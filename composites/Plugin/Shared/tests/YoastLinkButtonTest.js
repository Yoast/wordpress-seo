import React from "react";
import renderer from "react-test-renderer";

import { YoastLinkButton } from "../components/YoastLinkButton";

test( "the YoastLinkButton matches the snapshot", () => {
	const component = renderer.create(
		<YoastLinkButton>YoastLinkButtonValue</YoastLinkButton>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
