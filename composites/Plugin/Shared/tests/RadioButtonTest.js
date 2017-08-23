import React from "react";
import renderer from "react-test-renderer";

import IconRadioButton from "../components/RadioButton";
import eye from "../../../../style-guide/svg/eye.svg";
import eyeSlash from "../../../../style-guide/svg/eye-slash.svg";

test( "the unchecked IconRadioButton matches the snapshot", () => {
	const component = renderer.create(
		<IconRadioButton name="group1" id="RadioButton" checkedIcon={ eyeSlash } uncheckedIcon={ eye } checked={ false }/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the checked IconRadioButton matches the snapshot", () => {
	const component = renderer.create(
		<IconRadioButton name="group1" id="RadioButton2" checkedIcon={ eyeSlash } uncheckedIcon={ eye } checked={ true }/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
