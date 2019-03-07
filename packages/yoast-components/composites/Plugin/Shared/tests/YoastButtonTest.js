import React from "react";
import renderer from "react-test-renderer";
import { YoastButton } from "../components/YoastButton";

test( "the YoastButton matches the snapshot", () => {
	const component = renderer.create(
		<YoastButton backgroundColor="#c00" textColor="#fff">ButtonValue</YoastButton>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the YoastButton executes callback", () => {
	const component = renderer.create(
		<YoastButton
			onClick={
				() => {
					return "clicked";
				}
			}
		>ButtonValue</YoastButton>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree.props.onClick();

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
