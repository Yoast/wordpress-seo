import React from "react";
import renderer from "react-test-renderer";
import { YoastBaseButton, YoastButton } from "../components/YoastButton";

test( "the YoastBaseButton matches the snapshot", () => {
	const component = renderer.create(
		<YoastBaseButton>ButtonValue</YoastBaseButton>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "YoastBaseButton executes callback", () => {
	const component = renderer.create(
		<YoastBaseButton onClick={
			() => {
				return "clicked";
			}
		}>ButtonValue</YoastBaseButton>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree.props.onClick();

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the YoastButton matches the snapshot", () => {
	const component = renderer.create(
		<YoastButton backgroundColor="#c00" textColor="#fff">ButtonValue</YoastButton>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the YoastButton executes callback", () => {
	const component = renderer.create(
		<YoastButton onClick={
			() => {
				return "clicked";
			}
		}>ButtonValue</YoastButton>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree.props.onClick();

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
