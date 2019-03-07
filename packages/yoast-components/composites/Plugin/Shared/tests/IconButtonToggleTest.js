import React from "react";
import renderer from "react-test-renderer";

import IconButtonToggle from "../components/IconButtonToggle";

test( "the unpressed IconButtonToggle matches the snapshot", () => {
	const component = renderer.create(
		<IconButtonToggle
			name="group1"
			id="RadioButton"
			ariaLabel="important toggle"
			icon="eye"
			pressed={ false }
			onClick={ () => {} }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the pressed IconButtonToggle matches the snapshot", () => {
	const component = renderer.create(
		<IconButtonToggle
			name="group1"
			id="RadioButton2"
			ariaLabel="important toggle"
			icon="eye"
			pressed={ true }
			onClick={ () => {} }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the disabled IconButtonToggle matches the snapshot", () => {
	const component = renderer.create(
		<IconButtonToggle
			name="group1"
			id="RadioButton2"
			ariaLabel="important toggle"
			icon="eye"
			pressed={ false }
			onClick={ () => {} }
			marksButtonStatus={ "disabled" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
