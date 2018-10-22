import React from "react";
import renderer from "react-test-renderer";
import { UpsellButton } from "../components/UpsellButton";

test( "the YoastButton matches the snapshot", () => {
	const component = renderer.create(
		<UpsellButton backgroundColor="#c00" textColor="#fff">ButtonValue</UpsellButton>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the YoastButton executes callback", () => {
	const component = renderer.create(
		<UpsellButton
			onClick={
				() => {
					return "clicked";
				}
			}
		>ButtonValue</UpsellButton>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree.props.onClick();

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
