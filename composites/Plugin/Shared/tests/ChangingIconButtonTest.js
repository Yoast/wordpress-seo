import React from "react";
import renderer from "react-test-renderer";

import ChangingIconButton from "../components/ChangingIconButton";
import eye from "../../../../style-guide/svg/eye.svg";

test( "the unpressed ChangingIconButton matches the snapshot", () => {
	const component = renderer.create(
		<ChangingIconButton name="group1" id="RadioButton" icon={ eye } pressed={ false } onClick={ () => {} }/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the unpressed ChangingIconButton matches the snapshot", () => {
	const component = renderer.create(
		<ChangingIconButton name="group1" id="RadioButton2" icon={ eye } pressed={ true } onClick={ () => {} }/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
