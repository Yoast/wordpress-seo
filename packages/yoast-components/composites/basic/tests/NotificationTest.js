import React from "react";

import { createComponentWithIntl } from "../../../utils/intlProvider";
import Notification from "../Notification.js";

test( "the Notification without props matches the snapshot", () => {
	const component = createComponentWithIntl(
		<Notification />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the Notification with props matches the snapshot", () => {
	const html = "Get started with our <a href=\"#blabla\">Configuration Wizard!</a>";

	const component = createComponentWithIntl(
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

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
