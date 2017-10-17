import React from "react";
import renderer from "react-test-renderer";

import IconButtonToggle from "../components/IconButtonToggle";
import eye from "../../../../style-guide/svg/eye.svg";

test( "the unpressed IconButtonToggle matches the snapshot", () => {
	const component = renderer.create(
		<IconButtonToggle name="group1" id="RadioButton" ariaLabel="important toggle" icon={ eye } pressed={ false } onClick={ () => {} }/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the pressed IconButtonToggle matches the snapshot", () => {
	const component = renderer.create(
		<IconButtonToggle name="group1" id="RadioButton2" ariaLabel="important toggle" icon={ eye } pressed={ true } onClick={ () => {} }/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
