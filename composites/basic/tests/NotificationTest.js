import React from "react";
import renderer from "react-test-renderer";

import Notification from "../Notification.js";

test( "the Notification without props matches the snapshot", () => {
	const component = renderer.create(
		<Notification />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the Notification with props matches the snapshot", () => {
	const component = renderer.create(
		<Notification
			title="New User?"
			isDismissable={ true }
			imageSrc="some-image.png"
			imageWidth="40px"
			imageHeight="40px"
			onClick={ () => {
				return "clicked";
			} }
		>
			<p>Get started with our <a href="#blabla">Configuration Wizard!</a></p>
		</Notification>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
