import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { UpsellButton } from "../src/buttons/UpsellButton";

test( "the YoastButton matches the snapshot", () => {
	const { container } = render(
		<UpsellButton backgroundColor="#c00" textColor="#fff">ButtonValue</UpsellButton>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the YoastButton executes callback", () => {
	const onClick = jest.fn();
	const { container, asFragment } = render(
		<UpsellButton onClick={ onClick }>ButtonValue</UpsellButton>
	);

	expect( container.firstChild ).toMatchSnapshot();

	fireEvent.click( container.firstChild );
	expect( onClick ).toHaveBeenCalledTimes( 1 );

	expect( asFragment().firstChild ).toMatchSnapshot();
} );
