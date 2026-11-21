import React from "react";
import { render } from "@testing-library/react";

import SvgIcon from "../src/SvgIcon";

test( "the SvgIcon matches the snapshot", () => {
	const { container } = render(
		<SvgIcon icon="edit" color="black" size="32px" className="my-icon" />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "throws a warning when a non-existing icon is passed", () => {
	console.warn = jest.fn();
	render(
		<SvgIcon icon="fake-icon" color="black" size="32px" className="my-icon" />
	);

	expect( console.warn ).toHaveBeenCalledTimes( 1 );
} );
