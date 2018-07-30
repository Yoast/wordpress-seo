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
