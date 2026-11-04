// External dependencies.
import React from "react";
import { render, fireEvent } from "@testing-library/react";

// Internal dependencies.
import { IconButton, BaseButton, Button } from "../src/index";

test( "the BaseButton matches the snapshot", () => {
	const { container } = render(
		<BaseButton>ButtonValue</BaseButton>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "BaseButton executes callback", () => {
	const onClick = jest.fn();
	const { container, asFragment } = render(
		<BaseButton
			onClick={ onClick }
		>ButtonValue</BaseButton>
	);

	expect( container.firstChild ).toMatchSnapshot();

	fireEvent.click( container.firstChild );

	expect( onClick ).toHaveBeenCalledTimes( 1 );
	expect( asFragment().firstChild ).toMatchSnapshot();
} );

test( "the SnippetPreviewButton matches the snapshot", () => {
	const { container } = render(
		<Button>ButtonValue</Button>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "SnippetPreviewButton executes callback", () => {
	const onClick = jest.fn();
	const { container, asFragment } = render(
		<Button
			onClick={ onClick }
		>ButtonValue</Button>
	);

	expect( container.firstChild ).toMatchSnapshot();

	fireEvent.click( container.firstChild );

	expect( onClick ).toHaveBeenCalledTimes( 1 );
	expect( asFragment().firstChild ).toMatchSnapshot();
} );

test( "the IconButton matches the snapshot", () => {
	const { container } = render(
		<IconButton icon="edit" iconColor="black" />
	);

	expect( container.firstChild ).toMatchSnapshot();
} );

test( "the IconButton with text matches the snapshot", () => {
	const { container } = render(
		<IconButton icon="edit" iconColor="black">Click</IconButton>
	);

	expect( container.firstChild ).toMatchSnapshot();
} );
