import React from "react";
import renderer from "react-test-renderer";

import IconCTAEditButton from "../src/IconCTAEditButton";

test( "the IconCTAEditButton matches the snapshot", () => {
	const component = renderer.create(
		<IconCTAEditButton
			className={ "class name" }
			onClick={ () => {} }
			id={ "edit button" }
			icon="edit"
			ariaLabel={ "jump to an edit field" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
