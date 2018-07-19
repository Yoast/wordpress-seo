import React from "react";
import renderer from "react-test-renderer";
import CornerstoneToggle from "../components/CornerstoneToggle";

test( "The CornerstoneToggle matches the snapshot", () => {
	const component = renderer.create(
		<CornerstoneToggle onChange={ () => {} } checked={ true } />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "The Cornerstone Toggle executes a callback", () => {
	const component = renderer.create(
		<CornerstoneToggle onChange={
			() => { return "changed"; } } />
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();

	tree.props.onChange();

	tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
