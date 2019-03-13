/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import FacebookDescription from "../components/FacebookDescription";

describe( "FacebookDescription", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<FacebookDescription description="Cornerstone content is one of the most important building blocks of your site." />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "strips any HTML in the description", () => {
		const component = renderer.create(
			<FacebookDescription description="<h1>Cornerstone content is one of the most <strong>important</strong> building blocks of your site.</h1>" />
		);

		const tree = component.toJSON();
		expect( tree.children.length ).toEqual( 1 );
		expect( tree.children[ 0 ] ).toEqual( "Cornerstone content is one of the most important building blocks of your site." );
	} );
} );
