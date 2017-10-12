import React from "react";
import renderer from "react-test-renderer";

import IconRadioButton from "../components/ChangingIconButton";
import eye from "../../../../style-guide/svg/eye.svg";
import eyeSlash from "../../../../style-guide/svg/eye-slash.svg";

test( "the unchecked ChangingIconButton matches the snapshot", () => {
	const component = renderer.create(
		<ChangingIconButton name="group1" id="RadioButton" checkedIcon={ eyeSlash } uncheckedIcon={ eye } checked={ false }/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the checked ChangingIconButton matches the snapshot", () => {
	const component = renderer.create(
		<ChangingIconButton name="group1" id="RadioButton2" checkedIcon={ eyeSlash } uncheckedIcon={ eye } checked={ true }/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
