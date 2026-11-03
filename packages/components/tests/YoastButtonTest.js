import React, { act } from "react";
import renderer from "react-test-renderer";
import { YoastButton } from "../src/buttons/YoastButton";

test( "the YoastButton matches the snapshot", () => {
	let component;
	act( () => {
		component = renderer.create(
			<YoastButton backgroundColor="#c00" textColor="#fff">ButtonValue</YoastButton>
		);
	} );

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the YoastButton executes callback", () => {
	let component;
	act( () => {
		component = renderer.create(
			<YoastButton
				onClick={
					() => {
						return "clicked";
					}
				}
			>ButtonValue</YoastButton>
		);
	} );

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree.props.onClick();

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
