import React from "react";
import { render } from "@testing-library/react";

import IconLabeledButton from "../src/buttons/IconLabeledButton";

test( "the IconLabelledButton matches the snapshot", () => {
	const { container } = render(
		<IconLabeledButton icon="question-circle">Need help?</IconLabeledButton>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the IconLabelledButton with props matches the snapshot", () => {
	const { container } = render(
		<IconLabeledButton
			type="reset"
			icon="eye"
			iconColor="#0f0"
			textColor="#0f0"
			textFontSize="1em"
			backgroundColor="#ff0"
			borderColor="#000"
			hoverColor="#fff"
			hoverBackgroundColor="#a4286a"
			hoverBorderColor="#f00"
			activeColor="#fff"
			activeBackgroundColor="#a4286a"
			activeBorderColor="#a4286a"
			focusColor="#a4286a"
			focusBackgroundColor="#e1bee7"
			focusBorderColor="#a4286a"
		>
			Hello
		</IconLabeledButton>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
