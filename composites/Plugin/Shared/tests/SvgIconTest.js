import React from "react";
import renderer from "react-test-renderer";

import SvgIcon from "../components/SvgIcon";

test( "the SvgIcon matches the snapshot", () => {
	const component = renderer.create(
		<SvgIcon icon="edit" color="black" size="32px" className="my-icon" />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "throws a warning when a non-existing icon is passed", () => {
	console.warn = jest.fn();
	renderer.create(
		<SvgIcon icon="fake-icon" color="black" size="32px" className="my-icon" />
	);

	expect( console.warn ).toHaveBeenCalledTimes( 1 );
} );
