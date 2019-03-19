import React from "react";
import renderer from "react-test-renderer";

import { HelpCenterButton } from "../HelpCenterButton";

test( "the HelpCenterButton matches the snapshot", () => {
	const component = renderer.create(
		<HelpCenterButton>Need Help?</HelpCenterButton>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
