import React from "react";
import renderer from "react-test-renderer";
import CornerstoneToggle from "../../src/components/CornerstoneToggle";

test( "The CornerstoneToggle matches the snapshot", () => {
	const component = renderer.create(
		<CornerstoneToggle onChange={ () => {} } checked={ true } />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
