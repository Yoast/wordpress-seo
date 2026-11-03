import React, { act } from "react";
import renderer from "react-test-renderer";

import IconCTAEditButton from "../src/IconCTAEditButton";

test( "the IconCTAEditButton matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<IconCTAEditButton
				className={ "class name" }
				onClick={ () => {} }
				id={ "edit button" }
				icon="edit"
				ariaLabel={ "jump to an edit field" }
			/>
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the IconCTAEditButton logs a deprecation warning", () => {
	const warn = jest.spyOn( console, "warn" ).mockImplementation( () => {} );

	act( () => {
		renderer.create(
			<IconCTAEditButton
				onClick={ jest.fn() }
				id={ "edit button" }
				icon="edit"
				ariaLabel={ "jump to an edit field" }
			/>
		);
	} );

	expect( warn ).toHaveBeenCalledWith( expect.stringContaining( "The IconCTAEditButton component has been deprecated" ) );
	warn.mockRestore();
} );
