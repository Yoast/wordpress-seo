import React from "react";
import { render } from "@testing-library/react";
import Notification from "../src/Notification.js";

test( "the Notification without props matches the snapshot", () => {
	const { container } = render(
		<Notification />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the Notification with props matches the snapshot", () => {
	const html = "Get started with our <a href=\"#blabla\">Configuration Wizard!</a>";

	const { container } = render(
		<Notification
			title="New User?"
			html={ html }
			isDismissable={ true }
			imageSrc="some-image.png"
			imageWidth="40px"
			imageHeight="40px"
			onClick={ () => {
				return "clicked";
			} }
		/>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
