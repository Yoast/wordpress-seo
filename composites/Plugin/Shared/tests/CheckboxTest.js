import React from "react";
import renderer from "react-test-renderer";

import Checkbox from "../components/Checkbox";

test( "the Checkbox matches the snapshot", () => {
	const component = renderer.create(
		<Checkbox id="test-id" onChange={ value => console.log( value ) } label="test label" />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the Checkbox matches the snapshot when an array is provided as a label", () => {
	const component = renderer.create(
		<Checkbox id="test-id" onChange={ value => console.log( value ) } label={ [ "test label ", "using arrays" ] } />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the Checkbox executes callback", () => {
	let event = {
		target: {
			checked: false,
		},
	};
	const component = renderer.create(
		<Checkbox
			id="testCallback"
			onChange={ () => {
				console.log( "changed" );
			} }
			label="testCallbackLabel"
		/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree[ 0 ].props.onChange( event );

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the Checkbox executes callback when the state changes", () => {
	let event = {
		target: {
			checked: true,
		},
	};
	const component = renderer.create(
		<Checkbox
			id="testCallback"
			onChange={ () => {
				console.log( "changed" );
			} }
			label="testCallbackLabel"
		/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree[ 0 ].props.onChange( event );

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
