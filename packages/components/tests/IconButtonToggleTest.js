import React from "react";
import renderer from "react-test-renderer";

import IconButtonToggle from "../src/IconButtonToggle";

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

test( "the IconButtonToggle logs a deprecation warning", () => {
	const warn = jest.spyOn( console, "warn" ).mockImplementation( () => {} );

	renderer.create(
		<IconButtonToggle
			id="RadioButton"
			ariaLabel="important toggle"
			icon="eye"
			pressed={ false }
			onClick={ jest.fn() }
		/>
	);

	expect( warn ).toHaveBeenCalledWith( expect.stringContaining( "The IconButtonToggle component has been deprecated" ) );
	warn.mockRestore();
} );
