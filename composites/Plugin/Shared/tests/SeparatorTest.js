import React from "react";
import renderer from "react-test-renderer";

import Separator from "../components/Separator";

describe( Separator, () => {
	it( "matches the snapshot", () => {
		const component = renderer.create(
			<Separator />
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when passing a border color", () => {
		const component = renderer.create(
			<Separator borderColor={ "#ddd" } />
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot when passing a margin", () => {
		const component = renderer.create(
			<Separator margin={ "32px 6px" } />
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
