import React from "react";
import renderer from "react-test-renderer";

import IconLabeledButton from "../src/buttons/IconLabeledButton";

test( "the IconLabelledButton matches the snapshot", () => {
	const component = renderer.create(
		<IconLabeledButton icon="question-circle">Need help?</IconLabeledButton>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the IconLabelledButton with props matches the snapshot", () => {
	const component = renderer.create(
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

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
