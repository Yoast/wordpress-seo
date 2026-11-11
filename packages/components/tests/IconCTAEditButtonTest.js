import React from "react";
import { render } from "@testing-library/react";
import { noop } from "lodash";

import IconCTAEditButton from "../src/IconCTAEditButton";

test( "the IconCTAEditButton matches the snapshot", () => {
	const { container } = render(
		<IconCTAEditButton
			className={ "class name" }
			onClick={ noop }
			id={ "edit button" }
			icon="edit"
			ariaLabel={ "jump to an edit field" }
		/>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the IconCTAEditButton logs a deprecation warning", () => {
	const warn = jest.spyOn( console, "warn" ).mockImplementation( noop );

	render(
		<IconCTAEditButton
			onClick={ jest.fn() }
			id={ "edit button" }
			icon="edit"
			ariaLabel={ "jump to an edit field" }
		/>
	);

	expect( warn ).toHaveBeenCalledWith( expect.stringContaining( "The IconCTAEditButton component has been deprecated" ) );
	warn.mockRestore();
} );
