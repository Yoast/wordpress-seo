import React from "react";
import renderer from "react-test-renderer";

import { Button, SnippetPreviewButton } from "../components/Button";

test( "the Button matches the snapshot", () => {
	const component = renderer.create(
		<Button>ButtonValue</Button>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "Button executes callback", () => {
	const component = renderer.create(
		<Button onClick={
			() => {
				return "clicked";
			}
		}>ButtonValue</Button>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree.props.onClick();

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the SnippetPreviewButton matches the snapshot", () => {
	const component = renderer.create(
		<Button>ButtonValue</Button>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "SnippetPreviewButton executes callback", () => {
	const component = renderer.create(
		<Button onClick={
			() => {
				return "clicked";
			}
		}>ButtonValue</Button>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree.props.onClick();

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
