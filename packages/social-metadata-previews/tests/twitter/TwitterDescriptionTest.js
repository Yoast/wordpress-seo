/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";

/* Internal dependencies */
import TwitterDescription from "../../src/twitter/TwitterDescription";

describe( "TwitterDescription", () => {
	it( "matches the snapshot for the summary card", () => {
		const component = renderer.create(
			<TwitterDescription
				description={
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description."
				}
				isLarge={ false }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "matches the snapshot for the summary with large image card", () => {
		const component = renderer.create(
			<TwitterDescription
				description={
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description."
				}
				isLarge={ true }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
