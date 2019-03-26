/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterTitle from "../../src/twitter/TwitterTitle";

describe( "TwitterTitle", () => {
	it( "matches the snapshot by default", () => {
		const component = renderer.create(
			<TwitterTitle title="My Twitter Title" />
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "truncates the title to a maximum length, which defaults to 70 characters", () => {
		const component = renderer.create(
			<TwitterTitle
				title={ "0123456789".repeat( 11 ) }
			/>
		);

		const tree = component.toJSON();
		expect( tree.children.length ).toEqual( 1 );
		expect( tree.children[ 0 ] ).toEqual( "0123456789".repeat( 7 ) );
	} );

	it( "truncates the title to a given maximum length", () => {
		const component = renderer.create(
			<TwitterTitle
				title="My Twitter Title"
				maximumTitleLength={ 2 }
			/>
		);

		const tree = component.toJSON();
		expect( tree.children.length ).toEqual( 1 );
		expect( tree.children[ 0 ] ).toEqual( "My" );
	} );
} );
