import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { YoastButton } from "../src/buttons/YoastButton";

test( "the YoastButton matches the snapshot", () => {
	const { container } = render(
		<YoastButton backgroundColor="#c00" textColor="#fff">ButtonValue</YoastButton>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the YoastButton executes callback", () => {
	const onClick = jest.fn();
	const { container, asFragment } = render(
		<YoastButton onClick={ onClick }>ButtonValue</YoastButton>
	);

	expect( container.firstChild ).toMatchSnapshot();

	fireEvent.click( container.firstChild );
	expect( onClick ).toHaveBeenCalledTimes( 1 );

	expect( asFragment().firstChild ).toMatchSnapshot();
} );
