import React, { act } from "react";
import renderer from "react-test-renderer";

import SvgIcon from "../src/SvgIcon";

test( "the SvgIcon matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<SvgIcon icon="edit" color="black" size="32px" className="my-icon" />
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "throws a warning when a non-existing icon is passed", () => {
	console.warn = jest.fn();
	act( () => {
		renderer.create(
			<SvgIcon icon="fake-icon" color="black" size="32px" className="my-icon" />
		);
	} );

	expect( console.warn ).toHaveBeenCalledTimes( 1 );
} );
