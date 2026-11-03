// External dependencies.
import React, { act } from "react";
import renderer from "react-test-renderer";

// Internal dependencies.
import { IconButton, BaseButton, Button } from "../src/index";

test( "the BaseButton matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<BaseButton>ButtonValue</BaseButton>
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "BaseButton executes callback", () => {
	let component;
	act( () => {
		component = renderer.create(
			<BaseButton
				onClick={
					() => {
						return "clicked";
					}
				}
			>ButtonValue</BaseButton>
		);
	} );

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree.props.onClick();

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the SnippetPreviewButton matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<Button>ButtonValue</Button>
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "SnippetPreviewButton executes callback", () => {
	let component;
	act( () => {
		component = renderer.create(
			<Button
				onClick={
					() => {
						return "clicked";
					}
				}
			>ButtonValue</Button>
		);
	} );

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree.props.onClick();

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the IconButton matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<IconButton icon="edit" iconColor="black" />
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the IconButton with text matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<IconButton icon="edit" iconColor="black">Click</IconButton>
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
