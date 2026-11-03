import React, { act } from "react";
import renderer from "react-test-renderer";

import { YoastLinkButton } from "../src/buttons/YoastLinkButton";

test( "the YoastLinkButton matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<YoastLinkButton>YoastLinkButtonValue</YoastLinkButton>
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
